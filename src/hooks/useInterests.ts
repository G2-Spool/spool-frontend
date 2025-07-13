import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

interface InterestWithDetails {
  interest: string;
  details: string;
  discovered_at: string;
}

export function useInterests(studentId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: interests = [], isLoading, error } = useQuery({
    queryKey: ['interests', studentId],
    queryFn: async () => {
      if (!studentId) return [];
      
      const { data, error } = await supabase
        .from('student_profiles')
        .select('detailed_interests')
        .eq('id', studentId)
        .single();

      if (error) throw error;
      return ((data?.detailed_interests as unknown) || []) as InterestWithDetails[];
    },
    enabled: !!studentId,
  });

  const updateInterests = useMutation({
    mutationFn: async (newInterests: InterestWithDetails[]) => {
      if (!studentId) throw new Error('No student ID');
      
      const { error } = await supabase
        .from('student_profiles')
        .update({ 
          detailed_interests: JSON.parse(JSON.stringify(newInterests)),
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId);

      if (error) throw error;
      return newInterests;
    },
    onSuccess: (newInterests) => {
      queryClient.setQueryData(['interests', studentId], newInterests);
      toast.success('Interests updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating interests:', error);
      toast.error('Failed to update interests');
    },
  });

  const fetchInterestsFromEdgeFunction = useMutation({
    mutationFn: async () => {
      if (!studentId) throw new Error('No student ID');
      
      const { data, error } = await supabase.functions.invoke('interest-discovery', {
        body: { action: 'get_interests', studentId }
      });

      if (error) throw error;
      return data.interests as InterestWithDetails[];
    },
    onSuccess: (interests) => {
      queryClient.setQueryData(['interests', studentId], interests);
    },
    onError: (error) => {
      console.error('Error fetching interests:', error);
      toast.error('Failed to fetch interests');
    },
  });

  return {
    interests,
    isLoading,
    error,
    updateInterests: updateInterests.mutate,
    fetchInterests: fetchInterestsFromEdgeFunction.mutate,
    isUpdating: updateInterests.isPending,
  };
} 