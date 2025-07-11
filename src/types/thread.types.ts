export interface ThreadSection {
  id: string;
  title: string;
  text: string;
  relevanceScore: number;
  courseId?: string;
  conceptIds?: string[];
  difficulty?: string;
  estimatedMinutes?: number;
}

export interface ThreadAnalysis {
  subjects: string[];
  topics: string[];
  concepts: string[];
  summary: string;
}

export interface Thread {
  threadId: string;
  userId: string;
  userInput: string;
  analysis: ThreadAnalysis;
  sections: ThreadSection[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'deleted';
}

export interface CreateThreadRequest {
  userInput: string;
  userId?: string;
}

export interface ThreadListResponse {
  threads: Thread[];
  nextToken?: string;
  total?: number;
}