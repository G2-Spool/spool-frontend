import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { usePineconeData } from '../../src/hooks/pinecone/usePineconeData';
import { useCourses } from '../../src/hooks/useCourses';
import { useLearningPath } from '../../src/hooks/useLearningPath';
import { useRecommendations } from '../../src/hooks/useRecommendations';
import { CoursesService } from '../../src/services/courses.service';
import { PineconeService } from '../../src/services/pinecone/pinecone.service';
import { 
  mockCourses, 
  mockLearningPaths, 
  mockConcepts,
  mockStudentProfile,
  mockSearchResults 
} from '../fixtures/mockData';

// Mock the services
vi.mock('../../src/services/courses.service');
vi.mock('../../src/services/pinecone/pinecone.service');

const mockedCoursesService = vi.mocked(CoursesService);
const mockedPineconeService = vi.mocked(PineconeService);

describe('React Query Hooks Integration Tests', () => {
  let queryClient: QueryClient;

  const createWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('usePineconeData Hook', () => {
    beforeEach(() => {
      // Mock PineconeService methods
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockResolvedValue(mockSearchResults.courses),
        searchPaths: vi.fn().mockResolvedValue(mockSearchResults.paths),
        searchConcepts: vi.fn().mockResolvedValue(mockSearchResults.concepts),
        getPersonalizedRecommendations: vi.fn().mockResolvedValue(mockSearchResults.courses),
        getRelatedCourses: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);
    });

    it('should search courses successfully', async () => {
      const { result } = renderHook(
        () => usePineconeData(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.searchCourses).toBeDefined();
      });

      const searchResult = await result.current.searchCourses('JavaScript');

      expect(searchResult).toEqual(mockSearchResults.courses);
    });

    it('should search learning paths successfully', async () => {
      const { result } = renderHook(
        () => usePineconeData(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.searchPaths).toBeDefined();
      });

      const searchResult = await result.current.searchPaths('web development');

      expect(searchResult).toEqual(mockSearchResults.paths);
    });

    it('should search concepts successfully', async () => {
      const { result } = renderHook(
        () => usePineconeData(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.searchConcepts).toBeDefined();
      });

      const searchResult = await result.current.searchConcepts('variables');

      expect(searchResult).toEqual(mockSearchResults.concepts);
    });

    it('should get personalized recommendations', async () => {
      const { result } = renderHook(
        () => usePineconeData(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.getPersonalizedRecommendations).toBeDefined();
      });

      const recommendations = await result.current.getPersonalizedRecommendations(
        mockStudentProfile
      );

      expect(recommendations).toEqual(mockSearchResults.courses);
    });

    it('should get related courses', async () => {
      const { result } = renderHook(
        () => usePineconeData(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.getRelatedCourses).toBeDefined();
      });

      const relatedCourses = await result.current.getRelatedCourses('course-1');

      expect(relatedCourses).toEqual(mockSearchResults.courses);
    });

    it('should handle search errors gracefully', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockRejectedValue(new Error('Search failed')),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const { result } = renderHook(
        () => usePineconeData(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.searchCourses).toBeDefined();
      });

      await expect(result.current.searchCourses('JavaScript')).rejects.toThrow('Search failed');
    });
  });

  describe('useCourses Hook', () => {
    beforeEach(() => {
      // Mock CoursesService methods
      mockedCoursesService.getCourses.mockResolvedValue({
        data: mockCourses,
        pagination: { page: 1, pageSize: 20, total: 3, totalPages: 1 },
      });
      mockedCoursesService.searchCourses.mockResolvedValue(mockCourses);
      mockedCoursesService.getCourseById.mockResolvedValue(mockCourses[0]);
      mockedCoursesService.getRelatedCourses.mockResolvedValue([mockCourses[1]]);
      mockedCoursesService.enrollInCourse.mockResolvedValue({ success: true });
    });

    it('should fetch courses with pagination', async () => {
      const { result } = renderHook(
        () => useCourses(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(result.current.data?.data).toEqual(mockCourses);
      expect(result.current.data?.pagination.total).toBe(3);
    });

    it('should handle courses loading state', async () => {
      const { result } = renderHook(
        () => useCourses(),
        { wrapper: createWrapper }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle courses error state', async () => {
      mockedCoursesService.getCourses.mockRejectedValue(new Error('Failed to fetch'));

      const { result } = renderHook(
        () => useCourses(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it('should fetch course by ID', async () => {
      const { result } = renderHook(
        () => useCourses({ courseId: 'course-1' }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.course).toBeDefined();
      });

      expect(result.current.course).toEqual(mockCourses[0]);
    });

    it('should search courses', async () => {
      const { result } = renderHook(
        () => useCourses({ searchQuery: 'JavaScript' }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.searchResults).toBeDefined();
      });

      expect(result.current.searchResults).toEqual(mockCourses);
    });

    it('should get related courses', async () => {
      const { result } = renderHook(
        () => useCourses({ courseId: 'course-1', includeRelated: true }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.relatedCourses).toBeDefined();
      });

      expect(result.current.relatedCourses).toEqual([mockCourses[1]]);
    });

    it('should enroll in course', async () => {
      const { result } = renderHook(
        () => useCourses(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.enrollInCourse).toBeDefined();
      });

      await result.current.enrollInCourse.mutateAsync('course-1');

      expect(mockedCoursesService.enrollInCourse).toHaveBeenCalledWith('course-1');
    });

    it('should handle enrollment errors', async () => {
      mockedCoursesService.enrollInCourse.mockRejectedValue(new Error('Enrollment failed'));

      const { result } = renderHook(
        () => useCourses(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.enrollInCourse).toBeDefined();
      });

      await expect(
        result.current.enrollInCourse.mutateAsync('course-1')
      ).rejects.toThrow('Enrollment failed');
    });
  });

  describe('useLearningPath Hook', () => {
    beforeEach(() => {
      mockedCoursesService.getLearningPaths.mockResolvedValue({
        data: mockLearningPaths,
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      });
      mockedCoursesService.searchLearningPaths.mockResolvedValue(mockLearningPaths);
      mockedCoursesService.getLearningPathById.mockResolvedValue(mockLearningPaths[0]);
      mockedCoursesService.getLearningPathProgress.mockResolvedValue({
        completed: 5,
        total: 10,
        percentage: 50,
      });
    });

    it('should fetch learning paths', async () => {
      const { result } = renderHook(
        () => useLearningPath(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(result.current.data?.data).toEqual(mockLearningPaths);
    });

    it('should fetch learning path by ID', async () => {
      const { result } = renderHook(
        () => useLearningPath({ pathId: 'path-1' }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.path).toBeDefined();
      });

      expect(result.current.path).toEqual(mockLearningPaths[0]);
    });

    it('should search learning paths', async () => {
      const { result } = renderHook(
        () => useLearningPath({ searchQuery: 'web development' }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.searchResults).toBeDefined();
      });

      expect(result.current.searchResults).toEqual(mockLearningPaths);
    });

    it('should get learning path progress', async () => {
      const { result } = renderHook(
        () => useLearningPath({ pathId: 'path-1', includeProgress: true }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.progress).toBeDefined();
      });

      expect(result.current.progress).toEqual({
        completed: 5,
        total: 10,
        percentage: 50,
      });
    });

    it('should handle learning path errors', async () => {
      mockedCoursesService.getLearningPaths.mockRejectedValue(new Error('Failed to fetch paths'));

      const { result } = renderHook(
        () => useLearningPath(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('useRecommendations Hook', () => {
    beforeEach(() => {
      mockedCoursesService.getPersonalizedCourses.mockResolvedValue(mockCourses);
      mockedCoursesService.getPersonalizedPaths.mockResolvedValue(mockLearningPaths);
      mockedCoursesService.getNextConcept.mockResolvedValue(mockConcepts[0]);
    });

    it('should get personalized course recommendations', async () => {
      const { result } = renderHook(
        () => useRecommendations(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.personalizedCourses).toBeDefined();
      });

      expect(result.current.personalizedCourses).toEqual(mockCourses);
    });

    it('should get personalized path recommendations', async () => {
      const { result } = renderHook(
        () => useRecommendations(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.personalizedPaths).toBeDefined();
      });

      expect(result.current.personalizedPaths).toEqual(mockLearningPaths);
    });

    it('should get next concept recommendation', async () => {
      const { result } = renderHook(
        () => useRecommendations({ pathId: 'path-1' }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.nextConcept).toBeDefined();
      });

      expect(result.current.nextConcept).toEqual(mockConcepts[0]);
    });

    it('should handle recommendation loading states', async () => {
      const { result } = renderHook(
        () => useRecommendations(),
        { wrapper: createWrapper }
      );

      expect(result.current.isLoadingCourses).toBe(true);
      expect(result.current.isLoadingPaths).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoadingCourses).toBe(false);
        expect(result.current.isLoadingPaths).toBe(false);
      });
    });

    it('should handle recommendation errors', async () => {
      mockedCoursesService.getPersonalizedCourses.mockRejectedValue(
        new Error('Recommendations failed')
      );

      const { result } = renderHook(
        () => useRecommendations(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.isErrorCourses).toBe(true);
      });

      expect(result.current.errorCourses).toBeInstanceOf(Error);
    });
  });

  describe('Cache Management', () => {
    it('should invalidate courses cache on enrollment', async () => {
      const { result } = renderHook(
        () => useCourses(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.enrollInCourse).toBeDefined();
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      await result.current.enrollInCourse.mutateAsync('course-1');

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['courses'],
      });
    });

    it('should prefetch related courses', async () => {
      const prefetchSpy = vi.spyOn(queryClient, 'prefetchQuery');

      const { result } = renderHook(
        () => useCourses({ courseId: 'course-1', prefetchRelated: true }),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.course).toBeDefined();
      });

      expect(prefetchSpy).toHaveBeenCalledWith({
        queryKey: ['courses', 'course-1', 'related'],
        queryFn: expect.any(Function),
      });
    });

    it('should use stale data while revalidating', async () => {
      // Initial fetch
      const { result, rerender } = renderHook(
        () => useCourses(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      const initialData = result.current.data;

      // Mock new data for refetch
      mockedCoursesService.getCourses.mockResolvedValue({
        data: [...mockCourses, { ...mockCourses[0], id: 'course-4' }],
        pagination: { page: 1, pageSize: 20, total: 4, totalPages: 1 },
      });

      // Trigger refetch
      rerender();

      // Should still have initial data while fetching
      expect(result.current.data).toEqual(initialData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(true);
    });
  });

  describe('Error Boundaries and Resilience', () => {
    it('should handle network errors gracefully', async () => {
      mockedCoursesService.getCourses.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(
        () => useCourses(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error.message).toBe('Network error');
    });

    it('should retry failed requests', async () => {
      let attemptCount = 0;
      mockedCoursesService.getCourses.mockImplementation(() => {
        attemptCount++;
        if (attemptCount === 1) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          data: mockCourses,
          pagination: { page: 1, pageSize: 20, total: 3, totalPages: 1 },
        });
      });

      // Enable retry for this test
      queryClient.setDefaultOptions({
        queries: { retry: 1 },
      });

      const { result } = renderHook(
        () => useCourses(),
        { wrapper: createWrapper }
      );

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(attemptCount).toBe(2);
      expect(result.current.data?.data).toEqual(mockCourses);
    });
  });
});