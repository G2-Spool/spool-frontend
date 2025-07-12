import { useQuery } from '@tanstack/react-query';
import { threadGraphService } from '@/services/threadGraph.service';

interface ThreadGraphNode {
  id: string;
  name: string;
  subject: string;
  progress_status: 'completed' | 'current' | 'upcoming';
}

interface ThreadGraphEdge {
  source: string;
  target: string;
  relationship_type: 'prerequisite' | 'bridge' | 'branch';
  strength: number;
}

interface ThreadGraphData {
  nodes: ThreadGraphNode[];
  edges: ThreadGraphEdge[];
  metadata: {
    threadId: string;
    branchingOpportunities: string[];
    crossSubjectBridges: string[];
  };
}

/**
 * Hook for fetching and managing thread graph data from Neo4j
 * @param threadId - The ID of the thread to visualize
 * @param enabled - Whether the query should be enabled (for conditional fetching)
 * @returns Thread graph data optimized for D3.js visualization
 */
export const useThreadGraphD3 = (threadId: string, enabled: boolean = true) => {
  return useQuery<ThreadGraphData, Error>({
    queryKey: ['threadGraph', threadId],
    queryFn: () => threadGraphService.getThreadGraph(threadId),
    enabled: enabled && !!threadId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for testing Neo4j connection
 * @returns Connection test results
 */
export const useThreadGraphConnection = () => {
  return useQuery({
    queryKey: ['threadGraphConnection'],
    queryFn: () => threadGraphService.testConnection(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for getting available thread IDs for testing
 * @returns List of available thread IDs
 */
export const useAvailableThreads = () => {
  return useQuery({
    queryKey: ['availableThreads'],
    queryFn: () => threadGraphService.getAvailableThreads(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};