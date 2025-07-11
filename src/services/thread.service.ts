import { api } from './api';
import type { Thread, CreateThreadRequest } from '../types/thread.types';

export class ThreadService {
  static async createThread(request: CreateThreadRequest): Promise<Thread> {
    return await api.post<Thread>('/threads', request);
  }
  
  static async getThread(threadId: string): Promise<Thread> {
    return await api.get<Thread>(`/threads/${threadId}`);
  }
  
  static async getUserThreads(userId: string, limit: number = 10): Promise<Thread[]> {
    const response = await api.get<{ threads: Thread[] }>('/threads', {
      params: { userId, limit }
    });
    return response.threads || [];
  }
  
  static async deleteThread(threadId: string): Promise<void> {
    await api.delete(`/threads/${threadId}`);
  }
  
  static async updateThread(threadId: string, updates: Partial<Thread>): Promise<Thread> {
    return await api.patch<Thread>(`/threads/${threadId}`, updates);
  }
}