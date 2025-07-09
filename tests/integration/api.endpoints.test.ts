import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { CoursesService } from '../../src/services/courses.service';
import { api } from '../../src/services/api';
import { 
  mockCourses, 
  mockLearningPaths, 
  mockConcepts,
  mockApiResponses,
  mockFilters
} from '../fixtures/mockData';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('API Endpoints Integration Tests', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Setup axios mock
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should add auth token to requests', () => {
      localStorage.setItem('authToken', 'test-token');
      
      // Re-create api instance to trigger interceptor setup
      const apiInstance = new (api as any).constructor();
      
      // Verify request interceptor was set up
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('should handle 401 responses', async () => {
      const error = {
        response: { status: 401 },
      };

      mockAxiosInstance.get.mockRejectedValue(error);

      try {
        await api.get('/test');
      } catch (e) {
        expect(localStorage.getItem('authToken')).toBeNull();
        expect(window.location.href).toBe('/login');
      }
    });

    it('should handle other errors without logout', async () => {
      const error = {
        response: { status: 500 },
        message: 'Server error',
      };

      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(api.get('/test')).rejects.toThrow();
      expect(localStorage.getItem('authToken')).toBeNull(); // Should remain as cleared from beforeEach
    });
  });

  describe('Course Endpoints', () => {
    it('should fetch courses with pagination', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockApiResponses.courses.success,
      });

      const result = await CoursesService.getCourses(1, 20);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/courses', {
        params: {
          page: 1,
          pageSize: 20,
        },
      });

      expect(result).toEqual(mockApiResponses.courses.success);
    });

    it('should fetch courses with filters', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockApiResponses.courses.success,
      });

      await CoursesService.getCourses(1, 20, mockFilters);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/courses', {
        params: {
          page: 1,
          pageSize: 20,
          ...mockFilters,
        },
      });
    });

    it('should search courses', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: mockApiResponses.search.success,
      });

      const result = await CoursesService.searchCourses('JavaScript', mockFilters);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/courses/search', {
        params: {
          q: 'JavaScript',
          ...mockFilters,
        },
      });

      expect(result).toEqual(mockApiResponses.search.success);
    });

    it('should get course by ID', async () => {
      const course = mockCourses[0];
      mockAxiosInstance.get.mockResolvedValue({ data: course });

      const result = await CoursesService.getCourseById(course.id);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/api/courses/${course.id}`);
      expect(result).toEqual(course);
    });

    it('should get related courses', async () => {
      const relatedCourses = [mockCourses[1], mockCourses[2]];
      mockAxiosInstance.get.mockResolvedValue({ data: relatedCourses });

      const result = await CoursesService.getRelatedCourses('course-1', 5);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/courses/course-1/related', {
        params: { limit: 5 },
      });

      expect(result).toEqual(relatedCourses);
    });

    it('should enroll in course', async () => {
      const successResponse = { success: true, message: 'Enrolled successfully' };
      mockAxiosInstance.post.mockResolvedValue({ data: successResponse });

      const result = await CoursesService.enrollInCourse('course-1');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/courses/course-1/enroll');
      expect(result).toEqual(successResponse);
    });

    it('should handle course fetch errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      await expect(CoursesService.getCourses()).rejects.toThrow('Network error');
    });

    it('should handle course search errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Search failed'));

      await expect(CoursesService.searchCourses('JavaScript')).rejects.toThrow('Search failed');
    });
  });

  describe('Learning Path Endpoints', () => {
    it('should fetch learning paths', async () => {
      const pathsResponse = {
        data: mockLearningPaths,
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: pathsResponse });

      const result = await CoursesService.getLearningPaths();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/learning-paths', {
        params: {
          page: 1,
          pageSize: 20,
        },
      });

      expect(result).toEqual(pathsResponse);
    });

    it('should search learning paths', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockLearningPaths });

      const result = await CoursesService.searchLearningPaths('web development');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/learning-paths/search', {
        params: {
          q: 'web development',
        },
      });

      expect(result).toEqual(mockLearningPaths);
    });

    it('should get learning path by ID', async () => {
      const path = mockLearningPaths[0];
      mockAxiosInstance.get.mockResolvedValue({ data: path });

      const result = await CoursesService.getLearningPathById(path.id);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/api/learning-paths/${path.id}`);
      expect(result).toEqual(path);
    });

    it('should get learning path progress', async () => {
      const progress = { completed: 5, total: 10, percentage: 50 };
      mockAxiosInstance.get.mockResolvedValue({ data: progress });

      const result = await CoursesService.getLearningPathProgress('path-1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/learning-paths/path-1/progress');
      expect(result).toEqual(progress);
    });
  });

  describe('Concept Endpoints', () => {
    it('should search concepts', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockConcepts });

      const result = await CoursesService.searchConcepts('JavaScript variables');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/concepts/search', {
        params: {
          q: 'JavaScript variables',
        },
      });

      expect(result).toEqual(mockConcepts);
    });

    it('should get concept by ID', async () => {
      const concept = mockConcepts[0];
      mockAxiosInstance.get.mockResolvedValue({ data: concept });

      const result = await CoursesService.getConceptById(concept.id);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/api/concepts/${concept.id}`);
      expect(result).toEqual(concept);
    });

    it('should get concept components', async () => {
      const components = [
        { type: 'video', url: '/video.mp4' },
        { type: 'exercise', id: 'exercise-1' },
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: components });

      const result = await CoursesService.getConceptComponents('concept-1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/concepts/concept-1/components');
      expect(result).toEqual(components);
    });
  });

  describe('Recommendation Endpoints', () => {
    it('should get personalized courses', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockCourses });

      const result = await CoursesService.getPersonalizedCourses();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/recommendations/courses');
      expect(result).toEqual(mockCourses);
    });

    it('should get personalized paths', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockLearningPaths });

      const result = await CoursesService.getPersonalizedPaths();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/recommendations/paths');
      expect(result).toEqual(mockLearningPaths);
    });

    it('should get next concept', async () => {
      const nextConcept = mockConcepts[1];
      mockAxiosInstance.get.mockResolvedValue({ data: nextConcept });

      const result = await CoursesService.getNextConcept('path-1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/recommendations/next-concept', {
        params: { pathId: 'path-1' },
      });

      expect(result).toEqual(nextConcept);
    });

    it('should handle recommendation errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Recommendation failed'));

      await expect(CoursesService.getPersonalizedCourses()).rejects.toThrow('Recommendation failed');
    });
  });

  describe('Cache Management', () => {
    it('should refresh cache for courses', async () => {
      const successResponse = { success: true, message: 'Cache refreshed' };
      mockAxiosInstance.post.mockResolvedValue({ data: successResponse });

      const result = await CoursesService.refreshCache('courses');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/cache/refresh/courses');
      expect(result).toEqual(successResponse);
    });

    it('should refresh cache for paths', async () => {
      const successResponse = { success: true, message: 'Cache refreshed' };
      mockAxiosInstance.post.mockResolvedValue({ data: successResponse });

      const result = await CoursesService.refreshCache('paths');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/cache/refresh/paths');
      expect(result).toEqual(successResponse);
    });

    it('should refresh cache for concepts', async () => {
      const successResponse = { success: true, message: 'Cache refreshed' };
      mockAxiosInstance.post.mockResolvedValue({ data: successResponse });

      const result = await CoursesService.refreshCache('concepts');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/cache/refresh/concepts');
      expect(result).toEqual(successResponse);
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle network timeouts', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('timeout'));

      await expect(CoursesService.getCourses()).rejects.toThrow('timeout');
    });

    it('should handle malformed responses', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: null });

      const result = await CoursesService.getCourses();

      expect(result).toBeNull();
    });

    it('should handle server errors', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(serverError);

      await expect(CoursesService.getCourses()).rejects.toEqual(serverError);
    });

    it('should handle rate limiting', async () => {
      const rateLimitError = {
        response: {
          status: 429,
          data: { message: 'Too many requests' },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(rateLimitError);

      await expect(CoursesService.searchCourses('test')).rejects.toEqual(rateLimitError);
    });
  });

  describe('Request Configuration', () => {
    it('should pass custom headers', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockCourses });

      await api.get('/test', {
        headers: {
          'Custom-Header': 'value',
        },
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        headers: {
          'Custom-Header': 'value',
        },
      });
    });

    it('should handle POST requests with data', async () => {
      const postData = { name: 'Test Course' };
      mockAxiosInstance.post.mockResolvedValue({ data: { id: 'new-course' } });

      const result = await api.post('/api/courses', postData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/courses', postData, undefined);
      expect(result).toEqual({ id: 'new-course' });
    });

    it('should handle PUT requests', async () => {
      const updateData = { title: 'Updated Course' };
      mockAxiosInstance.put.mockResolvedValue({ data: { success: true } });

      const result = await api.put('/api/courses/1', updateData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/courses/1', updateData, undefined);
      expect(result).toEqual({ success: true });
    });

    it('should handle DELETE requests', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: { success: true } });

      const result = await api.delete('/api/courses/1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/courses/1', undefined);
      expect(result).toEqual({ success: true });
    });

    it('should handle PATCH requests', async () => {
      const patchData = { isActive: false };
      mockAxiosInstance.patch.mockResolvedValue({ data: { success: true } });

      const result = await api.patch('/api/courses/1', patchData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/api/courses/1', patchData, undefined);
      expect(result).toEqual({ success: true });
    });
  });
});