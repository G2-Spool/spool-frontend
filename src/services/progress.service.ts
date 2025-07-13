import { API_ENDPOINTS } from '../config/api'
import api from './api'
import { 
  UserProgress, 
  LearningStats, 
  LearningStreak, 
  ProgressUpdateRequest 
} from '../types/backend.types'


// ===== PROGRESS TRACKING =====
export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  try {
    const response = await api.get<UserProgress[]>(`${API_ENDPOINTS.progressTracking}?user_id=${userId}`);
    return response || [];
  } catch (error) {
    console.error('Failed to fetch user progress:', error);
    return [];
  }
}

export async function updateProgress(request: ProgressUpdateRequest): Promise<UserProgress | null> {
  try {
    const response = await api.post<UserProgress>(API_ENDPOINTS.progressTracking, request);
    return response || null;
  } catch (error) {
    console.error('Failed to update progress:', error);
    return null;
  }
}

export async function getLearningStats(userId: string): Promise<LearningStats | null> {
  try {
    const response = await api.get<LearningStats>(`${API_ENDPOINTS.progressTracking}/stats?user_id=${userId}`);
    return response || null;
  } catch (error) {
    console.error('Failed to fetch learning stats:', error);
    return null;
  }
}

export async function getLearningStreak(userId: string): Promise<LearningStreak | null> {
  try {
    const response = await api.get<LearningStreak>(`${API_ENDPOINTS.progressTracking}/streak?user_id=${userId}`);
    return response || null;
  } catch (error) {
    console.error('Failed to fetch learning streak:', error);
    return null;
  }
}