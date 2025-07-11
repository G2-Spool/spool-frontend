import { api } from './api';
import type { Thread, CreateThreadRequest } from '../types/thread.types';

export class ThreadService {
  static async createThread(request: CreateThreadRequest): Promise<Thread> {
    // The Lambda expects a different structure
    const learningPath = {
      subject: 'General Learning', // Default subject
      userInput: request.userInput,
      // Add other required fields for learning_paths table
    };
    
    const response = await api.post<any>('/api/thread/create', { learningPath });
    
    // Transform learning path response to thread format
    return this.transformLearningPathToThread(response);
  }
  
  static async getThread(threadId: string): Promise<Thread> {
    const response = await api.get<any>(`/api/thread/${threadId}`);
    return this.transformLearningPathToThread(response);
  }
  
  static async getUserThreads(userId: string, limit: number = 10): Promise<Thread[]> {
    // The Lambda expects studentId in the path
    const response = await api.get<any>(`/api/thread/list/${userId}`, {
      params: { limit }
    });
    
    // Transform learning paths to threads
    const learningPaths = response.learningPaths || [];
    return learningPaths.map((lp: any) => this.transformLearningPathToThread(lp));
  }
  
  static async deleteThread(threadId: string): Promise<void> {
    // Lambda doesn't have delete endpoint, use update to set status
    await api.put(`/api/thread/${threadId}`, { 
      updates: { status: 'deleted' } 
    });
  }
  
  static async updateThread(threadId: string, updates: Partial<Thread>): Promise<Thread> {
    const response = await api.put<any>(`/api/thread/${threadId}`, { updates });
    return this.transformLearningPathToThread(response);
  }
  
  // Helper method to transform learning_paths data to Thread format
  private static transformLearningPathToThread(learningPath: any): Thread {
    return {
      threadId: learningPath.id,
      userId: learningPath.studentProfileId,
      userInput: learningPath.userInput || `Learning ${learningPath.subject}`,
      analysis: {
        subjects: [learningPath.subject],
        topics: learningPath.currentTopicId ? [learningPath.currentTopicId] : [],
        concepts: learningPath.availableConcepts || [],
        summary: `Learning path for ${learningPath.subject}`
      },
      sections: (learningPath.availableConcepts || []).map((conceptId: string, index: number) => ({
        id: conceptId,
        title: `Section ${index + 1}`,
        text: `Content for ${conceptId}`,
        relevanceScore: 0.8,
        estimatedMinutes: 10
      })),
      createdAt: learningPath.startedAt || new Date().toISOString(),
      updatedAt: learningPath.lastAccessedAt || new Date().toISOString(),
      status: learningPath.status || 'active'
    };
  }
}