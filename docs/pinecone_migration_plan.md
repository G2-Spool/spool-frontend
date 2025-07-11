# Pinecone Migration Plan

## Overview
This document outlines the step-by-step migration plan to transition from mock data to Pinecone vector database integration.

## Prerequisites
- [ ] Pinecone API key stored in AWS SSM Parameter Store
- [ ] OpenAI API key for embeddings
- [ ] Backend service infrastructure ready
- [ ] Testing environment set up

## Phase 1: Infrastructure Setup (Week 1)

### 1.1 Pinecone Configuration
```bash
# Create index
curl -X POST "https://api.pinecone.io/indexes" \
  -H "Api-Key: $PINECONE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "spool-textbook-embeddings",
    "dimension": 1536,
    "metric": "cosine",
    "pods": 1,
    "replicas": 1,
    "pod_type": "p1.x1"
  }'
```

### 1.2 Environment Setup
```typescript
// .env
PINECONE_API_KEY=your-key-here
PINECONE_INDEX_NAME=spool-textbook-embeddings
PINECONE_NAMESPACE=production
OPENAI_API_KEY=your-openai-key
```

### 1.3 Backend Service Setup
- [ ] Install Pinecone SDK: `npm install @pinecone-database/pinecone`
- [ ] Install OpenAI SDK: `npm install openai`
- [ ] Set up Redis for caching
- [ ] Configure monitoring and logging

## Phase 2: Data Migration (Week 1-2)

### 2.1 Extract Mock Data
```typescript
// scripts/extract-mock-data.ts
import { mockCourses } from '../src/pages/CoursesPage';
import { mockSections } from '../src/pages/LearningPathDetail';
import fs from 'fs';

const extractedData = {
  courses: mockCourses,
  sections: mockSections,
  timestamp: new Date().toISOString(),
};

fs.writeFileSync('data/extracted-mock-data.json', JSON.stringify(extractedData, null, 2));
```

### 2.2 Transform Data for Pinecone
```typescript
// scripts/transform-data.ts
interface TransformConfig {
  courses: {
    fields: ['id', 'title', 'description', 'category', 'difficulty'],
    embeddingFields: ['title', 'description'],
  };
  concepts: {
    fields: ['id', 'title', 'description', 'components'],
    embeddingFields: ['title', 'description'],
  };
}
```

### 2.3 Generate Embeddings
```typescript
// scripts/generate-embeddings.ts
import { EmbeddingService } from '../src/services/embedding/embedding.service';
import { PineconeService } from '../src/services/pinecone/pinecone.service';

async function migrateData() {
  const embedder = new EmbeddingService();
  const pinecone = new PineconeService(
    process.env.PINECONE_API_KEY!,
    process.env.PINECONE_INDEX_NAME!
  );
  
  // Process courses
  for (const course of courses) {
    await pinecone.upsertCourse(course);
    console.log(`Migrated course: ${course.title}`);
  }
  
  // Process concepts
  for (const concept of concepts) {
    await pinecone.upsertConcept(concept);
    console.log(`Migrated concept: ${concept.title}`);
  }
}
```

### 2.4 Verify Migration
```typescript
// scripts/verify-migration.ts
async function verifyMigration() {
  const testQueries = [
    "game development",
    "creative writing",
    "environmental science",
    "leadership"
  ];
  
  for (const query of testQueries) {
    const results = await pinecone.searchCourses(query);
    console.log(`Query: "${query}" returned ${results.length} results`);
  }
}
```

## Phase 3: API Implementation (Week 2)

### 3.1 Create API Routes
```typescript
// backend/routes/courses.routes.ts
router.get('/courses', coursesController.list);
router.get('/courses/search', coursesController.search);
router.get('/courses/:id', coursesController.getById);
router.get('/courses/:id/related', coursesController.getRelated);
router.post('/courses/:id/enroll', coursesController.enroll);
```

### 3.2 Implement Controllers
```typescript
// backend/controllers/courses.controller.ts
export class CoursesController {
  constructor(private pineconeService: PineconeService) {}
  
  async search(req: Request, res: Response) {
    const { q, ...filters } = req.query;
    const results = await this.pineconeService.searchCourses(q as string, filters);
    res.json(results);
  }
}
```

