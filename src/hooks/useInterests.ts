import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import { Json } from '../types/supabase';
import toast from 'react-hot-toast';

interface InterestWithDescription {
  interest: string;
  description: string;
}

export function useInterests(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: interests = [], isLoading, error } = useQuery({
    queryKey: ['interests', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('users')
        .select('interests')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Return interests in the format expected by components
      return (data?.interests as unknown as InterestWithDescription[]) || [];
    },
    enabled: !!userId,
  });

  const updateInterests = useMutation({
    mutationFn: async (newInterests: InterestWithDescription[]) => {
      if (!userId) throw new Error('No user ID');
      
      // Store interests directly in the expected format
      const interestsToStore = newInterests;
      
      const { error } = await supabase
        .from('users')
        .update({ interests: interestsToStore as unknown as Json })
        .eq('id', userId);

      if (error) throw error;
      return newInterests;
    },
    onSuccess: (newInterests) => {
      queryClient.setQueryData(['interests', userId], newInterests);
      toast.success('Interests updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating interests:', error);
      toast.error('Failed to update interests');
    },
  });

  const fetchInterestsFromEdgeFunction = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('No user ID');
      
      const { data, error } = await supabase.functions.invoke('interest-discovery', {
        body: { action: 'get_interests', studentId: userId }
      });

      if (error) throw error;
      return data.interests as InterestWithDescription[];
    },
    onSuccess: (interests) => {
      queryClient.setQueryData(['interests', userId], interests);
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