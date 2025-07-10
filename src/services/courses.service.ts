import { api } from './api';
import type { 
  Course, 
  LearningPath, 
  Concept,
  ApiResponse,
  PaginatedResponse
} from '../types';
import type { FilterMetadata } from './pinecone/types';

export class CoursesService {
  // Course endpoints
  static async getCourses(
    page: number = 1,
    pageSize: number = 20,
    filters?: FilterMetadata
  ): Promise<PaginatedResponse<Course>> {
    return api.get('/api/courses', {
      params: {
        page,
        pageSize,
        ...filters,
      },
    });
  }

  static async searchCourses(
    query: string,
    filters?: FilterMetadata
  ): Promise<Course[]> {
    return api.get('/api/courses/search', {
      params: {
        q: query,
        ...filters,
      },
    });
  }

  static async getCourseById(courseId: string): Promise<Course> {
    return api.get(`/api/courses/${courseId}`);
  }

  static async getRelatedCourses(courseId: string, limit: number = 5): Promise<Course[]> {
    return api.get(`/api/courses/${courseId}/related`, {
      params: { limit },
    });
  }

  static async enrollInCourse(courseId: string): Promise<ApiResponse<void>> {
    return api.post(`/api/courses/${courseId}/enroll`);
  }

  // Learning path endpoints
  static async getLearningPaths(
    page: number = 1,
    pageSize: number = 20,
    filters?: FilterMetadata
  ): Promise<PaginatedResponse<LearningPath>> {
    return api.get('/api/learning-paths', {
      params: {
        page,
        pageSize,
        ...filters,
      },
    });
  }

  static async searchLearningPaths(
    query: string,
    filters?: FilterMetadata
  ): Promise<LearningPath[]> {
    return api.get('/api/learning-paths/search', {
      params: {
        q: query,
        ...filters,
      },
    });
  }

  static async getLearningPathById(pathId: string): Promise<LearningPath> {
    return api.get(`/api/learning-paths/${pathId}`);
  }

  static async getLearningPathProgress(pathId: string): Promise<any> {
    return api.get(`/api/learning-paths/${pathId}/progress`);
  }

  // Concept endpoints
  static async searchConcepts(
    query: string,
    filters?: FilterMetadata
  ): Promise<Concept[]> {
    return api.get('/api/concepts/search', {
      params: {
        q: query,
        ...filters,
      },
    });
  }

  static async getConceptById(conceptId: string): Promise<Concept> {
    return api.get(`/api/concepts/${conceptId}`);
  }

  static async getConceptComponents(conceptId: string): Promise<any> {
    return api.get(`/api/concepts/${conceptId}/components`);
  }

  // Recommendation endpoints
  static async getPersonalizedCourses(): Promise<Course[]> {
    return api.get('/api/recommendations/courses');
  }

  static async getPersonalizedPaths(): Promise<LearningPath[]> {
    return api.get('/api/recommendations/paths');
  }

  static async getNextConcept(pathId: string): Promise<Concept> {
    return api.get('/api/recommendations/next-concept', {
      params: { pathId },
    });
  }

  // Cache management
  static async refreshCache(entityType: 'courses' | 'paths' | 'concepts'): Promise<ApiResponse<void>> {
    return api.post(`/api/cache/refresh/${entityType}`);
  }
}