import api from './api';
import { API_ENDPOINTS } from '../config/api';
import type { LifeCategory } from '../types';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty_level?: string;
  estimated_hours?: number;
  total_concepts?: number;
  concepts_completed?: number;
  status?: string;
  progress_percentage?: number;
  image_url?: string;
  tags?: string[];
  prerequisites?: string[];
  learning_objectives?: string[];
  associated_threads?: string[];
  created_at?: string;
  updated_at?: string;
  started_at?: string;
  completed_at?: string;
  total_time_spent_seconds?: number;
  last_accessed_at?: string;
  // Legacy fields for backward compatibility
  category?: LifeCategory;
  progress?: number;
  totalExercises?: number;
  completedExercises?: number;
  estimatedMinutes?: number;
  points?: number;
  isActive?: boolean;
}

export interface StudentStats {
  learning_paths: {
    total: number;
    completed: number;
    in_progress: number;
    completion_rate: number;
  };
  concepts: {
    total: number;
    completed: number;
    completion_rate: number;
  };
  time_spent: {
    total_seconds: number;
    total_hours: number;
  };
  threads: {
    total: number;
    completed: number;
    active: number;
  };
  // Legacy fields for backward compatibility
  totalPoints?: number;
  exercisesThisMonth?: number;
  learningTimeThisWeek?: number;
  dailyGoalMinutes?: number;
  currentStreak?: number;
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
   * Uses Supabase edge function for learning path management
   */
  async getLearningPaths(filters?: { subject?: string; status?: string; difficulty_level?: string }): Promise<LearningPath[]> {
    try {
      const response = await api.post<{ learning_paths: LearningPath[] }>('/learning-paths-management', {
        action: 'list',
        user_id: this.getCurrentUserId(),
        filters
      });
      
      // Transform data to include legacy fields for backward compatibility
      return response.learning_paths.map(path => ({
        ...path,
        category: path.subject as LifeCategory,
        progress: path.progress_percentage || 0,
        totalExercises: path.total_concepts || 0,
        completedExercises: path.concepts_completed || 0,
        estimatedMinutes: (path.estimated_hours || 0) * 60,
        points: (path.concepts_completed || 0) * 10, // 10 points per completed concept
        isActive: path.status === 'in_progress'
      }));
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
      const response = await api.post<{ learning_path: LearningPath }>('/learning-paths-management', {
        action: 'get',
        learning_path_id: id,
        user_id: this.getCurrentUserId()
      });
      
      const path = response.learning_path;
      // Transform data to include legacy fields for backward compatibility
      return {
        ...path,
        category: path.subject as LifeCategory,
        progress: path.progress_percentage || 0,
        totalExercises: path.total_concepts || 0,
        completedExercises: path.concepts_completed || 0,
        estimatedMinutes: (path.estimated_hours || 0) * 60,
        points: (path.concepts_completed || 0) * 10,
        isActive: path.status === 'in_progress'
      };
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
   * Get student statistics from Supabase via edge function
   */
  async getStudentStats(): Promise<StudentStats> {
    try {
      const response = await api.post<{ stats: StudentStats }>('/learning-paths-management', {
        action: 'get-stats',
        user_id: this.getCurrentUserId()
      });
      
      const stats = response.stats;
      
      // Add legacy fields for backward compatibility
      return {
        ...stats,
        totalPoints: stats.concepts.completed * 10, // 10 points per completed concept
        exercisesThisMonth: stats.concepts.completed, // Simplified mapping
        learningTimeThisWeek: Math.round(stats.time_spent.total_hours * 60), // Convert to minutes
        dailyGoalMinutes: 30,
        currentStreak: 0, // TODO: Add streak calculation
        weeklyData: {
          points: [0, 0, 0, 0, 0, 0, stats.concepts.completed * 2],
          exercises: [0, 0, 0, 0, 0, 0, stats.concepts.completed],
          timeMinutes: [0, 0, 0, 0, 0, 0, Math.round(stats.time_spent.total_hours * 60 / 7)],
          goalMinutes: [30, 30, 30, 30, 30, 30, 30],
        }
      };
    } catch (error) {
      console.error('Error fetching student stats:', error);
      // Return default values if API fails
      return {
        learning_paths: { total: 0, completed: 0, in_progress: 0, completion_rate: 0 },
        concepts: { total: 0, completed: 0, completion_rate: 0 },
        time_spent: { total_seconds: 0, total_hours: 0 },
        threads: { total: 0, completed: 0, active: 0 },
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
      await api.post('/learning-paths-management', {
        action: 'update',
        learning_path_id: pathId,
        user_id: this.getCurrentUserId(),
        data: {
          status: 'in_progress',
          started_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error setting active path:', error);
      throw error;
    }
  }

  /**
   * Create a new learning path
   */
  async createLearningPath(pathData: Omit<LearningPath, 'id' | 'created_at' | 'updated_at'>): Promise<LearningPath | null> {
    try {
      const response = await api.post<{ learning_path: LearningPath }>('/learning-paths-management', {
        action: 'create',
        user_id: this.getCurrentUserId(),
        data: pathData
      });
      
      return response.learning_path;
    } catch (error) {
      console.error('Error creating learning path:', error);
      return null;
    }
  }

  /**
   * Update learning path progress
   */
  async updateLearningPathProgress(pathId: string, progressData: {
    concepts_completed?: number;
    progress_percentage?: number;
    status?: string;
    total_time_spent_seconds?: number;
  }): Promise<void> {
    try {
      await api.post('/learning-paths-management', {
        action: 'update-progress',
        learning_path_id: pathId,
        user_id: this.getCurrentUserId(),
        data: progressData
      });
    } catch (error) {
      console.error('Error updating learning path progress:', error);
      throw error;
    }
  }

  /**
   * Get current user ID from auth context or session
   * TODO: Implement proper user ID retrieval from auth context
   */
  private getCurrentUserId(): string {
    // This should be replaced with actual user ID from auth context
    // For now, return a placeholder that should be updated by auth integration
    const userId = localStorage.getItem('userId') || 'current-user-id';
    return userId;
  }
}

export const learningPathsService = new LearningPathsService();
export default learningPathsService;