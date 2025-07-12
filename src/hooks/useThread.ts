import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThreadService } from '../services/thread.service';
import type { Thread, CreateThreadRequest } from '../types/thread.types';
import { useAuth } from '../contexts/AuthContext';

// Create a new thread
export const useCreateThread = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (request: CreateThreadRequest) => ThreadService.createThread(request),
    onSuccess: (data) => {
      // Invalidate user threads cache
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['threads', user.id] });
      }
    },
  });
};

// Get a single thread
export const useThread = (threadId: string) => {
  return useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => ThreadService.getThread(threadId),
    enabled: !!threadId,
  });
};

// Get user's threads with proper data transformation
export const useUserThreads = (userId?: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['threads', userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        // First try to get threads from the threads table
        const threads = await ThreadService.getUserThreads(userId, limit);
        
        // If we get threads with proper structure, return them
        if (threads && threads.length > 0 && threads[0].threadId) {
          return threads;
        }
        
        // If no threads or invalid structure, return empty array
        return [];
      } catch (error) {
        console.error('Error fetching threads:', error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 2,
  });
};

// Delete a thread
export const useDeleteThread = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (threadId: string) => ThreadService.deleteThread(threadId),
    onSuccess: (_, threadId) => {
      // Remove from cache
      queryClient.invalidateQueries({ queryKey: ['thread', threadId] });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['threads', user.id] });
      }
    },
  });
};

// Update a thread
export const useUpdateThread = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ threadId, updates }: { threadId: string; updates: Partial<Thread> }) =>
      ThreadService.updateThread(threadId, updates),
    onSuccess: (data, { threadId }) => {
      // Update cache
      queryClient.setQueryData(['thread', threadId], data);
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['threads', user.id] });
      }
    },
  });
};