import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CoursesService } from '../services/courses.service';
import { courseKeys } from './useCourses';
import { learningPathKeys } from './useLearningPath';
import type { Course, LearningPath, Concept } from '../types';

// Combined recommendations hook
export const useRecommendations = () => {
  const { data: personalizedCourses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: courseKeys.personalized(),
    queryFn: () => CoursesService.getPersonalizedCourses(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: personalizedPaths, isLoading: pathsLoading } = useQuery<LearningPath[]>({
    queryKey: learningPathKeys.personalized(),
    queryFn: () => CoursesService.getPersonalizedPaths(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    courses: personalizedCourses || [],
    paths: personalizedPaths || [],
    isLoading: coursesLoading || pathsLoading,
    isCoursesLoading: coursesLoading,
    isPathsLoading: pathsLoading,
  };
};

// Hook for getting next concept recommendation
export const useNextConceptRecommendation = (pathId: string) => {
  return useQuery<Concept>({
    queryKey: ['recommendations', 'nextConcept', pathId],
    queryFn: () => CoursesService.getNextConcept(pathId),
    enabled: !!pathId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for prefetching recommendations
export const usePrefetchRecommendations = () => {
  const queryClient = useQueryClient();

  const prefetchRecommendations = async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: courseKeys.personalized(),
        queryFn: () => CoursesService.getPersonalizedCourses(),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: learningPathKeys.personalized(),
        queryFn: () => CoursesService.getPersonalizedPaths(),
        staleTime: 5 * 60 * 1000,
      }),
    ]);
  };

  return { prefetchRecommendations };
};