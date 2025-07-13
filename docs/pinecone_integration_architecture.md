# Pinecone Integration Architecture

## Overview
This document outlines the architecture for integrating Pinecone vector database with the Sploosh educational platform to replace mock data with a real, scalable vector search infrastructure.

## 1. Vector Schema Design

### 1.1 Course Vectors
```typescript
interface CourseVector {
  id: string;                    // Unique course ID
  values: number[];              // 1536-dimensional embedding vector
  metadata: {
    // Core fields
    title: string;
    description: string;
    category: LifeCategory;        // 'personal' | 'social' | 'career' | 'philanthropic'
    
    // Searchable attributes
    difficulty: string;            // 'Beginner' | 'Intermediate' | 'Advanced'
    estimatedHours: number;
    points: number;
    totalSections: number;
    totalConcepts: number;
    
    // Stats
    enrolledStudents: number;
    averageRating?: number;
    completionRate?: number;
    
    // Timestamps
    createdAt: number;             // Unix timestamp
    updatedAt: number;             // Unix timestamp
    
    // Search optimization
    searchableText: string;        // Concatenated searchable content
    keywords: string[];            // Extracted keywords for filtering
  };
  sparseValues?: {                // For hybrid search
    indices: number[];
    values: number[];
  };
}
```

### 1.2 Learning Path Vectors
```typescript
interface LearningPathVector {
  id: string;                    // Format: "path_{pathId}"
  values: number[];              // 1536-dimensional embedding vector
  metadata: {
    // Core fields
    title: string;
    description: string;
    category: LifeCategory;
    
    // Path structure
    courseIds: string[];           // Associated course IDs
    sectionIds: string[];          // All section IDs in path
    conceptIds: string[];          // All concept IDs in path
    
    // Progress tracking
    totalConcepts: number;
    estimatedHours: number;
    points: number;
    
    // Prerequisites
    prerequisitePathIds?: string[];
    requiredSkillLevel?: string;
    
    // Timestamps
    createdAt: number;
    updatedAt: number;
    
    // Search optimization
    searchableText: string;
    keywords: string[];
    targetAgeGroup?: string;       // e.g., "13-15", "16-18"
  };
}
```

### 1.3 Concept Vectors
```typescript
interface ConceptVector {
  id: string;                    // Format: "concept_{conceptId}"
  values: number[];              // 1536-dimensional embedding vector
  metadata: {
    // Core fields
    title: string;
    description: string;
    sectionId: string;
    courseId: string;
    pathId: string;
    
    // Content structure
    componentTypes: string[];      // ['hook', 'examples', 'what-how']
    exerciseTypes: string[];       // ['initial', 'articulation']
    contentDuration: number;       // Total minutes
    
    // Learning attributes
    difficulty: string;
    keyVocabulary: string[];
    learningObjectives: string[];
    
    // Prerequisites
    prerequisiteConceptIds?: string[];
    
    // Timestamps
    createdAt: number;
    updatedAt: number;
    
    // Search optimization
    searchableText: string;
    keywords: string[];
    interestTags: string[];        // For personalization
  };
}
```

## 2. Metadata Structure for Filtering

### 2.1 Filter Categories
```typescript
interface FilterMetadata {
  // Categorical filters
  category: LifeCategory[];
  difficulty: string[];
  ageGroup: string[];
  
  // Numeric range filters
  estimatedHours: { min: number; max: number };
  points: { min: number; max: number };
  enrolledStudents: { min: number; max: number };
  
  // Boolean filters
  hasVideo: boolean;
  hasInteractive: boolean;
  isNew: boolean;               // Created within last 30 days
  isTrending: boolean;          // High enrollment rate
  
  // Multi-select filters
  keywords: string[];
  interestTags: string[];
  componentTypes: string[];
}
```

### 2.2 Search Strategy
```typescript
interface SearchStrategy {
  // Semantic search
  embedding: {
    model: 'text-embedding-ada-002';  // OpenAI embedding model
    dimensions: 1536;
    similarity: 'cosine';
  };
  
  // Hybrid search
  sparse: {
    enabled: true;
    algorithm: 'bm25';                // For keyword matching
  };
  
  // Reranking
  rerank: {
    enabled: true;
    model: 'cohere-rerank-v2';        // Optional reranking
    topK: 20;
  };
}
```

