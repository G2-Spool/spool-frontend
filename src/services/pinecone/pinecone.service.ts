import { Pinecone } from '@pinecone-database/pinecone';
import type { 
  CourseVector, 
  LearningPathVector, 
  ConceptVector,
  FilterMetadata,
  CourseSearchResult,
  PathSearchResult,
  ConceptSearchResult,
  PineconeSearchResponse
} from './types';
import { EmbeddingService } from '../embedding/embedding.service';
import type { Course, LearningPath, Concept, StudentProfile, LifeCategory } from '../../types';

// Extended types for Pinecone operations to handle missing properties
interface ExtendedLearningPath extends Partial<LearningPath> {
  title?: string;
  description?: string;
  category?: string;
  courseIds?: string[];
  sectionIds?: string[];
  conceptIds?: string[];
  totalConcepts?: number;
  estimatedHours?: number;
  points?: number;
  prerequisitePathIds?: string[];
  requiredSkillLevel?: string;
  createdAt?: Date;
  updatedAt?: Date;
  targetAgeGroup?: string;
}

interface ExtendedConcept extends Concept {
  courseId?: string;
  pathId?: string;
  componentTypes?: string[];
  exerciseTypes?: string[];
  prerequisiteConceptIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  interestTags?: string[];
}

export class PineconeService {
  private pinecone: Pinecone;
  private index: any;
  private embedder: EmbeddingService;
  private namespace: string;

  constructor(
    apiKey: string,
    indexName: string = 'spool-textbook-embeddings',
    namespace: string = 'production'
  ) {
    this.pinecone = new Pinecone({
      apiKey,
    });
    this.index = this.pinecone.index(indexName);
    this.embedder = new EmbeddingService();
    this.namespace = namespace;
  }

  // Core operations - Courses
  async upsertCourse(course: Course): Promise<void> {
    const embedding = await this.embedder.generateEmbedding(
      this.prepareCourseText(course)
    );

    const vector: CourseVector = {
      id: course.id,
      values: embedding,
      metadata: {
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
        estimatedHours: course.estimatedHours,
        points: course.points,
        totalSections: course.totalSections,
        totalConcepts: course.totalConcepts,
        enrolledStudents: course.students || 0,
        averageRating: course.averageRating,
        completionRate: course.completionRate,
        createdAt: new Date(course.createdAt || Date.now()).getTime(),
        updatedAt: new Date(course.updatedAt || Date.now()).getTime(),
        searchableText: this.prepareCourseText(course),
        keywords: this.extractKeywords(course),
      },
    };

    await this.index.namespace(this.namespace).upsert([vector]);
  }

  // Core operations - Learning Paths
  async upsertLearningPath(path: ExtendedLearningPath): Promise<void> {
    const embedding = await this.embedder.generateEmbedding(
      this.preparePathText(path)
    );

    const vector: LearningPathVector = {
      id: `path_${path.id}`,
      values: embedding,
      metadata: {
        title: path.title || '',
        description: path.description || '',
        category: (path.category || 'personal') as LifeCategory,
        courseIds: path.courseIds || [],
        sectionIds: path.sectionIds || [],
        conceptIds: path.conceptIds || [],
        totalConcepts: path.totalConcepts || 0,
        estimatedHours: path.estimatedHours || 0,
        points: path.points || 0,
        prerequisitePathIds: path.prerequisitePathIds,
        requiredSkillLevel: path.requiredSkillLevel,
        createdAt: new Date(path.createdAt || Date.now()).getTime(),
        updatedAt: new Date(path.updatedAt || Date.now()).getTime(),
        searchableText: this.preparePathText(path),
        keywords: this.extractKeywords(path),
        targetAgeGroup: path.targetAgeGroup,
      },
    };

    await this.index.namespace(this.namespace).upsert([vector]);
  }

