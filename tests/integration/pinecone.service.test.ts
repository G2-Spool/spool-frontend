import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PineconeService } from '../../src/services/pinecone/pinecone.service';
import { EmbeddingService } from '../../src/services/embedding/embedding.service';
import { 
  mockCourses, 
  mockLearningPaths, 
  mockConcepts, 
  mockStudentProfile,
  mockSearchResults,
  mockEmbeddings
} from '../fixtures/mockData';

// Mock the Pinecone client
vi.mock('@pinecone-database/pinecone', () => ({
  Pinecone: vi.fn().mockImplementation(() => ({
    index: vi.fn().mockReturnValue({
      namespace: vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ upsertedCount: 1 }),
        query: vi.fn().mockResolvedValue({ matches: [] }),
        fetch: vi.fn().mockResolvedValue({ records: {} }),
      }),
    }),
  })),
}));

// Mock the EmbeddingService
vi.mock('../../src/services/embedding/embedding.service', () => ({
  EmbeddingService: vi.fn().mockImplementation(() => ({
    generateEmbedding: vi.fn().mockResolvedValue(mockEmbeddings.query),
  })),
}));

describe('PineconeService Integration Tests', () => {
  let pineconeService: PineconeService;
  let mockIndex: any;
  let mockNamespace: any;

  beforeEach(() => {
    // Setup mocks
    mockNamespace = {
      upsert: vi.fn().mockResolvedValue({ upsertedCount: 1 }),
      query: vi.fn().mockResolvedValue({ matches: mockSearchResults.courses }),
      fetch: vi.fn().mockResolvedValue({ 
        records: { 
          'course-1': { values: mockEmbeddings.courseText } 
        } 
      }),
    };

    mockIndex = {
      namespace: vi.fn().mockReturnValue(mockNamespace),
    };

    const mockPinecone = {
      index: vi.fn().mockReturnValue(mockIndex),
    };

    vi.mocked(EmbeddingService).mockImplementation(() => ({
      generateEmbedding: vi.fn().mockResolvedValue(mockEmbeddings.query),
    } as any));

    pineconeService = new PineconeService('test-api-key', 'test-index', 'test');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Connection and Initialization', () => {
    it('should initialize with correct parameters', () => {
      expect(pineconeService).toBeDefined();
      expect(mockIndex.namespace).toHaveBeenCalledWith('test');
    });

    it('should handle connection errors gracefully', async () => {
      const errorService = new PineconeService('invalid-key', 'invalid-index');
      
      // Mock connection failure
      mockNamespace.upsert.mockRejectedValue(new Error('Connection failed'));

      await expect(
        errorService.upsertCourse(mockCourses[0])
      ).rejects.toThrow('Connection failed');
    });
  });

  describe('Course Operations', () => {
    it('should upsert a course successfully', async () => {
      const course = mockCourses[0];
      
      await pineconeService.upsertCourse(course);

      expect(mockNamespace.upsert).toHaveBeenCalledWith([
        expect.objectContaining({
          id: course.id,
          values: mockEmbeddings.query,
          metadata: expect.objectContaining({
            title: course.title,
            description: course.description,
            category: course.category,
            difficulty: course.difficulty,
          }),
        }),
      ]);
    });

    it('should search courses with vector similarity', async () => {
      const query = 'JavaScript programming';
      const results = await pineconeService.searchCourses(query);

      expect(mockNamespace.query).toHaveBeenCalledWith({
        vector: mockEmbeddings.query,
        topK: 20,
        filter: {},
        includeMetadata: true,
      });

      expect(results).toEqual(mockSearchResults.courses);
    });

    it('should search courses with filters', async () => {
      const query = 'React development';
      const filters = {
        category: ['Programming'],
        difficulty: ['Intermediate'],
        estimatedHours: { min: 10, max: 20 },
      };

      await pineconeService.searchCourses(query, filters);

      expect(mockNamespace.query).toHaveBeenCalledWith({
        vector: mockEmbeddings.query,
        topK: 20,
        filter: {
          category: { $in: ['Programming'] },
          difficulty: { $in: ['Intermediate'] },
          estimatedHours: { $gte: 10, $lte: 20 },
        },
        includeMetadata: true,
      });
    });

    it('should get related courses', async () => {
      const courseId = 'course-1';
      const results = await pineconeService.getRelatedCourses(courseId);

      expect(mockNamespace.fetch).toHaveBeenCalledWith([courseId]);
      expect(mockNamespace.query).toHaveBeenCalledWith({
        vector: mockEmbeddings.courseText,
        topK: 6, // limit + 1
        filter: { id: { $ne: courseId } },
        includeMetadata: true,
      });
    });

    it('should handle empty related courses', async () => {
      mockNamespace.fetch.mockResolvedValue({ records: {} });

      const results = await pineconeService.getRelatedCourses('nonexistent-course');

      expect(results).toEqual([]);
    });

    it('should batch upsert courses', async () => {
      const courses = mockCourses.slice(0, 2);
      
      await pineconeService.batchUpsertCourses(courses);

      expect(mockNamespace.upsert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: courses[0].id }),
          expect.objectContaining({ id: courses[1].id }),
        ])
      );
    });
  });

  describe('Learning Path Operations', () => {
    it('should upsert a learning path successfully', async () => {
      const path = mockLearningPaths[0];
      
      await pineconeService.upsertLearningPath(path);

      expect(mockNamespace.upsert).toHaveBeenCalledWith([
        expect.objectContaining({
          id: `path_${path.id}`,
          values: mockEmbeddings.query,
          metadata: expect.objectContaining({
            title: path.title,
            description: path.description,
            category: path.category,
            courseIds: path.courseIds,
          }),
        }),
      ]);
    });

    it('should search learning paths with prefix filter', async () => {
      mockNamespace.query.mockResolvedValue({ matches: mockSearchResults.paths });

      const query = 'web development';
      const results = await pineconeService.searchPaths(query);

      expect(mockNamespace.query).toHaveBeenCalledWith({
        vector: mockEmbeddings.query,
        topK: 20,
        filter: { id: { $regex: '^path_' } },
        includeMetadata: true,
      });

      expect(results).toEqual(mockSearchResults.paths);
    });
  });

  describe('Concept Operations', () => {
    it('should upsert a concept successfully', async () => {
      const concept = mockConcepts[0];
      
      await pineconeService.upsertConcept(concept);

      expect(mockNamespace.upsert).toHaveBeenCalledWith([
        expect.objectContaining({
          id: `concept_${concept.id}`,
          values: mockEmbeddings.query,
          metadata: expect.objectContaining({
            title: concept.name,
            description: concept.description,
            sectionId: concept.sectionId,
            courseId: concept.courseId,
          }),
        }),
      ]);
    });

    it('should search concepts with prefix filter', async () => {
      mockNamespace.query.mockResolvedValue({ matches: mockSearchResults.concepts });

      const query = 'JavaScript variables';
      const results = await pineconeService.searchConcepts(query);

      expect(mockNamespace.query).toHaveBeenCalledWith({
        vector: mockEmbeddings.query,
        topK: 20,
        filter: { id: { $regex: '^concept_' } },
        includeMetadata: true,
      });

      expect(results).toEqual(mockSearchResults.concepts);
    });
  });

  describe('Personalized Recommendations', () => {
    it('should generate personalized recommendations', async () => {
      const recommendations = await pineconeService.getPersonalizedRecommendations(
        mockStudentProfile
      );

      expect(mockNamespace.query).toHaveBeenCalledWith({
        vector: mockEmbeddings.query,
        topK: 10,
        filter: {
          category: { $in: ['Academic', 'Creative', 'Personal', 'Social', 'Physical'] },
          difficulty: { $in: ['Beginner', 'Intermediate'] },
        },
        includeMetadata: true,
      });
    });

    it('should handle empty student profile', async () => {
      const emptyProfile = { ...mockStudentProfile, interests: [] };
      
      await pineconeService.getPersonalizedRecommendations(emptyProfile);

      expect(mockNamespace.query).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle embedding generation errors', async () => {
      const embeddingService = new EmbeddingService();
      vi.mocked(embeddingService.generateEmbedding).mockRejectedValue(
        new Error('Embedding failed')
      );

      await expect(
        pineconeService.upsertCourse(mockCourses[0])
      ).rejects.toThrow('Embedding failed');
    });

    it('should handle Pinecone upsert errors', async () => {
      mockNamespace.upsert.mockRejectedValue(new Error('Upsert failed'));

      await expect(
        pineconeService.upsertCourse(mockCourses[0])
      ).rejects.toThrow('Upsert failed');
    });

    it('should handle Pinecone query errors', async () => {
      mockNamespace.query.mockRejectedValue(new Error('Query failed'));

      await expect(
        pineconeService.searchCourses('test query')
      ).rejects.toThrow('Query failed');
    });

    it('should handle malformed search results', async () => {
      mockNamespace.query.mockResolvedValue({ matches: null });

      const results = await pineconeService.searchCourses('test query');

      expect(results).toEqual([]);
    });
  });

  describe('Helper Methods', () => {
    it('should prepare course text correctly', () => {
      const course = mockCourses[0];
      const expectedText = `${course.title}. ${course.description}. Category: ${course.category}. Difficulty: ${course.difficulty}.`;
      
      // Test through upsert to verify text preparation
      pineconeService.upsertCourse(course);
      
      expect(mockNamespace.upsert).toHaveBeenCalledWith([
        expect.objectContaining({
          metadata: expect.objectContaining({
            searchableText: expectedText,
          }),
        }),
      ]);
    });

    it('should extract keywords correctly', () => {
      const course = mockCourses[0];
      
      pineconeService.upsertCourse(course);
      
      expect(mockNamespace.upsert).toHaveBeenCalledWith([
        expect.objectContaining({
          metadata: expect.objectContaining({
            keywords: expect.arrayContaining([
              expect.stringMatching(/javascript|programming|introduction/i),
            ]),
          }),
        }),
      ]);
    });

    it('should build filters correctly', async () => {
      const filters = {
        category: ['Programming'],
        difficulty: ['Beginner'],
        estimatedHours: { min: 5, max: 15 },
        points: { min: 50, max: 150 },
        keywords: ['javascript'],
      };

      await pineconeService.searchCourses('test', filters);

      expect(mockNamespace.query).toHaveBeenCalledWith({
        vector: mockEmbeddings.query,
        topK: 20,
        filter: {
          category: { $in: ['Programming'] },
          difficulty: { $in: ['Beginner'] },
          estimatedHours: { $gte: 5, $lte: 15 },
          points: { $gte: 50, $lte: 150 },
          keywords: { $in: ['javascript'] },
        },
        includeMetadata: true,
      });
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large batch operations', async () => {
      const largeBatch = new Array(250).fill(null).map((_, i) => ({
        ...mockCourses[0],
        id: `course-${i}`,
      }));

      await pineconeService.batchUpsertCourses(largeBatch);

      // Should batch in chunks of 100
      expect(mockNamespace.upsert).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent operations', async () => {
      const promises = [
        pineconeService.searchCourses('JavaScript'),
        pineconeService.searchPaths('web development'),
        pineconeService.searchConcepts('variables'),
      ];

      await Promise.all(promises);

      expect(mockNamespace.query).toHaveBeenCalledTimes(3);
    });
  });
});