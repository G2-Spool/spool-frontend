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

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface InterestWithDetails {
  interest: string
  details: string
  discovered_at: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, studentId, messages, newMessage } = await req.json()
    
    switch (action) {
      case 'start_session': {
        // Initialize a new chat session
        const initialMessage = "Hi! I'm here to learn about what interests you. Tell me about some activities you enjoy, hobbies you have, or things you're curious about. The more you share, the better I can personalize your learning experience!"
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: initialMessage,
            sessionId: crypto.randomUUID()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'process_message': {
        // Add user message to conversation
        const updatedMessages: ChatMessage[] = [...(messages || []), { role: 'user', content: newMessage }]
        
        // Create OpenAI messages with system prompt
        const openaiMessages = [
          {
            role: 'system' as const,
            content: `You are a friendly AI assistant helping discover a student's interests. Your goal is to have a natural conversation that uncovers specific interests along with details about why they enjoy them. Ask follow-up questions to understand the specific aspects they find interesting. Keep responses conversational and encouraging. Focus on hobbies, activities, subjects they enjoy, and things they're curious about.`
          },
          ...updatedMessages
        ]
        
        // Get AI response
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: openaiMessages,
          temperature: 0.7,
          max_tokens: 150
        })
        
        const aiResponse = completion.choices[0].message?.content || ''
        updatedMessages.push({ role: 'assistant', content: aiResponse })
        
        // Extract interests from the conversation so far
        const extractionCompletion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system' as const,
              content: `Extract specific interests with details from the conversation. For each interest mentioned, capture what it is and why the student finds it interesting or what specific aspect they enjoy about it.`
            },
            {
              role: 'user' as const,
              content: `Extract interests with details from this conversation:\n\n${JSON.stringify(updatedMessages)}`
            }
          ],
          tools: [
            {
              type: 'function' as const,
              function: {
                name: 'extract_interests',
                description: 'Extract interests with specific details',
                parameters: {
                  type: 'object',
                  properties: {
                    interests: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          interest: {
                            type: 'string',
                            description: 'The specific interest or activity (e.g., "basketball", "cooking", "robotics")'
                          },
                          details: {
                            type: 'string',
                            description: 'Specific details about why they enjoy it or what aspect interests them'
                          }
                        },
                        required: ['interest', 'details']
                      }
                    }
                  },
                  required: ['interests']
                }
              }
            }
          ],
          tool_choice: { type: 'function' as const, function: { name: 'extract_interests' } }
        })
        
        const toolCall = extractionCompletion.choices[0].message?.tool_calls?.[0]
        const extractedData = toolCall ? JSON.parse(toolCall.function.arguments) : { interests: [] }
        
        // Get existing detailed interests
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('detailed_interests')
          .eq('id', studentId)
          .single()
        
        const existingInterests = profile?.detailed_interests || []
        
        // Add new interests with timestamps
        const newInterests: InterestWithDetails[] = extractedData.interests.map((item: any) => ({
          ...item,
          discovered_at: new Date().toISOString()
        }))
        
        // Merge with existing interests (avoid duplicates)
        const existingInterestNames = existingInterests.map((i: any) => i.interest.toLowerCase())
        const uniqueNewInterests = newInterests.filter(
          (ni: InterestWithDetails) => !existingInterestNames.includes(ni.interest.toLowerCase())
        )
        
        const allInterests = [...existingInterests, ...uniqueNewInterests]
        
        // Update student profile with new interests
        if (uniqueNewInterests.length > 0) {
          await supabase
            .from('student_profiles')
            .update({ 
              detailed_interests: allInterests,
              updated_at: new Date().toISOString()
            })
            .eq('id', studentId)
        }
        
        // Check if we have enough interests to conclude
        const shouldConclude = allInterests.length >= 5 && updatedMessages.length >= 8
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: aiResponse,
            messages: updatedMessages,
            extractedInterests: allInterests,
            newInterestsFound: uniqueNewInterests.length,
            shouldConclude
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'get_interests': {
        // Get all interests for a student
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('detailed_interests')
          .eq('id', studentId)
          .single()
        
        return new Response(
          JSON.stringify({ 
            success: true,
            interests: profile?.detailed_interests || []
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Interest discovery error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 