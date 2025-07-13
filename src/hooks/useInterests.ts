import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

interface InterestWithDetails {
  interest: string;
  details: string;
  discovered_at: string;
}

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
      
      // Convert stored interests format to display format
      const storedInterests = (data?.interests as InterestWithDescription[]) || [];
      return storedInterests.map((interest: InterestWithDescription) => ({
        interest: interest.interest,
        details: interest.description,
        discovered_at: new Date().toISOString() // We don't store timestamps in the new format
      })) as InterestWithDetails[];
    },
    enabled: !!userId,
  });

  const updateInterests = useMutation({
    mutationFn: async (newInterests: InterestWithDetails[]) => {
      if (!userId) throw new Error('No user ID');
      
      // Convert display format back to storage format
      const interestsToStore = newInterests.map((interest: InterestWithDetails) => ({
        interest: interest.interest,
        description: interest.details
      }));
      
      const { error } = await supabase
        .from('users')
        .update({ interests: interestsToStore })
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
      return data.interests as InterestWithDetails[];
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