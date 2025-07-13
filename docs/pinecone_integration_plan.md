# Pinecone Integration Plan

## Overview
This document outlines the implementation plan for integrating Pinecone vector database with the Spool learning platform to enable semantic search and personalized recommendations.

## Prerequisites
- [ ] Pinecone API key stored in Supabase environment variables
- [ ] OpenAI API key for embeddings
- [ ] Backend service infrastructure ready
- [ ] Development environment configured

## Architecture Overview

### Vector Indexes
- **Index Name**: `spool-textbook-embeddings`
- **Dimensions**: 1536 (OpenAI text-embedding-ada-002)
- **Metric**: Cosine similarity
- **Pod Type**: s1.x1 (starter)

### Data Types
1. **Course Vectors**: Full course metadata and embeddings
2. **Learning Path Vectors**: Path structure and relationships
3. **Concept Vectors**: Individual concept embeddings

## Phase 1: Infrastructure Setup (Week 1)

### 1.1 Pinecone Configuration
```typescript
// config/pinecone.config.ts
export const pineconeConfig = {
  apiKey: process.env.PINECONE_API_KEY,
  environment: 'production',
  indexName: 'spool-textbook-embeddings',
  dimensions: 1536,
  metric: 'cosine'
};
```

### 1.2 Service Implementation
```typescript
// services/pinecone/pinecone.service.ts
export class PineconeService {
  private index: Index;
  private embedder: EmbeddingService;
  
  constructor() {
    this.initialize();
  }
  
  async initialize() {
    const pinecone = new Pinecone(pineconeConfig);
    this.index = pinecone.Index(pineconeConfig.indexName);
    this.embedder = new EmbeddingService();
  }
}
```

### 1.3 Database Schema Updates
- Add `pinecone_id` column to courses table
- Add `embedding_generated_at` timestamp
- Create `embeddings_queue` table for processing

## Phase 2: Data Integration (Week 1-2)

### 2.1 Embedding Generation Service
```typescript
// services/embedding/embedding.service.ts
export class EmbeddingService {
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data.data[0].embedding;
  }
  
  async generateBulkEmbeddings(texts: string[]): Promise<number[][]> {
    // Batch process for efficiency
  }
}
```

### 2.2 Content Processing Pipeline
```typescript
// scripts/process-content.ts
async function processContent() {
  const courses = await supabase.from('courses').select('*');
  
  for (const course of courses) {
    const embedding = await embedder.generateEmbedding(
      `${course.title}. ${course.description}`
    );
    
    await pinecone.upsert({
      id: course.id,
      values: embedding,
      metadata: {
        title: course.title,
        category: course.category,
        difficulty: course.difficulty,
        // ... other metadata
      }
    });
    
    console.log(`Processed course: ${course.title}`);
  }
  
  // Similar processing for concepts and paths
}
```

### 2.3 Data Verification
```typescript
// scripts/verify-integration.ts
async function verifyIntegration() {
  const stats = await pinecone.describeIndexStats();
  console.log('Index stats:', stats);
  
  // Test search
  const testQuery = "learn programming";
  const results = await pinecone.query({
    vector: await embedder.generateEmbedding(testQuery),
    topK: 5,
    includeMetadata: true
  });
  
  console.log('Test search results:', results);
}
```

## Phase 3: API Implementation (Week 2-3)

### 3.1 Search Endpoints
```typescript
// Edge Functions
export async function searchCourses(query: string, filters?: any) {
  const embedding = await embedder.generateEmbedding(query);
  
  const results = await pinecone.query({
    vector: embedding,
    filter: filters,
    topK: 20,
    includeMetadata: true
  });
  
  return results.matches.map(transformToCourse);
}
```

### 3.2 Recommendation Engine
```typescript
export async function getRecommendations(userId: string) {
  const profile = await getUserProfile(userId);
  const interests = profile.interests.join(' ');
  
  const embedding = await embedder.generateEmbedding(interests);
  
  return await pinecone.query({
    vector: embedding,
    filter: { 
      difficulty: profile.skillLevel,
      category: { $in: profile.preferredCategories }
    },
    topK: 10,
    includeMetadata: true
  });
}
```

## Phase 4: Frontend Integration (Week 3-4)

### 4.1 Search Components
```tsx
// components/SearchInterface.tsx
export function SearchInterface() {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSearchCourses(query);
  
  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <SearchResults results={data} loading={isLoading} />
    </div>
  );
}
```

### 4.2 Personalized Dashboard
```tsx
// components/PersonalizedDashboard.tsx
export function PersonalizedDashboard() {
  const { data: recommendations } = useRecommendations();
  
  return (
    <div>
      <h2>Recommended for You</h2>
      <CourseGrid courses={recommendations} />
    </div>
  );
}
```

## Phase 5: Optimization & Monitoring (Week 4-5)

### 5.1 Performance Optimization
- Implement caching layer with Redis
- Batch embedding generation
- Optimize metadata filtering
- Add request debouncing

### 5.2 Monitoring Setup
- Track query latency
- Monitor embedding generation times
- Set up alerts for API errors
- Create performance dashboards

### 5.3 A/B Testing
- Test different embedding models
- Experiment with hybrid search
- Optimize ranking algorithms

## Success Metrics

### Technical Metrics
- [ ] Search latency < 200ms
- [ ] 99.9% uptime for search functionality
- [ ] Embedding generation < 100ms per item

### Business Metrics
- [ ] Improved content discovery (20% increase in course views)
- [ ] Higher engagement (15% increase in course completions)
- [ ] Better personalization (25% increase in recommendation clicks)

## Rollback Strategy

In case of issues:
1. Disable Pinecone search, fallback to database search
2. Cache last known good embeddings
3. Queue failed embeddings for reprocessing
4. Monitor and fix issues before re-enabling

## Timeline Summary

- **Week 1**: Infrastructure setup and service implementation
- **Week 2**: Data processing and embedding generation
- **Week 3**: API implementation and testing
- **Week 4**: Frontend integration
- **Week 5**: Optimization and monitoring

## Next Steps

1. [ ] Obtain Pinecone API key
2. [ ] Set up development index
3. [ ] Begin infrastructure implementation
4. [ ] Start embedding generation for existing content