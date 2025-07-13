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

interface InterestWithDescription {
  interest: string
  description: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // More robust body parsing to handle different request structures
    let body;
    try {
      const rawBody = await req.json()
      // Handle both direct body and wrapped body scenarios
      // When using supabase.functions.invoke(), the body might be wrapped
      body = rawBody.body || rawBody
      
      console.log('Raw body received:', JSON.stringify(rawBody))
      console.log('Extracted body:', JSON.stringify(body))
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      throw new Error('Invalid request body')
    }

    const { action, studentId, text } = body
    
    // Add debugging to see what's being received
    console.log('Parsed request:', { action, studentId, hasText: !!text })
    
    if (action === 'extract_interests') {
      console.log('Extracting interests for user:', studentId, 'from text:', text)
      
      // Use OpenAI to extract interests from the provided text
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting interests from text. Extract specific interests and hobbies mentioned in the text along with detailed descriptions about why the person enjoys them or what specific aspects they find interesting. Focus on concrete activities, subjects, hobbies, and interests.`
          },
          {
            role: 'user',
            content: `Extract interests from this text and provide a detailed description for each:\n\n${text}`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_interests',
              description: 'Extract interests with detailed descriptions',
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
                          description: 'The specific interest or activity (e.g., "basketball", "cooking", "artificial intelligence")'
                        },
                        description: {
                          type: 'string',
                          description: 'Detailed description of why they enjoy it or what specific aspect interests them'
                        }
                      },
                      required: ['interest', 'description']
                    }
                  }
                },
                required: ['interests']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_interests' } },
        temperature: 0.3
      })
      
      const toolCall = completion.choices[0].message?.tool_calls?.[0]
      
      if (!toolCall) {
        throw new Error('Failed to extract interests from text')
      }
      
      const extractedData = JSON.parse(toolCall.function.arguments)
      const extractedInterests: InterestWithDescription[] = extractedData.interests || []
      
      console.log('Extracted interests:', extractedInterests)
      
      if (extractedInterests.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'No interests found in the provided text' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // Get existing interests from the users table
      const { data: user, error: getUserError } = await supabase
        .from('users')
        .select('interests')
        .eq('id', studentId)
        .single()
      
      if (getUserError) {
        console.error('Error getting user:', getUserError)
        throw new Error('Failed to get user data')
      }
      
      const existingInterests = user?.interests || []
      console.log('Existing interests:', existingInterests)
      
      // Merge with existing interests (avoid duplicates based on interest name)
      const existingInterestNames = existingInterests.map((i: InterestWithDescription) => 
        i.interest.toLowerCase()
      )
      
      const uniqueNewInterests = extractedInterests.filter(
        (newInterest: InterestWithDescription) => 
          !existingInterestNames.includes(newInterest.interest.toLowerCase())
      )
      
      const allInterests = [...existingInterests, ...uniqueNewInterests]
      
      console.log('All interests after merge:', allInterests)
      
      // Update the users table with the new interests
      const { error: updateError } = await supabase
        .from('users')
        .update({ interests: allInterests })
        .eq('id', studentId)
      
      if (updateError) {
        console.error('Error updating user interests:', updateError)
        throw new Error('Failed to update user interests')
      }
      
      console.log('Successfully updated user interests')
      
      // Return the interests in the expected format for the modal
      const interestsWithDetails = uniqueNewInterests.map((interest: InterestWithDescription) => ({
        interest: interest.interest,
        details: interest.description,
        discovered_at: new Date().toISOString()
      }))
      
      return new Response(
        JSON.stringify({ 
          success: true,
          interests: interestsWithDetails,
          totalInterests: allInterests.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Handle other actions (keeping existing functionality for backwards compatibility)
    if (action === 'start_session') {
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
    
    // If we reach here, the action was not recognized
    console.error('Unknown action received:', action, 'Type:', typeof action)
    throw new Error(`Invalid action: "${action}"`)
    
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