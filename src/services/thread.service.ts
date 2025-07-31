import { api } from './api';
import type { Thread, CreateThreadRequest } from '../types/thread.types';

export class ThreadService {
  static async createThread(request: CreateThreadRequest): Promise<Thread> {
    try {
      // First, use thread-discovery to create a proposal
      const proposalResponse = await api.post<any>('/thread-discovery', {
        conversation: request.userInput,
        studentId: request.userId
      });
      
      // Then, use thread-generation to create the full thread
      const threadResponse = await api.post<any>('/thread-generation', {
        proposal: proposalResponse.proposal,
        studentProfileId: request.userId
      });
      
      // Transform the response to our Thread format
      return this.transformSupabaseThreadToThread(threadResponse.thread);
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  }
  
  static async getThread(threadId: string): Promise<Thread> {
    try {
      // Get thread progress from progress-tracking function
      const response = await api.post<any>('/progress-tracking', {
        action: 'get_thread_progress',
        threadId: threadId,
        studentId: 'current-user' // TODO: Get actual user ID
      });
      
      return this.transformProgressToThread(response.progress);
    } catch (error) {
      console.error('Error fetching thread:', error);
      throw error;
    }
  }
  
  static async getUserThreads(userId: string, limit: number = 10): Promise<Thread[]> {
    try {
      // For now, return empty array as there's no direct endpoint for user threads
      // TODO: Implement proper thread listing from Supabase
      console.warn('User threads endpoint not implemented');
      return [];
    } catch (error) {
      console.error('Error fetching user threads:', error);
      return [];
    }
  }
  
  static async deleteThread(threadId: string): Promise<void> {
    // TODO: Implement thread deletion using Supabase
    console.warn('Thread deletion not implemented');
  }
  
  static async updateThread(threadId: string, updates: Partial<Thread>): Promise<Thread> {
    // TODO: Implement thread updates using Supabase
    console.warn('Thread updates not implemented');
    throw new Error('Thread updates not implemented');
  }
  
  // Helper method to transform Supabase thread to our Thread format
  private static transformSupabaseThreadToThread(supabaseThread: any): Thread {
    return {
      threadId: supabaseThread.id,
      userId: supabaseThread.student_profile_id,
      userInput: supabaseThread.goal || 'Learning Thread',
      analysis: {
        subjects: supabaseThread.subjects_covered || [],
        topics: [],
        concepts: supabaseThread.concepts?.map((c: any) => c.concept_id) || [],
        summary: supabaseThread.goal || ''
      },
      sections: supabaseThread.concepts?.map((concept: any) => ({
        id: concept.concept_id,
        title: concept.concept_name,
        text: `Learn about ${concept.concept_name}`,
        relevanceScore: concept.relevance_score || 0.8,
        estimatedMinutes: 10
      })) || [],
      createdAt: supabaseThread.created_at || new Date().toISOString(),
      updatedAt: supabaseThread.updated_at || new Date().toISOString(),
      status: supabaseThread.status || 'active'
    };
  }
  
  // Helper method to transform progress data to Thread format
  private static transformProgressToThread(progress: any): Thread {
    const thread = progress.thread;
    return {
      threadId: thread.id,
      userId: 'current-user', // TODO: Get actual user ID
      userInput: thread.goal || 'Learning Thread',
      analysis: {
        subjects: progress.metrics.subjects_covered || [],
        topics: [],
        concepts: progress.concept_details?.map((c: any) => c.id) || [],
        summary: thread.goal || ''
      },
      sections: progress.concept_details?.map((concept: any) => ({
        id: concept.id,
        title: concept.name,
        text: `Learn about ${concept.name}`,
        relevanceScore: concept.relevance_score || 0.8,
        estimatedMinutes: 10
      })) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: thread.status || 'active'
    };
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