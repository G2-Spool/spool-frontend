import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { LifeCategory } from '../types';

export interface LearningPath {
  id: string;
  title: string;
  category: LifeCategory;
  description: string;
  progress: number;
  totalExercises: number;
  completedExercises: number;
  estimatedMinutes: number;
  points: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentStats {
  totalPoints: number;
  exercisesThisMonth: number;
  learningTimeThisWeek: number;
  dailyGoalMinutes: number;
  currentStreak: number;
  weeklyData?: {
    points: number[];
    exercises: number[];
    timeMinutes: number[];
    goalMinutes: number[];
  };
}

class LearningPathsService {
  /**
   * Get all learning paths for the current student
   * Uses the progress service which connects to RDS
   */
  async getLearningPaths(): Promise<LearningPath[]> {
    try {
      // Use progress service endpoint that connects to RDS
      const response = await api.get<LearningPath[]>('/api/progress/learning-paths');
      return response;
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      return [];
    }
  }

  /**
   * Get a specific learning path by ID
   */
  async getLearningPathById(id: string): Promise<LearningPath | null> {
    try {
      const endpoint = API_ENDPOINTS.learning.pathById.replace(':id', id);
      const response = await api.get<LearningPath>(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching learning path:', error);
      return null;
    }
  }

  /**
   * Get student's active learning path
   */
  async getActiveLearningPath(): Promise<LearningPath | null> {
    try {
      const paths = await this.getLearningPaths();
      return paths.find(path => path.isActive) || null;
    } catch (error) {
      console.error('Error fetching active learning path:', error);
      return null;
    }
  }

  /**
   * Search learning paths
   */
  async searchLearningPaths(query: string, category?: LifeCategory): Promise<LearningPath[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);
      
      const response = await api.get<LearningPath[]>(
        `${API_ENDPOINTS.learning.searchPaths}?${params.toString()}`
      );
      return response;
    } catch (error) {
      console.error('Error searching learning paths:', error);
      return [];
    }
  }

  /**
   * Update learning path progress
   */
  async updateProgress(pathId: string, exerciseId: string): Promise<void> {
    try {
      const endpoint = API_ENDPOINTS.learning.pathProgress.replace(':id', pathId);
      await api.post(endpoint, { exerciseId });
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  /**
   * Get student statistics from RDS via progress service
   */
  async getStudentStats(): Promise<StudentStats> {
    try {
      // Use progress service analytics endpoint that queries RDS
      const response = await api.get<StudentStats>('/api/progress/analytics/stats');
      return response;
    } catch (error) {
      console.error('Error fetching student stats:', error);
      // Return default values if API fails
      return {
        totalPoints: 0,
        exercisesThisMonth: 0,
        learningTimeThisWeek: 0,
        dailyGoalMinutes: 30,
        currentStreak: 0,
        weeklyData: {
          points: [0, 0, 0, 0, 0, 0, 0],
          exercises: [0, 0, 0, 0, 0, 0, 0],
          timeMinutes: [0, 0, 0, 0, 0, 0, 0],
          goalMinutes: [30, 30, 30, 30, 30, 30, 30],
        }
      };
    }
  }

  /**
   * Set a learning path as active
   */
  async setActivePath(pathId: string): Promise<void> {
    try {
      await api.post(`/api/learning-paths/${pathId}/activate`);
    } catch (error) {
      console.error('Error setting active path:', error);
      throw error;
    }
  }
}

export const learningPathsService = new LearningPathsService();
export default learningPathsService;