  // Core operations - Concepts
  async upsertConcept(concept: ExtendedConcept): Promise<void> {
    const embedding = await this.embedder.generateEmbedding(
      this.prepareConceptText(concept)
    );

    const vector: ConceptVector = {
      id: `concept_${concept.id}`,
      values: embedding,
      metadata: {
        title: concept.name,
        description: concept.description,
        sectionId: concept.sectionId,
        courseId: concept.courseId || '',
        pathId: concept.pathId || '',
        componentTypes: (concept as any).componentTypes || concept.contentTypes || [],
        exerciseTypes: (concept as any).exerciseTypes || [],
        contentDuration: concept.estimatedMinutes,
        difficulty: concept.difficultyLevel,
        keyVocabulary: concept.keyVocabulary,
        learningObjectives: concept.learningObjectives,
        prerequisiteConceptIds: (concept as any).prerequisiteConceptIds || [],
        createdAt: new Date(concept.createdAt || Date.now()).getTime(),
        updatedAt: new Date(concept.updatedAt || Date.now()).getTime(),
        searchableText: this.prepareConceptText(concept),
        keywords: this.extractKeywords(concept),
        interestTags: (concept as any).interestTags || [],
      },
    };

    await this.index.namespace(this.namespace).upsert([vector]);
  }

  // Search operations
  async searchCourses(
    query: string, 
    filters?: FilterMetadata,
    limit: number = 20
  ): Promise<CourseSearchResult[]> {
    const queryEmbedding = await this.embedder.generateEmbedding(query);
    
    const filter = this.buildFilter(filters);
    
    const response: PineconeSearchResponse<CourseSearchResult> = await this.index
      .namespace(this.namespace)
      .query({
        vector: queryEmbedding,
        topK: limit,
        filter,
        includeMetadata: true,
      });

    return response.matches || [];
  }

  async searchPaths(
    query: string,
    filters?: FilterMetadata,
    limit: number = 20
  ): Promise<PathSearchResult[]> {
    const queryEmbedding = await this.embedder.generateEmbedding(query);
    
    const filter = this.buildFilter(filters, 'path_');
    
    const response: PineconeSearchResponse<PathSearchResult> = await this.index
      .namespace(this.namespace)
      .query({
        vector: queryEmbedding,
        topK: limit,
        filter,
        includeMetadata: true,
      });

    return response.matches || [];
  }

  async searchConcepts(
    query: string,
    filters?: FilterMetadata,
    limit: number = 20
  ): Promise<ConceptSearchResult[]> {
    const queryEmbedding = await this.embedder.generateEmbedding(query);
    
    const filter = this.buildFilter(filters, 'concept_');
    
    const response: PineconeSearchResponse<ConceptSearchResult> = await this.index
      .namespace(this.namespace)
      .query({
        vector: queryEmbedding,
        topK: limit,
        filter,
        includeMetadata: true,
      });

    return response.matches || [];
  }

  // Recommendation operations
  async getRelatedCourses(courseId: string, limit: number = 5): Promise<CourseSearchResult[]> {
    // First, fetch the course vector
    const courseResponse = await this.index
      .namespace(this.namespace)
      .fetch([courseId]);
    
    if (!courseResponse.records || !courseResponse.records[courseId]) {
      return [];
    }

    const courseVector = courseResponse.records[courseId].values;
    
    // Find similar courses
    const response: PineconeSearchResponse<CourseSearchResult> = await this.index
      .namespace(this.namespace)
      .query({
        vector: courseVector,
        topK: limit + 1, // Include self
        filter: {
          id: { $ne: courseId }, // Exclude self
        },
        includeMetadata: true,
      });

    return response.matches || [];
  }

  async getPersonalizedRecommendations(
    studentProfile: StudentProfile,
    limit: number = 10
  ): Promise<CourseSearchResult[]> {
    // Create a personalized query based on student interests
    const personalizedQuery = this.buildPersonalizedQuery(studentProfile);
    const queryEmbedding = await this.embedder.generateEmbedding(personalizedQuery);
    
    // Build filters based on student preferences
    const filter = {
      category: { $in: this.getPreferredCategories(studentProfile) },
      difficulty: { $in: this.getAppropiateDifficulties(studentProfile) },
    };
    
    const response: PineconeSearchResponse<CourseSearchResult> = await this.index
      .namespace(this.namespace)
      .query({
        vector: queryEmbedding,
        topK: limit,
        filter,
        includeMetadata: true,
      });

    return response.matches || [];
  }

