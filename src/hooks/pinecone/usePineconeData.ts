import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CoursesService } from '../../services/courses.service';
import { useAuth } from '../../contexts/AuthContext';
import type { FilterMetadata } from '../../services/pinecone/types';

// Course hooks
export const useCourses = (
  page: number = 1,
  pageSize: number = 20,
  filters?: FilterMetadata
) => {
  return useQuery({
    queryKey: ['courses', page, pageSize, filters],
    queryFn: () => CoursesService.getCourses(page, pageSize, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchCourses = (
  query: string,
  filters?: FilterMetadata
) => {
  return useQuery({
    queryKey: ['search-courses', query, filters],
    queryFn: () => CoursesService.searchCourses(query, filters),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => CoursesService.getCourseById(courseId),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useRelatedCourses = (courseId: string, limit?: number) => {
  return useQuery({
    queryKey: ['related-courses', courseId, limit],
    queryFn: () => CoursesService.getRelatedCourses(courseId, limit),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

// Learning path hooks
export const useLearningPaths = (
  page: number = 1,
  pageSize: number = 20,
  filters?: FilterMetadata
) => {
  return useQuery({
    queryKey: ['learning-paths', page, pageSize, filters],
    queryFn: () => CoursesService.getLearningPaths(page, pageSize, filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSearchLearningPaths = (
  query: string,
  filters?: FilterMetadata
) => {
  return useQuery({
    queryKey: ['search-learning-paths', query, filters],
    queryFn: () => CoursesService.searchLearningPaths(query, filters),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useLearningPath = (pathId: string) => {
  return useQuery({
    queryKey: ['learning-path', pathId],
    queryFn: () => CoursesService.getLearningPathById(pathId),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useLearningPathProgress = (pathId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['learning-path-progress', pathId, user?.id],
    queryFn: () => CoursesService.getLearningPathProgress(pathId),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

// Concept hooks
export const useSearchConcepts = (
  query: string,
  filters?: FilterMetadata
) => {
  return useQuery({
    queryKey: ['search-concepts', query, filters],
    queryFn: () => CoursesService.searchConcepts(query, filters),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useConcept = (conceptId: string) => {
  return useQuery({
    queryKey: ['concept', conceptId],
    queryFn: () => CoursesService.getConceptById(conceptId),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useConceptComponents = (conceptId: string) => {
  return useQuery({
    queryKey: ['concept-components', conceptId],
    queryFn: () => CoursesService.getConceptComponents(conceptId),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

// Recommendation hooks
export const usePersonalizedCourses = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['personalized-courses', user?.id],
    queryFn: () => CoursesService.getPersonalizedCourses(),
    enabled: !!user,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

export const usePersonalizedPaths = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['personalized-paths', user?.id],
    queryFn: () => CoursesService.getPersonalizedPaths(),
    enabled: !!user,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

export const useNextConcept = (pathId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['next-concept', pathId, user?.id],
    queryFn: () => CoursesService.getNextConcept(pathId),
    enabled: !!user && !!pathId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => CoursesService.enrollInCourse(courseId),
    onSuccess: (_, courseId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['personalized-courses'] });
    },
  });
};

// Cache management
export const useRefreshCache = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entityType: 'courses' | 'paths' | 'concepts') => 
      CoursesService.refreshCache(entityType),
    onSuccess: (_, entityType) => {
      // Invalidate all queries for the entity type
      queryClient.invalidateQueries({ queryKey: [entityType] });
    },
  });
};