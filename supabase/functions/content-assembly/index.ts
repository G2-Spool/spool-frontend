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
    const { conceptId, conceptName, threadId, userId } = await req.json();

    // Get thread and user data for context
    const [threadResult, userResult] = await Promise.all([
      supabase.from('threads').select('*').eq('id', threadId).single(),
      supabase.from('users').select('*').eq('id', userId).single()
    ]);

    if (threadResult.error || userResult.error) {
      throw new Error('Failed to fetch required data');
    }

    const thread = threadResult.data;
    const user = userResult.data;

    // Check if concept content already exists
    const { data: existingContent } = await supabase
      .from('concept_content')
      .select('*')
      .eq('concept_id', conceptId)
      .single();

    if (existingContent) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Content already exists',
        content: existingContent
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Extract primary interest from user's interests array
    const userInterests = user.interests || [];
    const primaryInterest = userInterests.length > 0 ? userInterests[0].interest : 'learning';
    const interestsDescription = userInterests.map((i: any) => i.interest).join(', ');

    // Generate complete concept content
    const contentGeneration = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert educational content creator. Generate comprehensive concept content that connects academic concepts to real-world situations and personal interests. The content should be engaging, clear, and pedagogically sound.`
        },
        {
          role: 'user',
          content: `Create educational content for the concept "${conceptName}" in the context of "${thread.situation_description}". The user's interests are: ${interestsDescription}. Their primary interest is ${primaryInterest}. Generate all required components for a complete lesson.`
        }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'generate_concept_content',
            description: 'Generate complete concept content for the concept_content table',
            parameters: {
              type: 'object',
              properties: {
                hook_title: {
                  type: 'string',
                  description: 'Engaging title that connects the concept to the situation'
                },
                hook_content: {
                  type: 'string',
                  description: '2-3 paragraphs explaining why this concept matters in the given situation, making connections to all life areas'
                },
                example_title: {
                  type: 'string',
                  description: 'Title connecting the concept to the user\'s primary interest'
                },
                example_scenario: {
                  type: 'string',
                  description: 'Detailed scenario using the user\'s interest to demonstrate the concept'
                },
                example_visual: {
                  type: 'string',
                  description: 'Visual representation or comparison using emojis and simple notation'
                },
                approach_title: {
                  type: 'string',
                  description: 'Academic/formal title for the systematic approach'
                },
                approach_steps: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Step-by-step process for applying the concept'
                },
                approach_formula: {
                  type: 'string',
                  description: 'Mathematical or logical formula if applicable'
                },
                nonexample_title: {
                  type: 'string',
                  description: 'Title for common mistake or misconception'
                },
                nonexample_scenario: {
                  type: 'string',
                  description: 'Scenario showing incorrect application using the user\'s interest'
                },
                nonexample_explanation: {
                  type: 'string',
                  description: 'Explanation of why this approach is wrong and what the correct approach would be'
                }
              },
              required: ['hook_title', 'hook_content', 'example_title', 'example_scenario', 'example_visual', 'approach_title', 'approach_steps', 'approach_formula', 'nonexample_title', 'nonexample_scenario', 'nonexample_explanation']
            }
          }
        }
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'generate_concept_content'
        }
      }
    });

    const toolCall = contentGeneration.choices[0].message?.tool_calls?.[0];
    if (!toolCall) throw new Error('Failed to generate concept content');
    
    const generatedContent = JSON.parse(toolCall.function.arguments);

    // Insert the generated content into concept_content table
    const { data: insertedContent, error: insertError } = await supabase
      .from('concept_content')
      .insert({
        concept_id: conceptId,
        concept_name: conceptName,
        hook_title: generatedContent.hook_title,
        hook_content: generatedContent.hook_content,
        example_title: generatedContent.example_title,
        example_scenario: generatedContent.example_scenario,
        example_visual: generatedContent.example_visual,
        approach_title: generatedContent.approach_title,
        approach_steps: generatedContent.approach_steps,
        approach_formula: generatedContent.approach_formula,
        nonexample_title: generatedContent.nonexample_title,
        nonexample_scenario: generatedContent.nonexample_scenario,
        nonexample_explanation: generatedContent.nonexample_explanation
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to insert concept content');
    }

    return new Response(JSON.stringify({
      success: true,
      content: insertedContent
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (error) {
    console.error('Content assembly error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});

// Example of how to call this function for each concept in a thread:
/*
// After thread generation, for each concept in the thread:
const thread = await getThread(threadId);
const concepts = thread.concepts; // Array of concept objects

for (const concept of concepts) {
  await fetch('your-edge-function-url/content-assembly', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      conceptId: concept.id,
      conceptName: concept.name,
      threadId: thread.id,
      userId: thread.user_id
    })
  });
}
*/ 