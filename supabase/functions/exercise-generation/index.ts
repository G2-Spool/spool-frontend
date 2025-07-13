// @ts-ignore - Deno imports for Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore - Deno imports for Supabase Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore - Deno imports for Supabase Edge Functions
import OpenAI from 'https://esm.sh/openai@4.28.0';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const openaiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({
  apiKey: openaiKey
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    const { 
      userId, 
      threadId, 
      exerciseNumber, // 1 or 2
      conceptId = 'probability' // default to probability for MVP
    } = await req.json();

    // Get user profile and thread data
    const [userResult, threadResult] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('threads').select('*').eq('id', threadId).single()
    ]);

    if (userResult.error || threadResult.error) {
      throw new Error('Failed to fetch user or thread data');
    }

    const user = userResult.data;
    const thread = threadResult.data;

    // Get the base exercise template
    const { data: baseExercise, error: exerciseError } = await supabase
      .from('exercises')
      .select('*')
      .eq('concept_id', conceptId)
      .eq('exercise_number', exerciseNumber)
      .single();

    if (exerciseError || !baseExercise) {
      throw new Error('Failed to fetch base exercise');
    }

    // Get the personality details
    const { data: personality, error: personalityError } = await supabase
      .from('personalities')
      .select('*')
      .eq('name', user.preferred_voice_personality || 'Default')
      .single();

    if (personalityError || !personality) {
      throw new Error('Failed to fetch personality');
    }

    // Get the expected steps for the user's difficulty level
    const difficultyLevel = user.default_difficulty_level || 'Beginner';
    const expectedSteps = baseExercise.expected_steps_by_difficulty[difficultyLevel] || [];

    // Determine context variation based on user interest and exercise
    const contextVariation = user.primary_interest === 'basketball' ? 'basketball' : 
                           baseExercise.base_context === 'blackjack' ? 'blackjack' : 
                           'mixed';

    // Generate personalized scenario and hint using OpenAI
    const personalizationCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are ${personality.name}. ${personality.communication_style} ${personality.teaching_philosophy}
          
          Create a personalized version of this exercise that:
          1. Maintains the core probability concept
          2. Uses the ${contextVariation} context naturally
          3. Matches the ${difficultyLevel} difficulty level
          4. Relates to the thread: "${thread.situation_title}"
          5. Speaks in your unique voice and style`
        },
        {
          role: 'user',
          content: `Base Exercise:
Title: ${baseExercise.base_title}
Scenario Template: ${baseExercise.base_scenario_template}
Hint Template: ${baseExercise.base_hint_template}
Context: ${baseExercise.base_context}

Thread Context: ${thread.situation_description}
User Interest: ${user.primary_interest}

Generate a personalized version that feels natural and engaging.`
        }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'generate_personalized_exercise',
            description: 'Generate personalized exercise content',
            parameters: {
              type: 'object',
              properties: {
                generated_scenario: {
                  type: 'string',
                  description: 'The personalized scenario text that incorporates the thread context and user interests'
                },
                generated_hint: {
                  type: 'string',
                  description: 'The personalized hint that matches the personality style and helps guide the student'
                },
                personality_touches: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Specific personality elements added to make it unique'
                }
              },
              required: ['generated_scenario', 'generated_hint']
            }
          }
        }
      ],
      tool_choice: {
        type: 'function',
        function: { name: 'generate_personalized_exercise' }
      }
    });

    const personalizationData = JSON.parse(
      personalizationCompletion.choices[0].message?.tool_calls?.[0]?.function.arguments || '{}'
    );

    // Create the exercise variation record
    const { data: exerciseVariation, error: variationError } = await supabase
      .from('exercise_variations')
      .insert({
        exercise_id: baseExercise.id,
        user_id: userId,
        thread_id: threadId,
        voice_personality: user.preferred_voice_personality || 'Default',
        difficulty_level: difficultyLevel,
        context_variation: contextVariation,
        generated_scenario: personalizationData.generated_scenario,
        generated_hint: personalizationData.generated_hint,
        expected_steps: expectedSteps,
        is_active: true
      })
      .select()
      .single();

    if (variationError) {
      throw new Error('Failed to create exercise variation');
    }

    // Format the response to match the expected exercise structure
    const response = {
      success: true,
      exercise: {
        id: exerciseVariation.id,
        exercise_id: baseExercise.id,
        concept_id: baseExercise.concept_id,
        exercise_number: baseExercise.exercise_number,
        
        // Base exercise info
        base_title: baseExercise.base_title,
        base_context: baseExercise.base_context,
        
        // Personalized content
        personalized_scenario: exerciseVariation.generated_scenario,
        personalized_hint: exerciseVariation.generated_hint,
        
        // Exercise configuration
        difficulty_level: exerciseVariation.difficulty_level,
        voice_personality: exerciseVariation.voice_personality,
        context_variation: exerciseVariation.context_variation,
        
        // Expected steps for evaluation
        expected_steps: exerciseVariation.expected_steps,
        
        // Metadata
        metadata: {
          thread_title: thread.title,
          thread_situation: thread.situation_title,
          user_interest: user.primary_interest,
          personality_name: personality.name,
          personality_touches: personalizationData.personality_touches || []
        }
      }
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (error) {
    console.error('Exercise generation error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.toString()
      }), 
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
}); 