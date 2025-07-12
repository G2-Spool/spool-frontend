# Supabase Mock Data Guide

This guide documents the Supabase database setup with mock data for the Spool learning platform.

## Database Connection

```typescript
// Connection details
const supabaseUrl = 'https://ubtwzfbtfekmgvswlfsd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // See src/config/supabase.ts

// TypeScript types
import { Database } from '../types/supabase'
```

## Mock Data Overview

### 1. Users (3 records)
- Sarah Chen (sarah.chen@example.com) - 11th grade, interests in gaming, AI, digital art
- Marcus Johnson (marcus.johnson@example.com) - 10th grade, interests in basketball, music, entrepreneurship
- Emily Rodriguez (emily.rodriguez@example.com) - 12th grade, interests in creative writing, climate action

### 2. Learning Threads (6 records)
Active threads demonstrating cross-curricular learning:

#### Sarah's Threads:
- **AI-Powered Game Development Journey** - Combines CS, Math, Physics, Art, Literature, Psychology
- **Interactive Musical Art Creation** - Blends Art, Music, CS, Math, Physics

#### Marcus's Thread:
- **Sustainable Fashion Entrepreneurship** - Integrates Business, Economics, Art, Environmental Science, Social Studies, Math

#### Emily's Threads:
- **Climate Action Through Urban Agriculture** - Connects Environmental Science, Biology, Chemistry, Social Studies, Math, Business
- **Climate Fiction Writing Journey** - Weaves Literature, Environmental Science, Social Studies, Psychology, History
- **Home Renewable Energy Systems** (Completed) - Combined Physics, Environmental Science, Math, Economics

### 3. Thread Concepts (18 records)
Shows cross-curricular bridges with 80%+ relevance scores. Example from Sarah's game dev thread:

1. Variables (CS) → 2. Coordinates (Math) → 3. Motion (Physics) → 4. Loops (CS) → 5. Functions (CS) → 6. Game Loop (CS) → 7. Vectors (Math) → 8. AI Basics (CS) → 9. Player Psychology → 10. Pixel Art → 11. Narrative → 12. Collision Detection (Physics)

Each transition includes a bridge explanation connecting subjects naturally.

### 4. Thread Assessments (2 records)
Examples of personalized, two-stage exercises:
- Sarah's variables exercise contextualized with anime-inspired game design
- Marcus's business model canvas integrated with community impact goals

### 5. Community Features
- 2 featured public threads with high engagement (245+ views, 12+ remixes)
- Tags like "game-dev", "ai", "renewable-energy", "sustainability"

### 6. Progress Tracking
- Weekly snapshots showing learning velocity
- Mastery scores averaging 85-92%
- Curiosity events tracked for branching opportunities

### 7. Portfolio Projects
Emily's completed "Solar Garden" web app demonstrating mastery across Physics, Math, Environmental Science, and Economics

## Key Features Demonstrated

### Cross-Curricular Integration
- Every thread weaves 4-6 subjects naturally
- Concepts bridge between subjects with contextual explanations
- 80%+ relevance threshold maintained

### Personalization
- Exercises reference student interests (anime, basketball, climate fiction)
- Learning paths adapted to preferences (deep vs moderate complexity)
- Thread branching based on curiosity

### Community & Collaboration
- Public thread sharing with remixing
- Featured threads for inspiration
- Collaboration settings for group learning

## Testing the Data

Run the test queries:
```bash
npx tsx test-supabase-queries.ts
```

This will demonstrate:
1. Active threads with progress
2. Cross-curricular concept bridges
3. Featured community content
4. Student profiles and interests
5. Real-time subscriptions

## Security Note

Basic read-only policies are enabled for testing. In production:
- Implement proper authentication
- Add user-specific RLS policies
- Restrict write operations
- Secure sensitive student data

## Next Steps

1. Connect frontend components to Supabase queries
2. Implement authentication flow
3. Add write operations for student progress
4. Set up real-time collaboration features
5. Configure production security policies 