## 3. Embedding Strategy

### 3.1 Content Preparation
```typescript
interface EmbeddingContent {
  // Course embedding input
  course: {
    primary: string;      // "{title}. {description}"
    enhanced: string;     // "{title}. {description}. Category: {category}. Difficulty: {difficulty}. Topics covered: {concepts}"
  };
  
  // Learning path embedding input
  learningPath: {
    primary: string;      // "{title}. {description}"
    enhanced: string;     // "{title}. {description}. Path includes: {sectionTitles}. Skills developed: {objectives}"
  };
  
  // Concept embedding input
  concept: {
    primary: string;      // "{title}. {description}"
    enhanced: string;     // "{title}. {description}. Part of {courseTitle}. Key concepts: {vocabulary}. Learning objectives: {objectives}"
  };
}
```

### 3.2 Embedding Pipeline
```typescript
interface EmbeddingPipeline {
  steps: [
    'contentExtraction',      // Extract text from source
    'contentEnhancement',     // Add context and metadata
    'textCleaning',          // Remove special chars, normalize
    'chunkIfNeeded',         // Split if > 8K tokens
    'generateEmbedding',     // Call OpenAI API
    'qualityCheck',          // Validate embedding
    'storeInPinecone'        // Upsert to index
  ];
  
  batchSize: 100;           // Process in batches
  retryPolicy: {
    maxRetries: 3;
    backoffMs: 1000;
  };
}
```

## 4. Backend Service Architecture

### 4.1 Pinecone Client Service
```typescript
// services/pinecone/pinecone.service.ts
export class PineconeService {
  private index: Index;
  private embedder: EmbeddingService;
  
  // Core operations
  async upsertCourse(course: Course): Promise<void>;
  async upsertLearningPath(path: LearningPath): Promise<void>;
  async upsertConcept(concept: Concept): Promise<void>;
  
  // Search operations
  async searchCourses(query: string, filters?: FilterMetadata): Promise<CourseResult[]>;
  async searchPaths(query: string, filters?: FilterMetadata): Promise<PathResult[]>;
  async searchConcepts(query: string, filters?: FilterMetadata): Promise<ConceptResult[]>;
  
  // Recommendation operations
  async getRelatedCourses(courseId: string, limit?: number): Promise<Course[]>;
  async getPersonalizedRecommendations(studentProfile: StudentProfile): Promise<Course[]>;
  
  // Batch operations
  async batchUpsertCourses(courses: Course[]): Promise<void>;
  async reindexAll(): Promise<void>;
}
```

### 4.2 API Endpoints
```typescript
// API Routes for Pinecone-backed data

// Course endpoints
GET    /api/courses                      // List all courses with pagination
GET    /api/courses/search               // Search courses with query
GET    /api/courses/:id                  // Get specific course
GET    /api/courses/:id/related          // Get related courses
POST   /api/courses/:id/enroll           // Enroll in course

// Learning path endpoints  
GET    /api/learning-paths               // List all paths
GET    /api/learning-paths/search        // Search paths
GET    /api/learning-paths/:id           // Get path details with sections
GET    /api/learning-paths/:id/progress  // Get user progress

// Concept endpoints
GET    /api/concepts/search              // Search concepts
GET    /api/concepts/:id                 // Get concept details
GET    /api/concepts/:id/components      // Get concept components

// Recommendation endpoints
GET    /api/recommendations/courses      // Personalized course recommendations
GET    /api/recommendations/paths        // Personalized path recommendations
GET    /api/recommendations/next-concept // Next concept to learn
```

### 4.3 Caching Strategy
```typescript
interface CachingStrategy {
  // Redis cache layers
  layers: {
    l1: {
      name: 'hot-data';
      ttl: 300;              // 5 minutes
      items: ['popular-courses', 'trending-paths'];
    };
    l2: {
      name: 'search-results';
      ttl: 3600;             // 1 hour
      keyPattern: 'search:{query}:{filters}';
    };
    l3: {
      name: 'user-specific';
      ttl: 1800;             // 30 minutes
      keyPattern: 'user:{userId}:recommendations';
    };
  };
  
  // Cache invalidation
  invalidation: {
    onCourseUpdate: ['course:{id}', 'search:*', 'recommendations:*'];
    onEnrollment: ['user:{userId}:*', 'course:{courseId}:stats'];
    onProgress: ['user:{userId}:progress:*'];
  };
}
```

