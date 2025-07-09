import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CoursesService } from '../services/courses.service';
import type { Course, PaginatedResponse } from '../types';
import type { FilterMetadata } from '../services/pinecone/types';

// Query keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters?: FilterMetadata, page?: number) => 
    [...courseKeys.lists(), { filters, page }] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  search: (query: string, filters?: FilterMetadata) => 
    [...courseKeys.all, 'search', { query, filters }] as const,
  related: (id: string) => [...courseKeys.all, 'related', id] as const,
  personalized: () => [...courseKeys.all, 'personalized'] as const,
};

// Fetch all courses with pagination
export const useCourses = (
  page: number = 1, 
  pageSize: number = 20,
  filters?: FilterMetadata
) => {
  return useQuery<PaginatedResponse<Course>>({
    queryKey: courseKeys.list(filters, page),
    queryFn: () => CoursesService.getCourses(page, pageSize, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch single course by ID
export const useCourse = (courseId: string) => {
  return useQuery<Course>({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => CoursesService.getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Search courses with semantic search
export const useCourseSearch = (
  query: string, 
  filters?: FilterMetadata,
  enabled: boolean = true
) => {
  return useQuery<Course[]>({
    queryKey: courseKeys.search(query, filters),
    queryFn: () => CoursesService.searchCourses(query, filters),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get related courses
export const useRelatedCourses = (courseId: string, limit: number = 5) => {
  return useQuery<Course[]>({
    queryKey: courseKeys.related(courseId),
    queryFn: () => CoursesService.getRelatedCourses(courseId, limit),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Get personalized course recommendations
export const usePersonalizedCourses = () => {
  return useQuery<Course[]>({
    queryKey: courseKeys.personalized(),
    queryFn: () => CoursesService.getPersonalizedCourses(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Enroll in a course
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => CoursesService.enrollInCourse(courseId),
    onSuccess: (_, courseId) => {
      // Invalidate course detail and lists to update enrollment status
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
};