import { API_BASE_URL } from '../config/api';

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

interface Neo4jResponse {
  success: boolean;
  data?: ThreadGraphData;
  error?: string;
  message?: string;
}

class ThreadGraphService {
  private readonly baseURL = API_BASE_URL;
  private readonly endpoint = '/api/thread';

  /**
   * Fetches thread graph data from Neo4j via API Gateway
   * @param threadId - The ID of the thread to visualize
   * @returns Promise<ThreadGraphData> - Graph data optimized for D3.js
   */
  async getThreadGraph(threadId: string): Promise<ThreadGraphData> {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoint}/${threadId}/graph`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: Neo4jResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch thread graph data');
      }

      return result.data || this.getMockThreadGraph(threadId);
    } catch (error) {
      console.warn('ThreadGraph API error, using mock data:', error);
      return this.getMockThreadGraph(threadId);
    }
  }

  /**
   * Tests the connection to Neo4j database
   * @returns Promise with connection status
   */
  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoint}/connection/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { connected: false, message: `HTTP ${response.status}` };
      }

      const result = await response.json();
      return { connected: result.success, message: result.message || 'Connected' };
    } catch (error) {
      return { connected: false, message: `Connection failed: ${error}` };
    }
  }

  /**
   * Gets list of available thread IDs for testing
   * @returns Promise<string[]> - Array of thread IDs
   */
  async getAvailableThreads(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoint}/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || ['thread-1', 'thread-2', 'thread-3'];
    } catch (error) {
      console.warn('Failed to fetch available threads, using mock data:', error);
      return ['thread-1', 'thread-2', 'thread-3'];
    }
  }

  /**
   * Generates mock thread graph data for development and fallback
   * @param threadId - The thread ID to generate mock data for
   * @returns ThreadGraphData - Mock graph data
   */
  private getMockThreadGraph(threadId: string): ThreadGraphData {
    const mockNodes: ThreadGraphNode[] = [
      { id: 'algebra-basics', name: 'Algebra Basics', subject: 'Math', progress_status: 'completed' },
      { id: 'linear-equations', name: 'Linear Equations', subject: 'Math', progress_status: 'completed' },
      { id: 'physics-motion', name: 'Physics Motion', subject: 'Science', progress_status: 'current' },
      { id: 'velocity-acceleration', name: 'Velocity & Acceleration', subject: 'Science', progress_status: 'upcoming' },
      { id: 'graphing-functions', name: 'Graphing Functions', subject: 'Math', progress_status: 'upcoming' },
      { id: 'scientific-method', name: 'Scientific Method', subject: 'Science', progress_status: 'completed' },
    ];

    const mockEdges: ThreadGraphEdge[] = [
      { source: 'algebra-basics', target: 'linear-equations', relationship_type: 'prerequisite', strength: 0.9 },
      { source: 'linear-equations', target: 'physics-motion', relationship_type: 'bridge', strength: 0.7 },
      { source: 'physics-motion', target: 'velocity-acceleration', relationship_type: 'prerequisite', strength: 0.8 },
      { source: 'linear-equations', target: 'graphing-functions', relationship_type: 'prerequisite', strength: 0.6 },
      { source: 'scientific-method', target: 'physics-motion', relationship_type: 'prerequisite', strength: 0.5 },
      { source: 'graphing-functions', target: 'velocity-acceleration', relationship_type: 'branch', strength: 0.4 },
    ];

    return {
      nodes: mockNodes,
      edges: mockEdges,
      metadata: {
        threadId,
        branchingOpportunities: ['Advanced Calculus', 'Chemistry Applications'],
        crossSubjectBridges: ['Math → Science: Mathematical modeling in physics']
      }
    };
  }
}

export const threadGraphService = new ThreadGraphService();