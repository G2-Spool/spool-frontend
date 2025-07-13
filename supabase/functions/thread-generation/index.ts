// @ts-ignore - Deno imports for Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - Deno imports for Supabase Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore - Deno imports for Supabase Edge Functions
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const openaiKey = Deno.env.get('OPENAI_API_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const openai = new OpenAIApi(new Configuration({ apiKey: openaiKey }))

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { proposal, studentProfileId } = await req.json()
    
    // Initialize clients
    // @ts-ignore - Deno API
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    // @ts-ignore - Deno API
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // @ts-ignore - Deno API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!
    const configuration = new Configuration({ apiKey: openaiApiKey })
    const openai = new OpenAIApi(configuration)
    
    // Step 1: Map concepts across subjects using GPT-4
    const conceptMapping = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert curriculum designer. Given a learning goal, identify all relevant academic concepts from any subject that would help achieve this goal. Consider concepts from Math, Science, Literature, History, Art, Business, Technology, and Life Skills. Each concept should be essential or highly supportive of the learning goal.`
        },
        {
          role: 'user',
          content: `Learning Goal: ${proposal.goal}\nObjectives: ${proposal.objectives.join(', ')}\n\nIdentify 20-50 specific concepts across all subjects that are relevant to this goal.`
        }
      ],
      functions: [
        {
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
      ],
      function_call: { name: 'map_concepts' }
    })
    
    const mappedConcepts = JSON.parse(conceptMapping.data.choices[0].message?.function_call?.arguments || '{}')
    
    // Step 2: Generate embeddings for concept search
    const conceptTexts = mappedConcepts.concepts.map((c: any) => 
      `${c.name} in ${c.subject}: ${c.description}. Relevance to "${proposal.goal}": ${c.relevance_hypothesis}`
    )
    
    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: conceptTexts
    })
    
    // Step 3: Search Pinecone for relevant content (80% threshold)
    // Note: In production, you would initialize and query Pinecone here
    // For now, we'll simulate the results
    const relevantContent = mappedConcepts.concepts.map((concept: any, idx: number) => ({
      concept,
      relevance_score: 0.80 + Math.random() * 0.20, // Simulate 80-100% relevance
      content_chunks: [], // Would come from Pinecone
      embedding: embeddingResponse.data.data[idx].embedding
    }))
    
    // Step 4: Create Thread in database
    const { data: thread, error: threadError } = await supabase
      .from('learning_threads')
      .insert({
        student_profile_id: studentProfileId,
        goal: proposal.goal,
        goal_extracted_at: new Date().toISOString(),
        goal_confidence_score: proposal.confidence_score,
        title: proposal.suggested_title,
        description: `A personalized learning journey to ${proposal.goal}`,
        estimated_concepts: relevantContent.length,
        estimated_hours: Math.floor(relevantContent.length * 2.5),
        subjects_involved: mappedConcepts.subjects_involved,
        primary_subject: mappedConcepts.primary_subject,
        complexity_score: 0.7,
        status: 'active',
        concepts_total: relevantContent.length
      })
      .select()
      .single()
    
    if (threadError) throw threadError
    
    // Step 5: Create thread concepts with proper sequencing
    const threadConcepts = relevantContent
      .sort((a, b) => {
        // Sort by prerequisites and relevance
        if (a.concept.prerequisites.length < b.concept.prerequisites.length) return -1
        if (a.concept.prerequisites.length > b.concept.prerequisites.length) return 1
        return b.relevance_score - a.relevance_score
      })
      .map((item, idx) => ({
        thread_id: thread.id,
        concept_id: item.concept.id,
        concept_name: item.concept.name,
        subject: item.concept.subject,
        relevance_score: item.relevance_score,
        relevance_explanation: item.concept.relevance_hypothesis,
        sequence_order: idx + 1,
        is_core_concept: item.relevance_score >= 0.90,
        prerequisite_concept_ids: item.concept.prerequisites,
        status: idx === 0 ? 'available' : 'pending'
      }))
    
    const { error: conceptsError } = await supabase
      .from('thread_concepts')
      .insert(threadConcepts)
    
    if (conceptsError) throw conceptsError
    
    // Step 6: Create thread graph in Neo4j (simulated for now)
    // In production, you would create the graph structure in Neo4j here
    
    return new Response(
      JSON.stringify({
        success: true,
        thread: {
          id: thread.id,
          title: thread.title,
          goal: thread.goal,
          concepts_count: threadConcepts.length,
          subjects: mappedConcepts.subjects_involved,
          estimated_hours: thread.estimated_hours,
          visualization_data: {
            nodes: threadConcepts.map(tc => ({
              id: tc.concept_id,
              name: tc.concept_name,
              subject: tc.subject,
              relevance: tc.relevance_score,
              sequence: tc.sequence_order
            })),
            edges: [] // Would include prerequisite relationships
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Thread generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 