## 5. Frontend Integration

### 5.1 Data Fetching Hooks
```typescript
// hooks/usePineconeData.ts

export const useCourses = (filters?: FilterMetadata) => {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => api.get('/api/courses', { params: filters }),
    staleTime: 5 * 60 * 1000,  // 5 minutes
  });
};

export const useSearchCourses = (query: string, filters?: FilterMetadata) => {
  return useQuery({
    queryKey: ['search-courses', query, filters],
    queryFn: () => api.get('/api/courses/search', { params: { q: query, ...filters } }),
    enabled: query.length > 2,
    debounce: 300,
  });
};

export const useLearningPath = (pathId: string) => {
  return useQuery({
    queryKey: ['learning-path', pathId],
    queryFn: () => api.get(`/api/learning-paths/${pathId}`),
    staleTime: 10 * 60 * 1000,  // 10 minutes
  });
};

export const usePersonalizedRecommendations = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: () => api.get('/api/recommendations/courses'),
    enabled: !!user,
    staleTime: 30 * 60 * 1000,  // 30 minutes
  });
};
```

### 5.2 State Management
```typescript
// stores/pineconeStore.ts
interface PineconeStore {
  // Search state
  searchQuery: string;
  searchFilters: FilterMetadata;
  searchResults: {
    courses: CourseResult[];
    paths: PathResult[];
    concepts: ConceptResult[];
  };
  
  // Cache management
  cachedCourses: Map<string, Course>;
  cachedPaths: Map<string, LearningPath>;
  
  // Actions
  setSearchQuery: (query: string) => void;
  updateFilters: (filters: Partial<FilterMetadata>) => void;
  clearSearch: () => void;
  
  // Optimistic updates
  optimisticEnroll: (courseId: string) => void;
  optimisticProgress: (conceptId: string, progress: number) => void;
}
```

### 5.3 Error Handling & Loading States
```typescript
interface ErrorBoundary {
  // Fallback UI for Pinecone failures
  fallbacks: {
    searchError: () => JSX.Element;        // "Search temporarily unavailable"
    loadError: () => JSX.Element;          // "Failed to load content"
    networkError: () => JSX.Element;       // "Check your connection"
  };
  
  // Retry strategies
  retry: {
    maxAttempts: 3;
    backoff: 'exponential';
    onFailure: (error: Error) => void;     // Log to monitoring
  };
  
  // Loading states
  loading: {
    skeleton: boolean;                     // Show skeleton loaders
    spinner: boolean;                      // Show spinner for actions
    progressive: boolean;                  // Load content progressively
  };
}
```

## 6. Implementation Strategy

### Phase 1: Infrastructure Setup
1. Create Pinecone index with appropriate dimensions
2. Set up embedding service with OpenAI
3. Implement PineconeService with basic CRUD
4. Create data processing scripts

### Phase 2: Data Processing
1. Extract mock data from components
2. Generate embeddings for all content
3. Batch upload to Pinecone with metadata
4. Verify data integrity and search quality

### Phase 3: API Implementation
1. Implement all API endpoints
2. Add caching layer with Redis
3. Set up monitoring and logging
4. Performance testing and optimization

### Phase 4: Frontend Integration
1. Replace mock data with API calls
2. Implement search and filter UI
3. Add loading and error states
4. Test user flows end-to-end

### Phase 5: Optimization
1. Implement personalization features
2. Add recommendation engine
3. Optimize search relevance
4. Scale testing and monitoring

## 7. Performance Considerations

- **Query Optimization**: Use metadata filters before vector search
- **Batch Operations**: Process embeddings in batches of 100
- **Caching**: Implement multi-level caching for common queries
- **Pagination**: Limit results to 20 per page with cursor-based pagination
- **Index Optimization**: Use appropriate pod type and replicas for scale

## 8. Security Considerations

- **API Key Management**: Store Pinecone API keys in Supabase environment variables
- **Rate Limiting**: Implement per-user rate limits
- **Data Privacy**: Ensure no PII in vector embeddings
- **Access Control**: Validate user permissions for content access