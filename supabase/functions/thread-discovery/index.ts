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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { conversation, studentId } = await req.json()
    
    // Extract learning objectives from conversation
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at understanding student learning goals from conversations. Extract the primary learning goal and related objectives from the conversation. Focus on what the student wants to learn, create, or understand.`
        },
        {
          role: 'user',
          content: `Extract the learning goal and objectives from this conversation:\n\n${conversation}`
        }
      ],
      functions: [
        {
          name: 'extract_learning_goal',
          description: 'Extract structured learning goal and objectives',
          parameters: {
            type: 'object',
            properties: {
              primary_goal: {
                type: 'string',
                description: 'The main thing the student wants to learn (e.g., "build a video game")'
              },
              specific_objectives: {
                type: 'array',
                items: { type: 'string' },
                description: 'Specific objectives within the goal'
              },
              depth_preference: {
                type: 'string',
                enum: ['surface', 'moderate', 'deep'],
                description: 'How deep the student wants to go'
              },
              motivation: {
                type: 'string',
                description: 'Why the student wants to learn this'
              },
              confidence_score: {
                type: 'number',
                description: 'Confidence in goal extraction (0-1)'
              }
            },
            required: ['primary_goal', 'specific_objectives', 'depth_preference', 'confidence_score']
          }
        }
      ],
      function_call: { name: 'extract_learning_goal' }
    })
    
    const extractedData = JSON.parse(completion.data.choices[0].message?.function_call?.arguments || '{}')
    
    // Get student profile
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', studentId)
      .single()
    
    if (!profile) {
      throw new Error('Student profile not found')
    }
    
    // Create Thread proposal
    const threadProposal = {
      goal: extractedData.primary_goal,
      objectives: extractedData.specific_objectives,
      depth: extractedData.depth_preference,
      motivation: extractedData.motivation,
      confidence_score: extractedData.confidence_score,
      student_interests: profile.interests,
      career_interests: profile.career_interests,
      philanthropic_interests: profile.philanthropic_interests,
      estimated_concepts: Math.floor(10 + Math.random() * 40), // Placeholder
      estimated_hours: Math.floor(20 + Math.random() * 80), // Placeholder
      suggested_title: `${extractedData.primary_goal} Journey`,
      subjects_preview: [] // Will be filled by Thread Generation
    }
    
    return new Response(
      JSON.stringify({ success: true, proposal: threadProposal }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Thread discovery error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 