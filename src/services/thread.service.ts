import { api } from './api';
import { supabase } from '../config/supabase';
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
      // First try direct Supabase query
      const { data: thread, error } = await supabase
        .from('threads')
        .select(`
          *,
          concept_content (
            concept_id,
            concept_name,
            hook_content,
            example_scenario,
            approach_steps
          ),
          exercise_attempts (
            id,
            exercise_variation_id,
            is_complete,
            submitted_at
          )
        `)
        .eq('id', threadId)
        .single();

      if (error) {
        console.error('Error querying thread directly:', error);
        
        // Fallback to progress-tracking function
        const response = await api.post<any>('/progress-tracking', {
          action: 'get_thread_progress',
          threadId: threadId,
          studentId: 'current-user' // TODO: Get actual user ID
        });
        
        return this.transformProgressToThread(response.progress);
      }

      return this.transformSupabaseThreadToThread(thread);
    } catch (error) {
      console.error('Error fetching thread:', error);
      throw error;
    }
  }
  
  static async getUserThreads(userId: string, limit: number = 10): Promise<Thread[]> {
    try {
      // Query threads table directly from Supabase
      const { data: threads, error } = await supabase
        .from('threads')
        .select(`
          *,
          concept_content (
            concept_id,
            concept_name,
            hook_content
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error querying threads:', error);
        return [];
      }

      // Transform Supabase threads to our Thread format
      return threads.map(thread => this.transformSupabaseThreadToThread(thread));
    } catch (error) {
      console.error('Error fetching user threads:', error);
      return [];
    }
  }
  
  static async deleteThread(threadId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('threads')
        .delete()
        .eq('id', threadId);

      if (error) {
        console.error('Error deleting thread:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
      throw error;
    }
  }
  
  static async updateThread(threadId: string, updates: Partial<Thread>): Promise<Thread> {
    try {
      // Transform Thread updates to Supabase format
      const supabaseUpdates: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.status) {
        supabaseUpdates.status = updates.status;
      }
      if (updates.analysis?.summary) {
        supabaseUpdates.situation_description = updates.analysis.summary;
      }
      if (updates.sections) {
        supabaseUpdates.concepts = updates.sections.map(section => ({
          id: section.id,
          name: section.title,
          relevance: section.relevanceScore
        }));
      }

      const { data: updatedThread, error } = await supabase
        .from('threads')
        .update(supabaseUpdates)
        .eq('id', threadId)
        .select()
        .single();

      if (error) {
        console.error('Error updating thread:', error);
        throw error;
      }

      return this.transformSupabaseThreadToThread(updatedThread);
    } catch (error) {
      console.error('Error updating thread:', error);
      throw error;
    }
  }
  
  /**
   * Get thread statistics for a user
   */
  static async getUserThreadStats(userId: string): Promise<{
    total: number;
    active: number;
    completed: number;
    totalConcepts: number;
    completedConcepts: number;
    totalTimeSpent: number;
  }> {
    try {
      const { data: threads, error } = await supabase
        .from('threads')
        .select('status, concepts_completed, total_time_spent_seconds, concepts')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching thread stats:', error);
        return {
          total: 0, active: 0, completed: 0,
          totalConcepts: 0, completedConcepts: 0, totalTimeSpent: 0
        };
      }

      const stats = {
        total: threads.length,
        active: threads.filter(t => t.status === 'active').length,
        completed: threads.filter(t => t.status === 'completed').length,
        totalConcepts: threads.reduce((sum, t) => {
          const concepts = Array.isArray(t.concepts) ? t.concepts.length : 0;
          return sum + concepts;
        }, 0),
        completedConcepts: threads.reduce((sum, t) => sum + (t.concepts_completed || 0), 0),
        totalTimeSpent: threads.reduce((sum, t) => sum + (t.total_time_spent_seconds || 0), 0)
      };

      return stats;
    } catch (error) {
      console.error('Error fetching thread stats:', error);
      return {
        total: 0, active: 0, completed: 0,
        totalConcepts: 0, completedConcepts: 0, totalTimeSpent: 0
      };
    }
  }

  // Helper method to transform Supabase thread to our Thread format
  private static transformSupabaseThreadToThread(supabaseThread: any): Thread {
    // Handle both old (student_profile_id) and new (user_id) schema
    const userId = supabaseThread.user_id || supabaseThread.student_profile_id;
    
    // Parse concepts from JSONB or use concept_content relation
    let concepts = [];
    if (supabaseThread.concepts && Array.isArray(supabaseThread.concepts)) {
      concepts = supabaseThread.concepts;
    } else if (supabaseThread.concept_content && Array.isArray(supabaseThread.concept_content)) {
      concepts = supabaseThread.concept_content.map((cc: any) => ({
        concept_id: cc.concept_id,
        concept_name: cc.concept_name,
        relevance: 0.8
      }));
    }

    return {
      threadId: supabaseThread.id,
      userId: userId,
      userInput: supabaseThread.situation_description || supabaseThread.goal || 'Learning Thread',
      analysis: {
        subjects: supabaseThread.academic_relation || [],
        topics: [],
        concepts: concepts.map((c: any) => c.concept_id || c.id),
        summary: supabaseThread.situation_description || supabaseThread.goal || ''
      },
      sections: concepts.map((concept: any, index: number) => ({
        id: concept.concept_id || concept.id || `concept-${index}`,
        title: concept.concept_name || concept.name || `Concept ${index + 1}`,
        text: `Learn about ${concept.concept_name || concept.name}`,
        relevanceScore: concept.relevance || concept.relevance_score || 0.8,
        estimatedMinutes: 10
      })),
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
}