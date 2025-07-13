// @ts-ignore - Deno imports for Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - Deno imports for Supabase Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore - Deno imports for Supabase Edge Functions
import OpenAI from 'https://esm.sh/openai@4.28.0'
// @ts-ignore - Deno imports for Pinecone
import { Pinecone } from 'https://esm.sh/@pinecone-database/pinecone@2.0.1'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const openaiKey = Deno.env.get('OPENAI_API_KEY')!
const pineconeApiKey = Deno.env.get('PINECONE_API_KEY')!
const pineconeIndexName = Deno.env.get('PINECONE_INDEX_NAME') || 'spool-textbook-embeddings'
const pineconeNamespace = Deno.env.get('PINECONE_NAMESPACE') || 'production'

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const openai = new OpenAI({ apiKey: openaiKey })

// Initialize Pinecone client (optional - will work without it)
let pinecone: Pinecone | null = null
try {
  if (pineconeApiKey) {
    pinecone = new Pinecone({
      apiKey: pineconeApiKey,
    })
    console.log('✅ Pinecone client initialized')
  } else {
    console.log('⚠️ Pinecone API key not found - content search will be skipped')
  }
} catch (error) {
  console.error('❌ Failed to initialize Pinecone:', error)
  pinecone = null
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Check if Pinecone is configured
    if (!pineconeApiKey) {
      console.warn('⚠️ PINECONE_API_KEY not set, will skip content search')
    }
    
    const { proposal, studentProfileId } = await req.json()
    
    // Step 1: Map concepts across subjects using GPT-4
    const conceptMapping = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system' as const,
          content: `You are an expert curriculum designer. Given a learning goal, identify all relevant academic concepts from any subject that would help achieve this goal. Consider concepts from Math, Science, Literature, History, Art, Business, Technology, and Life Skills. Each concept should be essential or highly supportive of the learning goal.`
        },
        {
          role: 'user' as const,
          content: `Learning Goal: ${proposal.goal}\nObjectives: ${proposal.objectives.join(', ')}\n\nIdentify 20-50 specific concepts across all subjects that are relevant to this goal.`
        }
      ],
      tools: [
        {
          type: 'function' as const,
          function: {
            name: 'map_concepts',
            description: 'Map concepts across subjects for the learning goal',
            parameters: {
              type: 'object',
              properties: {
                concepts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      subject: { type: 'string' },
                      description: { type: 'string' },
                      relevance_hypothesis: { type: 'string' },
                      prerequisites: { type: 'array', items: { type: 'string' } }
                    }
                  }
                },
                subjects_involved: {
                  type: 'array',
                  items: { type: 'string' }
                },
                primary_subject: { type: 'string' }
              }
            }
          }
        }
      ],
      tool_choice: { type: 'function' as const, function: { name: 'map_concepts' } }
    })
    
    const toolCall = conceptMapping.choices[0].message?.tool_calls?.[0]
    const mappedConcepts = toolCall ? JSON.parse(toolCall.function.arguments) : { concepts: [] }
    
    // Check if we have concepts to work with
    if (!mappedConcepts.concepts || mappedConcepts.concepts.length === 0) {
      console.error('❌ No concepts mapped from learning goal')
      throw new Error('Unable to map concepts for the learning goal. Please try rephrasing your goal.')
    }
    
    // Step 2: Generate embeddings for concept search
    const conceptTexts = mappedConcepts.concepts.map((c: any) => 
      `${c.name} in ${c.subject}: ${c.description}. Relevance to "${proposal.goal}": ${c.relevance_hypothesis}`
    )
    
    // Ensure we have texts to embed
    if (conceptTexts.length === 0) {
      console.error('❌ No concept texts to embed')
      throw new Error('No concepts available for embedding')
    }
    
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: conceptTexts
    })
    
    // Step 3: Search Pinecone for relevant content (80% threshold)
    let relevantContent: any[];
    
    if (pineconeApiKey && pinecone) {
      console.log('🔍 Searching Pinecone for relevant content...')
      
      // Get Pinecone index
      const index = pinecone.index(pineconeIndexName)
      
      // Search for each concept's relevant content
      const searchPromises = mappedConcepts.concepts.map(async (concept: any, idx: number) => {
        const embedding = embeddingResponse.data[idx].embedding
        
        try {
          // Query Pinecone for similar content
          const queryResponse = await index.namespace(pineconeNamespace).query({
            vector: embedding,
            topK: 5, // Get top 5 most relevant chunks per concept
            includeMetadata: true,
            filter: {
              // Can add filters here if needed, e.g., by subject or difficulty
            }
          })
          
          // Filter results by 80% relevance threshold
          const relevantMatches = queryResponse.matches?.filter(
            match => (match.score || 0) >= 0.80
          ) || []
          
          console.log(`✅ Found ${relevantMatches.length} relevant chunks for concept: ${concept.name}`)
          
          return {
            concept,
            relevance_score: relevantMatches.length > 0 
              ? relevantMatches[0].score || 0.80 
              : 0.80,
            content_chunks: relevantMatches.map(match => ({
              id: match.id,
              score: match.score,
              metadata: match.metadata,
              text: match.metadata?.searchableText || match.metadata?.text || ''
            })),
            embedding: embedding
          }
        } catch (searchError) {
          console.error(`❌ Pinecone search error for concept ${concept.name}:`, searchError)
          // Return with empty content chunks on error
          return {
            concept,
            relevance_score: 0.80,
            content_chunks: [],
            embedding: embedding
          }
        }
      })
      
      // Wait for all searches to complete
      relevantContent = await Promise.all(searchPromises)
      
      console.log(`📊 Total content chunks found: ${relevantContent.reduce((sum, item) => sum + item.content_chunks.length, 0)}`)
    } else {
      // Fallback if Pinecone is not configured
      console.log('⚠️ Skipping Pinecone search - using concept mapping only')
      relevantContent = mappedConcepts.concepts.map((concept: any, idx: number) => ({
        concept,
        relevance_score: 0.85, // Default relevance
        content_chunks: [],
        embedding: embeddingResponse.data[idx].embedding
      }))
    }
    
    // Step 4: Create Thread in database
    const { data: thread, error: threadError } = await supabase
      .from('threads')
      .insert({
        user_id: studentProfileId,
        title: proposal.suggested_title,
        situation_title: `Learning Journey: ${proposal.goal}`,
        situation_description: `A personalized learning journey to ${proposal.goal}`,
        concepts: relevantContent.map(item => ({
          id: item.concept.id,
          name: item.concept.name,
          relevance: item.relevance_score
        })),
        primary_skill_focus: {
          skill: mappedConcepts.primary_subject || 'Cross-curricular',
          description: `Focused on ${proposal.goal}`
        },
        status: 'active',
        current_concept_id: relevantContent[0]?.concept.id || 'probability',
        // New fields for Pinecone integration
        mapped_concepts: mappedConcepts,
        content_chunks: relevantContent.map(item => ({
          concept_id: item.concept.id,
          concept_name: item.concept.name,
          chunks: item.content_chunks
        })),
        concept_embeddings: relevantContent.map(item => ({
          concept_id: item.concept.id,
          concept_name: item.concept.name,
          embedding_preview: item.embedding.slice(0, 10) // Store only first 10 values for debugging
        }))
      })
      .select()
      .single()
    
    if (threadError) {
      console.error('❌ Database error:', threadError)
      throw new Error(`Database error: ${threadError.message}`)
    }
    
    // Step 5: Create thread concepts array for response (no separate table needed)
    const threadConcepts = relevantContent
      .sort((a, b) => {
        // Sort by prerequisites and relevance
        if (a.concept.prerequisites.length < b.concept.prerequisites.length) return -1
        if (a.concept.prerequisites.length > b.concept.prerequisites.length) return 1
        return b.relevance_score - a.relevance_score
      })
      .map((item, idx) => ({
        concept_id: item.concept.id,
        concept_name: item.concept.name,
        subject: item.concept.subject,
        relevance_score: item.relevance_score,
        relevance_explanation: item.concept.relevance_hypothesis,
        sequence_order: idx + 1,
        is_core_concept: item.relevance_score >= 0.90,
        prerequisite_concept_ids: item.concept.prerequisites,
        status: idx === 0 ? 'available' : 'pending',
        has_content: item.content_chunks.length > 0
      }))
    
    // Step 6: Create thread graph in Neo4j (simulated for now)
    // In production, you would create the graph structure in Neo4j here
    
    return new Response(
      JSON.stringify({
        success: true,
        thread: {
          id: thread.id,
          title: thread.title,
          goal: thread.situation_title,
          concepts_count: threadConcepts.length,
          subjects: mappedConcepts.subjects_involved,
          estimated_hours: Math.floor(threadConcepts.length * 2.5),
          visualization_data: {
            nodes: threadConcepts.map(tc => ({
              id: tc.concept_id,
              name: tc.concept_name,
              subject: tc.subject,
              relevance: tc.relevance_score,
              sequence: tc.sequence_order,
              hasContent: tc.has_content || false
            })),
            edges: [] // Would include prerequisite relationships
          },
          content_summary: {
            total_chunks: relevantContent.reduce((sum, item) => sum + item.content_chunks.length, 0),
            concepts_with_content: relevantContent.filter(item => item.content_chunks.length > 0).length,
            concepts_without_content: relevantContent.filter(item => item.content_chunks.length === 0).length
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('❌ Thread generation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString() 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 