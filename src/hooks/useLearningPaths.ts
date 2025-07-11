import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningPathsService } from '../services/learningPaths.service';
import type { LifeCategory } from '../types';

export const useLearningPaths = () => {
  return useQuery({
    queryKey: ['learningPaths'],
    queryFn: () => learningPathsService.getLearningPaths(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

export const useActiveLearningPath = () => {
  return useQuery({
    queryKey: ['activeLearningPath'],
    queryFn: () => learningPathsService.getActiveLearningPath(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useStudentStats = () => {
  return useQuery({
    queryKey: ['studentStats'],
    queryFn: () => learningPathsService.getStudentStats(),
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent updates for stats)
    gcTime: 5 * 60 * 1000,
  });
};

export const useSearchLearningPaths = (query: string, category?: LifeCategory) => {
  return useQuery({
    queryKey: ['learningPaths', 'search', query, category],
    queryFn: () => learningPathsService.searchLearningPaths(query, category),
    enabled: !!query || !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSetActivePath = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pathId: string) => learningPathsService.setActivePath(pathId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
      queryClient.invalidateQueries({ queryKey: ['activeLearningPath'] });
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pathId, exerciseId }: { pathId: string; exerciseId: string }) => 
      learningPathsService.updateProgress(pathId, exerciseId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
      queryClient.invalidateQueries({ queryKey: ['activeLearningPath'] });
      queryClient.invalidateQueries({ queryKey: ['studentStats'] });
    },
  });
};