import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import { Database } from '../types/supabase';

type ConceptContentRow = Database['public']['Tables']['concept_content']['Row'];

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
      if (!isValidUUID(sectionId)) {
        console.log('SectionId is not a valid UUID, skipping database query:', sectionId);
        return null;
      }
      
      const { data, error } = await supabase
        .from('concept_content')
        .select('*')
        .eq('id', sectionId);

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