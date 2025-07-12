import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import type { Interest } from '../types';

interface AddInterestData {
  interest: string;
  category: 'personal' | 'social' | 'career' | 'philanthropic';
  strength?: number;
}

interface UpdateInterestData extends AddInterestData {
  id?: string;
}

export const useAddInterest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (interestData: AddInterestData) => {
      const response = await api.post<{ message: string; interest: Interest }>(
        API_ENDPOINTS.studentProfile.interests,
        {
          ...interestData,
          studentId: user?.id,
          strength: interestData.strength || 0.5,
        }
      );
      return response;
    },
    onSuccess: (data) => {
      // Invalidate and refetch student profile
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      
      toast.success(`Added "${data.interest.interest}" to your interests!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add interest';
      toast.error(message);
    },
  });
};

export const useUpdateInterest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (interestData: UpdateInterestData) => {
      const response = await api.put<{ message: string; interest: Interest }>(
        `${API_ENDPOINTS.studentProfile.interests}/${interestData.id}`,
        {
          ...interestData,
          studentId: user?.id,
        }
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      
      toast.success(`Updated "${data.interest.interest}" interest!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update interest';
      toast.error(message);
    },
  });
};

export const useRemoveInterest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (interestId: string) => {
      const response = await api.delete<{ message: string }>(
        `${API_ENDPOINTS.studentProfile.interests}/${interestId}`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      
      toast.success('Interest removed successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove interest';
      toast.error(message);
    },
  });
};

export const useBulkAddInterests = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (interests: AddInterestData[]) => {
      const response = await api.post<{ message: string; interests: Interest[] }>(
        `${API_ENDPOINTS.studentProfile.interests}/bulk`,
        {
          interests: interests.map(interest => ({
            ...interest,
            studentId: user?.id,
            strength: interest.strength || 0.5,
          })),
        }
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      
      toast.success(`Added ${data.interests.length} new interests!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add interests';
      toast.error(message);
    },
  });
};

// Hook for generating interest suggestions based on user's current interests
export const useGenerateInterestSuggestions = () => {
  return useMutation({
    mutationFn: async (currentInterests: Interest[]) => {
      const response = await api.post<{ suggestions: AddInterestData[] }>(
        '/api/interests/suggestions',
        {
          currentInterests: currentInterests.map(i => ({
            interest: i.interest,
            category: i.category,
            strength: i.strength,
          })),
        }
      );
      return response.suggestions;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to generate suggestions';
      toast.error(message);
    },
  });
};