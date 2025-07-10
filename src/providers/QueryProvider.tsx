import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a custom query client with optimized caching and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry mutations on network errors
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Global error handler
queryClient.setMutationDefaults(['enrollCourse'], {
  mutationFn: async ({ courseId }: { courseId: string }) => {
    // This will be overridden by the actual mutation
    throw new Error('Mutation not implemented');
  },
  onError: (error: any) => {
    // Log errors to monitoring service
    console.error('Course enrollment error:', error);
    
    // Show user-friendly error message
    const message = error?.response?.data?.message || 'Failed to enroll in course';
    // You can integrate with a toast notification system here
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
};

// Export the query client for use in other parts of the app
export { queryClient };