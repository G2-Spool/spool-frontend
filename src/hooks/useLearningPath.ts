import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CoursesService } from '../services/courses.service';
import type { LearningPath, PaginatedResponse } from '../types';
import type { FilterMetadata } from '../services/pinecone/types';

// Query keys
export const learningPathKeys = {
  all: ['learningPaths'] as const,
  lists: () => [...learningPathKeys.all, 'list'] as const,
  list: (filters?: FilterMetadata, page?: number) => 
    [...learningPathKeys.lists(), { filters, page }] as const,
  details: () => [...learningPathKeys.all, 'detail'] as const,
  detail: (id: string) => [...learningPathKeys.details(), id] as const,
  progress: (id: string) => [...learningPathKeys.all, 'progress', id] as const,
  search: (query: string, filters?: FilterMetadata) => 
    [...learningPathKeys.all, 'search', { query, filters }] as const,
  personalized: () => [...learningPathKeys.all, 'personalized'] as const,
};

// Fetch all learning paths with pagination
export const useLearningPaths = (
  page: number = 1, 
  pageSize: number = 20,
  filters?: FilterMetadata
) => {
  return useQuery<PaginatedResponse<LearningPath>>({
    queryKey: learningPathKeys.list(filters, page),
    queryFn: () => CoursesService.getLearningPaths(page, pageSize, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch single learning path by ID
export const useLearningPath = (pathId: string) => {
  return useQuery<LearningPath>({
    queryKey: learningPathKeys.detail(pathId),
    queryFn: () => CoursesService.getLearningPathById(pathId),
    enabled: !!pathId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Fetch learning path progress
export const useLearningPathProgress = (pathId: string) => {
  return useQuery({
    queryKey: learningPathKeys.progress(pathId),
    queryFn: () => CoursesService.getLearningPathProgress(pathId),
    enabled: !!pathId,
    staleTime: 1 * 60 * 1000, // 1 minute (progress changes frequently)
    gcTime: 5 * 60 * 1000,
  });
};

// Search learning paths with semantic search
export const useLearningPathSearch = (
  query: string, 
  filters?: FilterMetadata,
  enabled: boolean = true
) => {
  return useQuery<LearningPath[]>({
    queryKey: learningPathKeys.search(query, filters),
    queryFn: () => CoursesService.searchLearningPaths(query, filters),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get personalized learning path recommendations
export const usePersonalizedPaths = () => {
  return useQuery<LearningPath[]>({
    queryKey: learningPathKeys.personalized(),
    queryFn: () => CoursesService.getPersonalizedPaths(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Get next recommended concept
export const useNextConcept = (pathId: string) => {
  return useQuery({
    queryKey: [...learningPathKeys.all, 'nextConcept', pathId],
    queryFn: () => CoursesService.getNextConcept(pathId),
    enabled: !!pathId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};