import { useQuery } from '@tanstack/react-query';
import { traditionalThreadsService, type TraditionalThread } from '../services/traditionalThreads.service';

export const useTraditionalThreads = () => {
  return useQuery<TraditionalThread[], Error>({
    queryKey: ['traditionalThreads'],
    queryFn: () => traditionalThreadsService.getAllTraditionalThreads(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

export const useTraditionalThreadById = (bookId: string) => {
  return useQuery<TraditionalThread | null, Error>({
    queryKey: ['traditionalThread', bookId],
    queryFn: () => traditionalThreadsService.getTraditionalThreadById(bookId),
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useTraditionalThreadsBySubject = (subject: string) => {
  return useQuery<TraditionalThread[], Error>({
    queryKey: ['traditionalThreads', 'subject', subject],
    queryFn: () => traditionalThreadsService.getTraditionalThreadsBySubject(subject),
    enabled: !!subject,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};