import { QueryClient } from '@tanstack/react-query';

// Cache key generators
export const cacheKeys = {
  courses: {
    all: ['courses'] as const,
    lists: () => [...cacheKeys.courses.all, 'list'] as const,
    list: (filters: any) => [...cacheKeys.courses.lists(), filters] as const,
    details: () => [...cacheKeys.courses.all, 'detail'] as const,
    detail: (id: string) => [...cacheKeys.courses.details(), id] as const,
    search: (query: string) => [...cacheKeys.courses.all, 'search', query] as const,
    recommendations: (userId?: string) => [...cacheKeys.courses.all, 'recommendations', userId] as const,
  },
  learningPaths: {
    all: ['learning-paths'] as const,
    lists: () => [...cacheKeys.learningPaths.all, 'list'] as const,
    list: (filters: any) => [...cacheKeys.learningPaths.lists(), filters] as const,
    details: () => [...cacheKeys.learningPaths.all, 'detail'] as const,
    detail: (id: string) => [...cacheKeys.learningPaths.details(), id] as const,
    search: (query: string) => [...cacheKeys.learningPaths.all, 'search', query] as const,
  },
};

// Cache invalidation helpers
export const invalidateQueries = {
  courses: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: cacheKeys.courses.all });
  },
  courseDetail: (queryClient: QueryClient, courseId: string) => {
    queryClient.invalidateQueries({ queryKey: cacheKeys.courses.detail(courseId) });
  },
  learningPaths: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: cacheKeys.learningPaths.all });
  },
  learningPathDetail: (queryClient: QueryClient, pathId: string) => {
    queryClient.invalidateQueries({ queryKey: cacheKeys.learningPaths.detail(pathId) });
  },
};

// Optimistic update helpers
export const optimisticUpdates = {
  enrollCourse: (queryClient: QueryClient, courseId: string) => {
    // Update the course detail to show enrolled status
    queryClient.setQueryData(cacheKeys.courses.detail(courseId), (old: any) => {
      if (!old) return old;
      return {
        ...old,
        enrolled: true,
        students: (old.students || 0) + 1,
      };
    });

    // Update the courses list
    queryClient.setQueryData(cacheKeys.courses.lists(), (old: any) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.map((course: any) =>
          course.id === courseId
            ? { ...course, enrolled: true, students: (course.students || 0) + 1 }
            : course
        ),
      };
    });
  },

  updateProgress: (
    queryClient: QueryClient,
    pathId: string,
    conceptId: string,
    progress: any
  ) => {
    queryClient.setQueryData(cacheKeys.learningPaths.detail(pathId), (old: any) => {
      if (!old) return old;
      
      // Deep clone and update the specific concept progress
      const updated = JSON.parse(JSON.stringify(old));
      
      // Find and update the concept
      updated.sections?.forEach((section: any) => {
        section.concepts?.forEach((concept: any) => {
          if (concept.id === conceptId) {
            concept.progress = { ...concept.progress, ...progress };
          }
        });
      });
      
      return updated;
    });
  },
};

// Prefetch helpers
export const prefetchQueries = {
  courseDetail: async (queryClient: QueryClient, courseId: string) => {
    await queryClient.prefetchQuery({
      queryKey: cacheKeys.courses.detail(courseId),
      queryFn: async () => {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        return response.json();
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  learningPathDetail: async (queryClient: QueryClient, pathId: string) => {
    await queryClient.prefetchQuery({
      queryKey: cacheKeys.learningPaths.detail(pathId),
      queryFn: async () => {
        const response = await fetch(`/api/learning-paths/${pathId}`);
        if (!response.ok) throw new Error('Failed to fetch learning path');
        return response.json();
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },
};

// Cache persistence helpers
export const persistCache = {
  save: (queryClient: QueryClient) => {
    const cache = queryClient.getQueryCache().getAll();
    const serialized = cache.map((query) => ({
      queryKey: query.queryKey,
      queryHash: query.queryHash,
      state: query.state,
    }));
    
    try {
      localStorage.setItem('sploosh-query-cache', JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to persist cache:', error);
    }
  },

  restore: (queryClient: QueryClient) => {
    try {
      const saved = localStorage.getItem('sploosh-query-cache');
      if (!saved) return;
      
      const cache = JSON.parse(saved);
      cache.forEach((item: any) => {
        if (item.state?.data) {
          queryClient.setQueryData(item.queryKey, item.state.data);
        }
      });
    } catch (error) {
      console.error('Failed to restore cache:', error);
    }
  },
};