### 3.3 Add Caching Layer
```typescript
// backend/middleware/cache.middleware.ts
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.locals.cacheKey = key;
    res.locals.cacheTTL = ttl;
    next();
  };
};
```

## Phase 4: Frontend Integration (Week 2-3)

### 4.1 Update CoursesPage Component
```typescript
// Before: Using mock data
const mockCourses = [...];

// After: Using Pinecone data
import { useCourses } from '../hooks/pinecone/usePineconeData';

export const CoursesPage: React.FC = () => {
  const { data, isLoading, error } = useCourses();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  const courses = data?.items || [];
  // ... rest of component
};
```

### 4.2 Update LearningPathDetail Component
```typescript
// Before: Using mock sections
const mockSections = {...};

// After: Using Pinecone data
import { useLearningPath } from '../hooks/pinecone/usePineconeData';

export const LearningPathDetail: React.FC = () => {
  const { id } = useParams();
  const { data: path, isLoading, error } = useLearningPath(id!);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  // ... rest of component
};
```

### 4.3 Add Search Functionality
```typescript
// components/SearchBar.tsx
export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterMetadata>({});
  const { data, isLoading } = useSearchCourses(query, filters);
  
  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses..."
      />
      <FilterPanel filters={filters} onChange={setFilters} />
      {isLoading && <LoadingIndicator />}
      {data && <SearchResults results={data} />}
    </div>
  );
};
```

## Phase 5: Testing & Optimization (Week 3)

### 5.1 Unit Tests
```typescript
// tests/pinecone.service.test.ts
describe('PineconeService', () => {
  it('should search courses by query', async () => {
    const results = await service.searchCourses('game development');
    expect(results).toHaveLength(greaterThan(0));
    expect(results[0]).toHaveProperty('metadata.title');
  });
});
```

### 5.2 Integration Tests
```typescript
// tests/api.integration.test.ts
describe('Courses API', () => {
  it('should return paginated courses', async () => {
    const response = await request(app)
      .get('/api/courses')
      .query({ page: 1, pageSize: 10 });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(response.body.items).toHaveLength(10);
  });
});
```

### 5.3 Performance Testing
```typescript
// tests/performance.test.ts
describe('Performance', () => {
  it('should handle concurrent searches', async () => {
    const queries = Array(100).fill('test');
    const start = Date.now();
    
    await Promise.all(
      queries.map(q => service.searchCourses(q))
    );
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000); // 5 seconds for 100 queries
  });
});
```

### 5.4 Load Testing
```bash
# Using k6 for load testing
k6 run --vus 50 --duration 30s load-test.js
```

## Phase 6: Deployment (Week 4)

### 6.1 Staging Deployment
- [ ] Deploy backend services to staging
- [ ] Run migration scripts on staging data
- [ ] Test all API endpoints
- [ ] Verify search quality

### 6.2 Production Deployment
- [ ] Schedule maintenance window
- [ ] Run migration scripts on production data
- [ ] Deploy backend services
- [ ] Deploy frontend updates
- [ ] Monitor error rates and performance

### 6.3 Rollback Plan
```bash
# In case of issues, rollback procedure:
1. Switch frontend to use fallback mock data
2. Restore backend to previous version
3. Clear Pinecone index if corrupted
4. Re-run migration from backup
```

## Monitoring & Success Metrics

### Key Metrics to Track
- Search latency (p50, p95, p99)
- Search relevance scores
- Cache hit rates
- Error rates
- User engagement with search

### Monitoring Dashboard
```typescript
// Set up monitoring endpoints
GET /api/health/pinecone
GET /api/metrics/search
GET /api/metrics/cache
```

### Success Criteria
- [ ] Search latency < 200ms (p95)
- [ ] Cache hit rate > 60%
- [ ] Search relevance score > 0.8
- [ ] Zero data loss during migration
- [ ] Error rate < 0.1%

## Post-Migration Tasks

1. **Optimize Search Relevance**
   - Analyze search queries and results
   - Tune embedding parameters
   - Implement query expansion

2. **Enhance Personalization**
   - Implement user preference learning
   - A/B test recommendation algorithms
   - Add collaborative filtering

3. **Scale Infrastructure**
   - Monitor index performance
   - Plan for index sharding
   - Implement auto-scaling

4. **Documentation**
   - Update API documentation
   - Create troubleshooting guide
   - Document best practices