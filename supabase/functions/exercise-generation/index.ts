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
    const { conceptId, threadId, studentId, exerciseType } = await req.json()
    
    // Get context data
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
    
    // Determine exercise complexity based on type
    const isAdvanced = exerciseType === 'advanced'
    const complexityPrompt = isAdvanced 
      ? 'Create an ADVANCED exercise with additional complexity, multiple concepts, or real-world constraints.'
      : 'Create an initial exercise that tests understanding of the core concept.'
    
    // Generate personalized exercise
    const exerciseCompletion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at creating engaging, personalized exercises that test concept understanding while relating to student interests and Thread goals. ${complexityPrompt} The exercise MUST require students to explain their thought process step-by-step.`
        },
        {
          role: 'user',
          content: `Create an exercise for:\n\nConcept: ${threadConcept.concept_name} (${threadConcept.subject})\nThread Goal: ${thread.goal}\nStudent Interests: ${JSON.stringify(profile.interests)}\nCareer Interest: ${profile.career_interests[0] || 'general'}\n\nThe exercise should:\n1. Directly relate to the Thread goal\n2. Use one of the student's interests as context\n3. Require step-by-step explanation\n4. ${isAdvanced ? 'Include multiple concepts or real-world complexity' : 'Focus on the core concept'}`
        }
      ],
      functions: [
        {
          name: 'generate_exercise',
          description: 'Generate a personalized exercise',
          parameters: {
            type: 'object',
            properties: {
              exercise_prompt: {
                type: 'string',
                description: 'The complete exercise prompt for the student'
              },
              context_setting: {
                type: 'string',
                description: 'The interest-based scenario'
              },
              expected_steps: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    step_number: { type: 'integer' },
                    step_description: { type: 'string' },
                    key_concept: { type: 'string' }
                  }
                },
                description: 'The logical steps expected in the solution'
              },
              thread_goal_integration: {
                type: 'string',
                description: 'How this exercise relates to the Thread goal'
              },
              cross_curricular_elements: {
                type: 'array',
                items: { type: 'string' },
                description: 'Other subjects touched on'
              },
              success_criteria: {
                type: 'array',
                items: { type: 'string' },
                description: 'What constitutes a successful response'
              },
              common_misconceptions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Common mistakes to watch for'
              }
            }
          }
        }
      ],
      function_call: { name: 'generate_exercise' }
    })
    
    const exerciseData = JSON.parse(exerciseCompletion.data.choices[0].message?.function_call?.arguments || '{}')
    
    // Store the exercise in the database
    const { data: assessment, error: assessmentError } = await supabase
      .from('thread_assessments')
      .insert({
        student_profile_id: studentId,
        thread_id: threadId,
        concept_id: conceptId,
        thread_goal_integration: exerciseData.thread_goal_integration,
        cross_curricular_elements: exerciseData.cross_curricular_elements,
        thread_position_context: `Concept ${threadConcept.sequence_order} of ${thread.concepts_total}`,
        assessment_type: exerciseType === 'advanced' ? 'advanced_exercise' : 'initial_exercise',
        exercise_prompt: exerciseData.exercise_prompt,
        expected_steps: exerciseData.expected_steps,
        requires_cross_subject_thinking: exerciseData.cross_curricular_elements.length > 0,
        real_world_application_required: true,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (assessmentError) throw assessmentError
    
    // Prepare response with exercise details
    const response = {
      success: true,
      exercise: {
        id: assessment.id,
        type: exerciseType,
        prompt: exerciseData.exercise_prompt,
        context: exerciseData.context_setting,
        thread_integration: exerciseData.thread_goal_integration,
        expected_steps: exerciseData.expected_steps,
        success_criteria: exerciseData.success_criteria,
        hints: {
          common_misconceptions: exerciseData.common_misconceptions,
          cross_curricular_connections: exerciseData.cross_curricular_elements
        },
        metadata: {
          concept_name: threadConcept.concept_name,
          subject: threadConcept.subject,
          thread_progress: `${threadConcept.sequence_order}/${thread.concepts_total}`,
          relevance_to_goal: threadConcept.relevance_score
        }
      }
    }
    
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Exercise generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 