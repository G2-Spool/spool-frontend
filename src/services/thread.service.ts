import { api } from './api';
import type { Thread, CreateThreadRequest } from '../types/thread.types';

export class ThreadService {
  static async createThread(request: CreateThreadRequest): Promise<Thread> {
    const response = await api.post('/threads', request);
    return response.data;
  }
  
  static async getThread(threadId: string): Promise<Thread> {
    const response = await api.get(`/threads/${threadId}`);
    return response.data;
  }
  
  static async getUserThreads(userId: string, limit: number = 10): Promise<Thread[]> {
    const response = await api.get('/threads', {
      params: { userId, limit }
    });
    return response.data.threads || [];
  }
  
  static async deleteThread(threadId: string): Promise<void> {
    await api.delete(`/threads/${threadId}`);
  }
  
  static async updateThread(threadId: string, updates: Partial<Thread>): Promise<Thread> {
    const response = await api.patch(`/threads/${threadId}`, updates);
    return response.data;
  }
}