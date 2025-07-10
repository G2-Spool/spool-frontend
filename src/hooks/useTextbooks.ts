import { useQuery } from '@tanstack/react-query';
import { textbookService } from '../services/textbooks.service';
import type { Textbook } from '../types';

export const useTextbooks = () => {
  return useQuery<Textbook[], Error>({
    queryKey: ['textbooks'],
    queryFn: () => textbookService.getAllTextbooks(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

export const useTextbook = (id: string) => {
  return useQuery<Textbook, Error>({
    queryKey: ['textbook', id],
    queryFn: () => textbookService.getTextbookById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};