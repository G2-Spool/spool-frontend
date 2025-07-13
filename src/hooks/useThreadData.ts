import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'

interface ConceptContent {
  id: string
  concept_id: string
  concept_name: string
  hook_title: string
  hook_content: string
  example_title: string
  example_scenario: string
  example_visual: string | null
  approach_title: string
  approach_steps: string[]
  approach_formula: string | null
  nonexample_title: string
  nonexample_scenario: string
  nonexample_explanation: string
  thread_id: string
}

export function useThreadConcepts(threadId: string) {
  return useQuery({
    queryKey: ['thread-concepts', threadId],
    queryFn: async () => {
      const { data: concepts, error } = await supabase
        .from('concept_content')
        .select('*')
        .eq('thread_id', threadId)
        .order('concept_id')

      if (error) {
        console.error('Error fetching thread concepts:', error)
        throw error
      }

      return concepts as ConceptContent[]
    },
    enabled: !!threadId
  })
}

// Hardcoded thread ID for all users as requested
export const HARDCODED_THREAD_ID = 'd6046803-eece-42ba-9cbb-ab2eebd9c683'

export function useHardcodedThread() {
  return useQuery({
    queryKey: ['hardcoded-thread'],
    queryFn: async () => {
      const { data: thread, error } = await supabase
        .from('threads')
        .select('*')
        .eq('id', HARDCODED_THREAD_ID)
        .single()

      if (error) {
        console.error('Error fetching thread:', error)
        throw error
      }

      return thread
    }
  })
} 