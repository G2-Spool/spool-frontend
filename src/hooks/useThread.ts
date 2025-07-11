import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThreadService } from '../services/thread.service';
import type { Thread, CreateThreadRequest } from '../types/thread.types';

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
    queryFn: () => ThreadService.getThread(threadId),
    enabled: !!threadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch user's threads
export const useUserThreads = (userId: string, limit: number = 10) => {
  return useQuery<Thread[]>({
    queryKey: threadKeys.list(userId),
    queryFn: () => ThreadService.getUserThreads(userId, limit),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
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