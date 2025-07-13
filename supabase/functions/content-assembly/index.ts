// @ts-ignore - Deno imports for Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - Deno imports for Supabase Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore - Deno imports for Supabase Edge Functions
import OpenAI from 'https://esm.sh/openai@4.28.0'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const openaiKey = Deno.env.get('OPENAI_API_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const openai = new OpenAI({ apiKey: openaiKey })

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { conceptId, threadId, studentId } = await req.json()
    
    // Get thread context and concept details
    const [threadResult, conceptResult, profileResult] = await Promise.all([
      supabase.from('learning_threads').select('*').eq('id', threadId).single(),
      supabase.from('thread_concepts').select('*').eq('thread_id', threadId).eq('concept_id', conceptId).single(),
      supabase.from('student_profiles').select('*').eq('id', studentId).single()
    ])
    
    if (threadResult.error || conceptResult.error || profileResult.error) {
      throw new Error('Failed to fetch required data')
    }
    
    const thread = threadResult.data
    const threadConcept = conceptResult.data
    const profile = profileResult.data
    
    // Generate bridge explanation if crossing subjects
    let bridgeContent = null
    if (threadConcept.bridge_from_concept_id) {
      const bridgeCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system' as const,
            content: `You are an expert at explaining connections between concepts from different subjects. Create a clear, engaging bridge that shows how the previous concept connects to the new one in the context of the learning goal.`
          },
          {
            role: 'user' as const,
            content: `Thread Goal: ${thread.goal}\nPrevious Concept: ${threadConcept.bridge_from_concept_id}\nNew Concept: ${threadConcept.concept_name} (${threadConcept.subject})\n\nExplain the connection in 2-3 sentences.`
          }
        ],
        max_tokens: 150
      })
      bridgeContent = bridgeCompletion.choices[0].message?.content
    }
    
    // Generate personalized hooks based on interests
    const hooksCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system' as const,
          content: `Generate four engaging hooks that connect the concept to different life areas. Each hook should be 2-3 sentences and show immediate value.`
        },
        {
          role: 'user' as const,
          content: `Concept: ${threadConcept.concept_name}\nThread Goal: ${thread.goal}\nStudent Interests: ${JSON.stringify(profile.interests)}\nCareer Interests: ${profile.career_interests.join(', ')}\nPhilanthropic Interests: ${profile.philanthropic_interests.join(', ')}`
        }
      ],
      tools: [
        {
          type: 'function' as const,
          function: {
            name: 'generate_hooks',
            description: 'Generate personalized hooks for the concept',
            parameters: {
              type: 'object',
              properties: {
                personal_hook: { type: 'string' },
                social_hook: { type: 'string' },
                career_hook: { type: 'string' },
                philanthropic_hook: { type: 'string' }
              }
            }
          }
        }
      ],
      tool_choice: { type: 'function' as const, function: { name: 'generate_hooks' } }
    })
    
    const hooks = JSON.parse(hooksCompletion.choices[0].message?.tool_calls?.[0]?.function.arguments || '{}')
    
    // Generate interest-based examples
    const interests = [...(profile.interests.hobbies || []), ...(profile.interests.activities || [])]
    const examplesCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system' as const,
          content: `Create 3-4 examples that make the concept concrete using the student's specific interests. Each example should clearly demonstrate the concept in action.`
        },
        {
          role: 'user' as const,
          content: `Concept: ${threadConcept.concept_name}\nStudent Interests: ${interests.join(', ')}\nThread Context: Learning to ${thread.goal}`
        }
      ],
      tools: [
        {
          type: 'function' as const,
          function: {
            name: 'generate_examples',
            description: 'Generate interest-based examples',
            parameters: {
              type: 'object',
              properties: {
                examples: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      interest_tag: { type: 'string' },
                      example_text: { type: 'string' },
                      visual_hint: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      ],
      tool_choice: { type: 'function' as const, function: { name: 'generate_examples' } }
    })
    
    const examples = JSON.parse(examplesCompletion.choices[0].message?.tool_calls?.[0]?.function.arguments || '{}')
    
    // In production, you would fetch the actual content from Pinecone
    // For now, we'll generate placeholder core content
    const coreContent = {
      vocabulary: [
        { term: 'Key Term 1', definition: 'Definition of the first key term' },
        { term: 'Key Term 2', definition: 'Definition of the second key term' }
      ],
      mental_model: {
        title: 'Core Mental Model',
        description: 'A powerful way to think about this concept',
        visual_type: 'diagram'
      },
      principles: [
        'Fundamental principle that always applies',
        'Common pattern you\'ll see',
        'Important edge case to remember'
      ],
      process_steps: [
        { step: 1, title: 'Initialize', description: 'Set up the initial state' },
        { step: 2, title: 'Process', description: 'Apply the concept' },
        { step: 3, title: 'Validate', description: 'Check your work' }
      ]
    }
    
    // Assemble complete content package
    const assembledContent = {
      concept: {
        id: conceptId,
        name: threadConcept.concept_name,
        subject: threadConcept.subject,
        relevance_score: threadConcept.relevance_score,
        relevance_explanation: threadConcept.relevance_explanation
      },
      thread_context: {
        goal: thread.goal,
        position: threadConcept.sequence_order,
        total_concepts: thread.concepts_total,
        bridge_content: bridgeContent
      },
      personalized_content: {
        hooks: hooks,
        examples: examples.examples,
        core_content: coreContent
      },
      metadata: {
        generated_at: new Date().toISOString(),
        personalization_factors: {
          interests_used: interests,
          career_focus: profile.career_interests[0],
          philanthropic_focus: profile.philanthropic_interests[0]
        }
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, content: assembledContent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Content assembly error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 