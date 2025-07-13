import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabase';

export interface ExerciseContent {
  id: string;
  concept_id: string | null;
  concept_name: string | null;
  hook_title: string | null;
  hook_content: string;
  example_title: string | null;
  example_scenario: string;
  example_visual: string | null;
  approach_title: string | null;
  approach_steps: string[];
  approach_formula: string | null;
  nonexample_title: string | null;
  nonexample_scenario: string;
  nonexample_explanation: string;
  thread_id?: string;
}

// Helper function to check if a string is a valid UUID
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const useExerciseContent = (sectionId: string) => {
  return useQuery<ExerciseContent | null>({
    queryKey: ['exercise-content', sectionId],
    queryFn: async () => {
      console.log('Fetching exercise content for sectionId:', sectionId);
      
      // Check if the sectionId is a valid UUID
      const isUuid = isValidUUID(sectionId);
      
      // Query by either id or concept_id based on what we have
      const query = isUuid
        ? supabase.from('concept_content').select('*').eq('id', sectionId)
        : supabase.from('concept_content').select('*').eq('concept_id', sectionId);
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching exercise content:', error);
        throw error;
      }

      // Check if we have data
      if (!data || data.length === 0) {
        console.log('No exercise content found for sectionId:', sectionId);
        return null;
      }

      // Use the first row if multiple exist
      const firstRow = data[0];

      // Transform the data to match our interface
      const transformedData: ExerciseContent = {
        id: firstRow.id,
        concept_id: firstRow.concept_id,
        concept_name: firstRow.concept_name,
        hook_title: firstRow.hook_title,
        hook_content: firstRow.hook_content,
        example_title: firstRow.example_title,
        example_scenario: firstRow.example_scenario,
        example_visual: firstRow.example_visual,
        approach_title: firstRow.approach_title,
        approach_formula: firstRow.approach_formula,
        nonexample_title: firstRow.nonexample_title,
        nonexample_scenario: firstRow.nonexample_scenario,
        nonexample_explanation: firstRow.nonexample_explanation,

        approach_steps: Array.isArray(firstRow.approach_steps) 
          ? firstRow.approach_steps.filter((step): step is string => typeof step === 'string')
          : []
      };

      console.log('Successfully fetched exercise content:', transformedData);
      return transformedData;
    },
    enabled: !!sectionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// New hook to fetch all concept content for a thread
export const useThreadConceptContent = (threadId: string) => {
  return useQuery<ExerciseContent[]>({
    queryKey: ['thread-concept-content', threadId],
    queryFn: async () => {
      console.log('Fetching all concept content for threadId:', threadId);
      
      // First, try to get the thread_id from the current concept's data
      const { data, error } = await supabase
        .from('concept_content')
        .select('*')
        .eq('thread_id', threadId)
        .order('concept_id'); // Order by concept_id to ensure consistent ordering

      if (error) {
        console.error('Error fetching thread concept content:', error);
        throw error;
      }

      // Check if we have data
      if (!data || data.length === 0) {
        console.log('No concept content found for threadId:', threadId);
        return [];
      }

      // Transform all rows
      const transformedData: ExerciseContent[] = data.map(row => ({
        id: row.id,
        concept_id: row.concept_id,
        concept_name: row.concept_name,
        hook_title: row.hook_title,
        hook_content: row.hook_content,
        example_title: row.example_title,
        example_scenario: row.example_scenario,
        example_visual: row.example_visual,
        approach_title: row.approach_title,
        approach_formula: row.approach_formula,
        nonexample_title: row.nonexample_title,
        nonexample_scenario: row.nonexample_scenario,
        nonexample_explanation: row.nonexample_explanation,

        approach_steps: Array.isArray(row.approach_steps) 
          ? row.approach_steps.filter((step): step is string => typeof step === 'string')
          : []
      }));

      console.log('Successfully fetched thread concept content:', transformedData);
      return transformedData;
    },
    enabled: !!threadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 