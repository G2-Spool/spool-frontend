import { api } from './api';
import type { Thread, CreateThreadRequest } from '../types/thread.types';

export class ThreadService {
  static async createThread(request: CreateThreadRequest): Promise<Thread> {
    // Send the request to create a thread
    const response = await api.post<any>('/api/thread/create', {
      title: request.userInput,
      description: `Thread created from user question: ${request.userInput}`,
      interests: request.interests || [],
      concepts: []
    });
    
    // Transform database response to thread format
    return this.transformDatabaseThreadToThread(response);
  }
  
  static async getThread(threadId: string): Promise<Thread> {
    const response = await api.get<any>(`/api/thread/${threadId}`);
    return this.transformDatabaseThreadToThread(response);
  }
  
  static async getUserThreads(userId: string, limit: number = 10): Promise<Thread[]> {
    try {
      // The Lambda expects studentId in the path
      const response = await api.get<any>(`/api/thread/list/${userId}`, {
        params: { limit }
      });
      
      // Handle the response format from Lambda
      if (response.threads) {
        return response.threads.map((thread: any) => this.transformDatabaseThreadToThread(thread));
      }
      
      // Fallback for old format
      const threads = response.learningPaths || response || [];
      return threads.map((thread: any) => this.transformDatabaseThreadToThread(thread));
    } catch (error) {
      console.error('Error fetching user threads:', error);
      return [];
    }
  }
  
  static async deleteThread(threadId: string): Promise<void> {
    // Update status to deleted
    await api.put(`/api/thread/${threadId}`, { 
      updates: { status: 'deleted' } 
    });
  }
  
  static async updateThread(threadId: string, updates: Partial<Thread>): Promise<Thread> {
    const response = await api.put<any>(`/api/thread/${threadId}`, { updates });
    return this.transformDatabaseThreadToThread(response);
  }
  
  // Helper method to transform database thread data to frontend Thread format
  private static transformDatabaseThreadToThread(dbThread: any): Thread {
    // Handle the actual database structure from threads table
    if (dbThread.id && dbThread.studentId) {
      // Get thread analysis and sections from related tables if available
      const analysis = dbThread.analysis || this.generateAnalysisFromThread(dbThread);
      const sections = dbThread.sections || this.generateSectionsFromThread(dbThread);
      
      return {
        threadId: dbThread.id,
        userId: dbThread.studentId,
        userInput: dbThread.title || 'Untitled Thread',
        analysis: {
          subjects: analysis.subjects || this.extractSubjectsFromTitle(dbThread.title),
          topics: analysis.topics || [],
          concepts: analysis.concepts || dbThread.concepts || [],
          summary: analysis.summary || dbThread.description || `Learning thread: ${dbThread.title}`
        },
        sections: sections,
        createdAt: dbThread.createdAt || dbThread.created_at || new Date().toISOString(),
        updatedAt: dbThread.updatedAt || dbThread.updated_at || new Date().toISOString(),
        status: dbThread.status || 'active'
      };
    }
    
    // Fallback for old learning_paths format
    return {
      threadId: dbThread.id,
      userId: dbThread.studentProfileId || dbThread.student_id,
      userInput: dbThread.userInput || dbThread.title || `Learning ${dbThread.subject || 'General'}`,
      analysis: {
        subjects: [dbThread.subject].filter(Boolean),
        topics: dbThread.currentTopicId ? [dbThread.currentTopicId] : [],
        concepts: dbThread.availableConcepts || dbThread.concepts || [],
        summary: dbThread.description || `Learning path for ${dbThread.subject || 'general topics'}`
      },
      sections: (dbThread.availableConcepts || []).map((conceptId: string, index: number) => ({
        id: conceptId,
        title: `Section ${index + 1}`,
        text: `Content for ${conceptId}`,
        relevanceScore: 0.8,
        estimatedMinutes: 10
      })),
      createdAt: dbThread.startedAt || dbThread.created_at || new Date().toISOString(),
      updatedAt: dbThread.lastAccessedAt || dbThread.updated_at || new Date().toISOString(),
      status: dbThread.status || 'active'
    };
  }
  
  // Helper to extract subjects from thread title
  private static extractSubjectsFromTitle(title: string): string[] {
    if (!title) return ['General Learning'];
    
    const subjectKeywords = {
      'Computer Science': ['programming', 'code', 'software', 'app', 'game', 'computer'],
      'Mathematics': ['math', 'algebra', 'calculus', 'geometry', 'statistics'],
      'Science': ['science', 'physics', 'chemistry', 'biology', 'experiment'],
      'Environmental Science': ['climate', 'environment', 'ecology', 'sustainability'],
      'Data Science': ['data', 'analytics', 'machine learning', 'AI', 'analysis'],
      'Engineering': ['build', 'design', 'create', 'engineer', 'robot'],
      'Psychology': ['brain', 'mind', 'behavior', 'cognitive', 'emotion'],
      'Music': ['music', 'sound', 'audio', 'compose', 'rhythm'],
      'Art': ['art', 'design', 'visual', 'creative', 'UI', 'UX'],
      'Business': ['business', 'finance', 'market', 'economics', 'blockchain']
    };
    
    const titleLower = title.toLowerCase();
    const foundSubjects: string[] = [];
    
    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        foundSubjects.push(subject);
      }
    }
    
    return foundSubjects.length > 0 ? foundSubjects : ['General Learning'];
  }
  
  // Generate analysis from thread data when not available from DB
  private static generateAnalysisFromThread(thread: any) {
    const subjects = this.extractSubjectsFromTitle(thread.title);
    return {
      subjects,
      topics: thread.interests || [],
      concepts: thread.concepts || [],
      summary: thread.description || `Exploring: ${thread.title}`
    };
  }
  
  // Generate sections when not available from DB
  private static generateSectionsFromThread(thread: any) {
    // If we have actual sections from thread_sections table
    if (thread.sections && Array.isArray(thread.sections)) {
      return thread.sections.map((section: any) => ({
        id: section.id || `section-${section.section_number}`,
        title: section.title,
        text: section.text,
        relevanceScore: section.relevance_score || section.relevanceScore || 0.85,
        courseId: section.course_id,
        conceptIds: section.concept_ids || [],
        difficulty: section.difficulty || 'intermediate',
        estimatedMinutes: section.estimated_minutes || section.estimatedMinutes || 5
      }));
    }
    
    // Otherwise, create placeholder sections
    const sectionCount = Math.max(3, (thread.concepts || []).length);
    return Array.from({ length: sectionCount }, (_, index) => ({
      id: `section-${index + 1}`,
      title: `Learning Module ${index + 1}`,
      text: `Content for ${thread.title} - Part ${index + 1}`,
      relevanceScore: 0.85,
      difficulty: index === 0 ? 'beginner' : index < 3 ? 'intermediate' : 'advanced',
      estimatedMinutes: 8 + Math.floor(Math.random() * 5)
    }));
  }
}