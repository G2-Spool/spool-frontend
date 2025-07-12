import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import type { Textbook } from '../types';
import api from './api';
import { fetchAuthSession } from 'aws-amplify/auth';

export interface TraditionalThread {
  id: string;
  bookId: string;
  bookTitle: string;
  subject: string;
  gradeLevel: string;
  description: string;
  coverImageUrl?: string;
  chapterCount: number;
  estimatedHours: number;
  isTraditional: true; // Flag to distinguish from user-created threads
}

export class TraditionalThreadsService {
  /**
   * Fetch all textbooks from Neo4j and transform them into TraditionalThread format
   */
  async getAllTraditionalThreads(): Promise<TraditionalThread[]> {
    try {
      // First try to fetch from Neo4j via our new Lambda
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      
      const response = await fetch(`${API_BASE_URL}/api/neo4j/books`, {
        headers: {
          'Authorization': idToken ? `Bearer ${idToken}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const books: Textbook[] = await response.json();
        return this.transformBooksToThreads(books);
      }
    } catch (error) {
      console.error('Failed to fetch from Neo4j, falling back to content service:', error);
    }

    // Fallback to existing content service
    const books = await api.get<Textbook[]>(API_ENDPOINTS.textbooks.all);
    return this.transformBooksToThreads(books);
  }

  /**
   * Get a specific traditional thread by book ID
   */
  async getTraditionalThreadById(bookId: string): Promise<TraditionalThread | null> {
    try {
      // First try Neo4j
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      
      const response = await fetch(`${API_BASE_URL}/api/neo4j/books/${bookId}`, {
        headers: {
          'Authorization': idToken ? `Bearer ${idToken}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const book: Textbook = await response.json();
        return this.transformBookToThread(book);
      }
    } catch (error) {
      console.error('Failed to fetch from Neo4j, falling back to content service:', error);
    }

    // Fallback to existing content service
    const url = API_ENDPOINTS.textbooks.byId.replace(':id', bookId);
    const book = await api.get<Textbook>(url);
    return this.transformBookToThread(book);
  }

  /**
   * Get traditional threads by subject
   */
  async getTraditionalThreadsBySubject(subject: string): Promise<TraditionalThread[]> {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      
      const response = await fetch(`${API_BASE_URL}/api/neo4j/books?subject=${encodeURIComponent(subject)}`, {
        headers: {
          'Authorization': idToken ? `Bearer ${idToken}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const books: Textbook[] = await response.json();
        return this.transformBooksToThreads(books);
      }
    } catch (error) {
      console.error('Failed to fetch by subject from Neo4j:', error);
    }

    // Fallback: get all and filter
    const allThreads = await this.getAllTraditionalThreads();
    return allThreads.filter(thread => thread.subject.toLowerCase() === subject.toLowerCase());
  }

  /**
   * Transform a textbook into a traditional thread format
   */
  private transformBookToThread(book: Textbook): TraditionalThread {
    return {
      id: `traditional_${book.id}`,
      bookId: book.id,
      bookTitle: book.title,
      subject: book.subject,
      gradeLevel: book.gradeLevel,
      description: book.description || `Complete ${book.subject} curriculum for Grade ${book.gradeLevel}`,
      coverImageUrl: book.coverImageUrl,
      chapterCount: book.totalChapters,
      estimatedHours: book.estimatedHours,
      isTraditional: true
    };
  }

  /**
   * Transform multiple textbooks into traditional threads
   */
  private transformBooksToThreads(books: Textbook[]): TraditionalThread[] {
    return books.map(book => this.transformBookToThread(book));
  }
}

export const traditionalThreadsService = new TraditionalThreadsService();