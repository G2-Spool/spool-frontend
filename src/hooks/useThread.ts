import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThreadService } from '../services/thread.service';
import type { Thread, CreateThreadRequest } from '../types/thread.types';
import { EXAMPLE_THREAD } from '../data/exampleThread';
import { EXAMPLE_THREAD_002, isExampleThread } from '../data/exampleThread002';

// Query keys
export const threadKeys = {
  all: ['threads'] as const,
  lists: () => [...threadKeys.all, 'list'] as const,
  list: (userId?: string) => [...threadKeys.lists(), { userId }] as const,
  details: () => [...threadKeys.all, 'detail'] as const,
  detail: (id: string) => [...threadKeys.details(), id] as const,
};

// Fetch single thread by ID
export const useThread = (threadId: string) => {
  return useQuery<Thread>({
    queryKey: threadKeys.detail(threadId),
    queryFn: async () => {
      // Return example thread if it's an example thread ID
      if (isExampleThread(threadId)) {
        if (threadId === 'example-thread-001') {
          return Promise.resolve(EXAMPLE_THREAD);
        }
        if (threadId === 'blackjack-probability-guide' || threadId === 'd6046803-eece-42ba-9cbb-ab2eebd9c683') {
          return Promise.resolve(EXAMPLE_THREAD_002);
        }
        // Default to first example thread for unknown example IDs
        return Promise.resolve(EXAMPLE_THREAD);
      }
      try {
        return await ThreadService.getThread(threadId);
      } catch (error) {
        // If API fails and it's the example thread, return it
        if (threadId === 'example-thread-001') {
          console.warn('Failed to fetch from API, using local example thread');
          return EXAMPLE_THREAD;
        }
        if (threadId === 'blackjack-probability-guide' || threadId === 'd6046803-eece-42ba-9cbb-ab2eebd9c683') {
          console.warn('Failed to fetch from API, using local blackjack probability guide');
          return EXAMPLE_THREAD_002;
        }
        throw error;
      }
    },
    enabled: !!threadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry for 404s
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    }
  });
};

// Fetch user's threads
export const useUserThreads = (userId: string, limit: number = 10) => {
  return useQuery<Thread[]>({
    queryKey: threadKeys.list(userId),
    queryFn: async () => {
      try {
        const threads = await ThreadService.getUserThreads(userId, limit);
        // Always include example threads at the beginning
        const allThreads = [EXAMPLE_THREAD, EXAMPLE_THREAD_002, ...threads];
        // Remove duplicates based on threadId
        const uniqueThreads = allThreads.filter((thread, index, self) =>
          index === self.findIndex((t) => t.threadId === thread.threadId)
        );
        return uniqueThreads;
      } catch (error: any) {
        // If API fails, still return example threads
        console.warn('Failed to fetch user threads, showing examples only:', error);
        // Check if it's an auth error
        if (error?.response?.status === 401) {
          console.info('Authentication required for thread API');
        }
        return [EXAMPLE_THREAD, EXAMPLE_THREAD_002];
      }
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry for auth errors
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    }
  });
};

// Create new thread
export const useCreateThread = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Thread, Error, CreateThreadRequest>({
    mutationFn: (request) => ThreadService.createThread(request),
    onSuccess: (thread) => {
      // Invalidate user threads list to show new thread
      queryClient.invalidateQueries({ 
        queryKey: threadKeys.list(thread.userId) 
      });
      
      // Prefetch the new thread detail
      queryClient.setQueryData(
        threadKeys.detail(thread.threadId),
        thread
      );
    },
  });
};

// Delete thread
export const useDeleteThread = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { threadId: string; userId: string }>({
    mutationFn: ({ threadId }) => ThreadService.deleteThread(threadId),
    onSuccess: (_, { threadId, userId }) => {
      // Remove from cache
      queryClient.removeQueries({ 
        queryKey: threadKeys.detail(threadId) 
      });
      
      // Invalidate user threads list
      queryClient.invalidateQueries({ 
        queryKey: threadKeys.list(userId) 
      });
    },
  });
};