  // Batch operations
  async batchUpsertCourses(courses: Course[]): Promise<void> {
    const batchSize = 100;
    
    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      const vectors = await Promise.all(
        batch.map(async (course) => {
          const embedding = await this.embedder.generateEmbedding(
            this.prepareCourseText(course)
          );
          
          return {
            id: course.id,
            values: embedding,
            metadata: {
              title: course.title,
              description: course.description,
              category: course.category,
              difficulty: course.difficulty,
              estimatedHours: course.estimatedHours,
              points: course.points,
              totalSections: course.totalSections,
              totalConcepts: course.totalConcepts,
              enrolledStudents: course.students || 0,
              createdAt: new Date(course.createdAt || Date.now()).getTime(),
              updatedAt: new Date(course.updatedAt || Date.now()).getTime(),
              searchableText: this.prepareCourseText(course),
              keywords: this.extractKeywords(course),
            },
          };
        })
      );
      
      await this.index.namespace(this.namespace).upsert(vectors);
    }
  }

  // Helper methods
  private prepareCourseText(course: Course): string {
    return `${course.title}. ${course.description}. Category: ${course.category}. Difficulty: ${course.difficulty}.`;
  }

  private preparePathText(path: ExtendedLearningPath): string {
    return `${path.title}. ${path.description}. Category: ${path.category}.`;
  }

  private prepareConceptText(concept: Concept): string {
    const objectives = concept.learningObjectives.join('. ');
    const vocabulary = concept.keyVocabulary.join(', ');
    return `${concept.name}. ${concept.description}. Learning objectives: ${objectives}. Key concepts: ${vocabulary}.`;
  }

  private extractKeywords(item: any): string[] {
    // Simple keyword extraction - in production, use NLP library
    const text = `${item.title || item.name} ${item.description}`.toLowerCase();
    const words = text.split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
    
    return words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 10);
  }

  private buildFilter(filters?: FilterMetadata, idPrefix?: string): any {
    if (!filters) return idPrefix ? { id: { $regex: `^${idPrefix}` } } : {};
    
    const filter: any = {};
    
    if (idPrefix) {
      filter.id = { $regex: `^${idPrefix}` };
    }
    
    if (filters.category?.length) {
      filter.category = { $in: filters.category };
    }
    
    if (filters.difficulty?.length) {
      filter.difficulty = { $in: filters.difficulty };
    }
    
    if (filters.estimatedHours) {
      filter.estimatedHours = {
        $gte: filters.estimatedHours.min,
        $lte: filters.estimatedHours.max,
      };
    }
    
    if (filters.points) {
      filter.points = {
        $gte: filters.points.min,
        $lte: filters.points.max,
      };
    }
    
    if (filters.keywords?.length) {
      filter.keywords = { $in: filters.keywords };
    }
    
    return filter;
  }

  private buildPersonalizedQuery(profile: StudentProfile): string {
    const interests = profile.interests
      .slice(0, 5)
      .join(', ');
    
    const categories = Object.entries(profile.lifeCategoryWeights)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([cat]) => cat)
      .join(' and ');
    
    return `Educational content for students interested in ${interests}, focusing on ${categories} development`;
  }

  private getPreferredCategories(profile: StudentProfile): string[] {
    return Object.entries(profile.lifeCategoryWeights)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat);
  }

  private getAppropiateDifficulties(profile: StudentProfile): string[] {
    // Based on grade level and performance
    const gradeLevel = parseInt(profile.gradeLevel || '9');
    
    if (gradeLevel <= 8) return ['Beginner'];
    if (gradeLevel <= 10) return ['Beginner', 'Intermediate'];
    return ['Intermediate', 'Advanced'];
  }
}