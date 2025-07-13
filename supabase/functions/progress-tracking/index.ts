// @ts-ignore - Deno imports for Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - Deno imports for Supabase Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, threadId, conceptId, studentId, data } = await req.json()
    
    switch (action) {
      case 'update_concept_progress': {
        // Update concept progress
        const { status, masteryLevel, timeSpent } = data
        
        const { data: updatedConcept, error } = await supabase
          .from('thread_concepts')
          .update({
            status,
            mastery_level: masteryLevel,
            time_spent_seconds: timeSpent,
            completed_at: status === 'completed' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('thread_id', threadId)
          .eq('concept_id', conceptId)
          .select()
          .single()
        
        if (error) throw error
        
        // Update thread progress
        const { data: completedConcepts } = await supabase
          .from('thread_concepts')
          .select('id')
          .eq('thread_id', threadId)
          .eq('status', 'completed')
        
        const completedCount = completedConcepts?.length || 0
        
        await supabase
          .from('learning_threads')
          .update({
            concepts_completed: completedCount,
            current_concept_id: conceptId,
            last_accessed_at: new Date().toISOString()
          })
          .eq('id', threadId)
        
        // Unlock next concept if current is completed
        if (status === 'completed') {
          const { data: nextConcept } = await supabase
            .from('thread_concepts')
            .select('*')
            .eq('thread_id', threadId)
            .eq('sequence_order', updatedConcept.sequence_order + 1)
            .single()
          
          if (nextConcept) {
            await supabase
              .from('thread_concepts')
              .update({
                status: 'available',
                unlocked_at: new Date().toISOString()
              })
              .eq('id', nextConcept.id)
          }
        }
        
        return new Response(
          JSON.stringify({ success: true, progress: { completedCount } }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'get_thread_progress': {
        // Get comprehensive thread progress
        const [threadResult, conceptsResult, snapshotResult] = await Promise.all([
          supabase.from('learning_threads').select('*').eq('id', threadId).single(),
          supabase.from('thread_concepts').select('*').eq('thread_id', threadId).order('sequence_order'),
          supabase.from('thread_progress_snapshots')
            .select('*')
            .eq('thread_id', threadId)
            .eq('student_profile_id', studentId)
            .order('snapshot_date', { ascending: false })
            .limit(7)
        ])
        
        if (threadResult.error) throw threadResult.error
        
        const thread = threadResult.data
        const concepts = conceptsResult.data || []
        const snapshots = snapshotResult.data || []
        
        // Calculate progress metrics
        const completedConcepts = concepts.filter(c => c.status === 'completed')
        const currentConcept = concepts.find(c => c.status === 'current') || 
                              concepts.find(c => c.status === 'available')
        const averageMastery = completedConcepts.length > 0
          ? completedConcepts.reduce((sum, c) => sum + (c.mastery_level || 0), 0) / completedConcepts.length
          : 0
        
        // Calculate time metrics
        const totalTimeSeconds = concepts.reduce((sum, c) => sum + (c.time_spent_seconds || 0), 0)
        const estimatedRemainingHours = (thread.concepts_total - completedConcepts.length) * 2.5
        
        // Identify subjects covered
        const subjectsCovered = [...new Set(completedConcepts.map(c => c.subject))]
        
        return new Response(
          JSON.stringify({
            success: true,
            progress: {
              thread: {
                id: thread.id,
                title: thread.title,
                goal: thread.goal,
                status: thread.status,
                completion_percentage: thread.completion_percentage
              },
              metrics: {
                concepts_completed: completedConcepts.length,
                concepts_total: thread.concepts_total,
                average_mastery: averageMastery,
                total_time_minutes: Math.floor(totalTimeSeconds / 60),
                estimated_remaining_hours: estimatedRemainingHours,
                subjects_covered: subjectsCovered,
                current_concept: currentConcept ? {
                  name: currentConcept.concept_name,
                  subject: currentConcept.subject,
                  sequence: currentConcept.sequence_order
                } : null
              },
              concept_details: concepts.map(c => ({
                id: c.concept_id,
                name: c.concept_name,
                subject: c.subject,
                status: c.status,
                mastery_level: c.mastery_level,
                relevance_score: c.relevance_score,
                sequence_order: c.sequence_order
              })),
              recent_snapshots: snapshots
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'create_progress_snapshot': {
        // Create periodic progress snapshot
        const { data: thread } = await supabase
          .from('learning_threads')
          .select('*')
          .eq('id', threadId)
          .single()
        
        const { data: concepts } = await supabase
          .from('thread_concepts')
          .select('*')
          .eq('thread_id', threadId)
        
        const completedConcepts = concepts?.filter(c => c.status === 'completed') || []
        const subjectsTouched = [...new Set(concepts?.map(c => c.subject) || [])]
        const avgMastery = completedConcepts.length > 0
          ? completedConcepts.reduce((sum, c) => sum + (c.mastery_level || 0), 0) / completedConcepts.length
          : 0
        
        const { error } = await supabase
          .from('thread_progress_snapshots')
          .insert({
            thread_id: threadId,
            student_profile_id: studentId,
            snapshot_date: new Date().toISOString().split('T')[0],
            snapshot_type: data.snapshotType || 'daily',
            concepts_completed: completedConcepts.length,
            concepts_total: thread?.concepts_total || 0,
            subjects_touched: subjectsTouched,
            average_mastery_score: avgMastery,
            total_time_minutes: data.totalTimeMinutes || 0,
            active_time_minutes: data.activeTimeMinutes || 0,
            session_count: data.sessionCount || 1,
            curiosity_events: data.curiosityEvents || 0
          })
        
        if (error && !error.message.includes('duplicate')) throw error
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'track_achievement': {
        // Track gamification achievements
        const { achievementType, achievementData } = data
        
        // In a full implementation, you would have an achievements table
        // For now, we'll update the student profile metrics
        const { error } = await supabase
          .from('student_profiles')
          .update({
            thread_mastery_score: achievementData.masteryScore,
            updated_at: new Date().toISOString()
          })
          .eq('id', studentId)
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            achievement: { type: achievementType, ...achievementData } 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Progress tracking error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 