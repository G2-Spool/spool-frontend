# Thread Data API Integration Guide

## Overview
This guide explains how the thread data flows from RDS PostgreSQL through API Gateway to the frontend /threads page.

## Architecture Flow

```
Frontend (/threads page)
    ↓
useUserThreads Hook
    ↓
Thread Service (thread.service.ts)
    ↓
API Gateway (https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod)
    ↓
Lambda Function (spool-create-thread)
    ↓
RDS PostgreSQL (threads, thread_analysis, thread_sections tables)
```

## Frontend Integration

### 1. Thread Hook (`useUserThreads.ts`)
```typescript
const useUserThreads = () => {
  // Fetches threads for authenticated user
  // Transforms learning_paths to Thread format
  // Returns array of Thread objects
};
```

### 2. Thread Service (`thread.service.ts`)
```typescript
// Transforms database records to Thread type
const transformToThread = (data) => {
  return {
    threadId: data.id,
    userId: data.student_id,
    userInput: data.title,
    analysis: {
      subjects: data.subjects || [],
      topics: data.topics || [],
      concepts: data.concepts || [],
      summary: data.summary || ''
    },
    sections: data.sections || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    status: data.status || 'active'
  };
};
```

## API Endpoints

### GET /threads
Retrieves all threads for the authenticated user.

**Request:**
```
GET https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/threads
Authorization: Bearer [JWT_TOKEN]
```

**Response:**
```json
{
  "threads": [
    {
      "threadId": "uuid",
      "userId": "cognito-user-id",
      "userInput": "How can I build a video game that teaches climate science?",
      "analysis": {
        "subjects": ["Computer Science", "Environmental Science"],
        "topics": ["Game Development", "Climate Modeling"],
        "concepts": ["Game Engines", "Climate Systems"],
        "summary": "Learn to create educational games..."
      },
      "sections": [
        {
          "id": "section-uuid",
          "title": "Game Design Fundamentals",
          "text": "Introduction to game design...",
          "relevanceScore": 0.87,
          "difficulty": "beginner",
          "estimatedMinutes": 5
        }
      ],
      "createdAt": "2025-01-12T10:30:00Z",
      "status": "active"
    }
  ]
}
```

### POST /threads
Creates a new thread based on user input.

**Request:**
```json
POST https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/threads
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json

{
  "userInput": "What math do I need to understand machine learning?",
  "interests": ["mathematics", "AI", "programming"]
}
```

## Lambda Function Updates

The Lambda function needs to query the new thread tables:

```javascript
// threadService.js updates
async function getUserThreads(userId) {
  const query = `
    SELECT 
      t.*,
      ta.subjects,
      ta.topics,
      ta.concepts as analysis_concepts,
      ta.summary,
      json_agg(
        json_build_object(
          'id', ts.id,
          'title', ts.title,
          'text', ts.text,
          'relevanceScore', ts.relevance_score,
          'difficulty', ts.difficulty,
          'estimatedMinutes', ts.estimated_minutes
        ) ORDER BY ts.section_number
      ) as sections
    FROM threads t
    JOIN thread_analysis ta ON t.id = ta.thread_id
    LEFT JOIN thread_sections ts ON t.id = ts.thread_id
    WHERE t.student_id = $1 AND t.status = 'active'
    GROUP BY t.id, ta.subjects, ta.topics, ta.concepts, ta.summary
    ORDER BY t.created_at DESC
  `;
  
  const result = await db.query(query, [userId]);
  return result.rows.map(transformToThread);
}
```

## Testing the Integration

### 1. Direct Database Query
```bash
# Test data exists in RDS
PGPASSWORD=[PASSWORD] psql \
  -h [RDS_ENDPOINT] \
  -U spooladmin \
  -d spool \
  -c "SELECT COUNT(*) FROM threads WHERE student_id = '4478c408-f0c1-70a2-f256-6aa0916d9192';"
```

### 2. Test Lambda Function
```bash
# Invoke Lambda directly
aws lambda invoke \
  --function-name spool-create-thread \
  --payload '{"httpMethod":"GET","path":"/threads","headers":{"Authorization":"Bearer [TOKEN]"}}' \
  --region us-east-1 \
  response.json

cat response.json
```

### 3. Test API Gateway
```bash
# Get threads via API
curl -X GET \
  https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/threads \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json"
```

### 4. Frontend Verification
1. Log in to the application
2. Navigate to /threads
3. Verify that threads are displayed with:
   - User's original questions
   - AI analysis (subjects, topics, summary)
   - Multiple sections per thread
   - Relevance scores and time estimates

## Troubleshooting

### No Threads Showing
1. Check user is authenticated (JWT token valid)
2. Verify user ID matches Cognito user ID in database
3. Check Lambda has DATABASE_URL environment variable
4. Verify Lambda can connect to RDS (security groups)

### Connection Issues
1. RDS security group must allow Lambda connections
2. Lambda must be in same VPC or have proper routing
3. Check SSM parameters are accessible by Lambda role

### Data Format Issues
1. Ensure thread_analysis and thread_sections are joined correctly
2. Verify JSON aggregation in PostgreSQL query
3. Check transformation in thread.service.ts matches expected format

## Environment Variables

### Lambda Function
```
DATABASE_URL=postgresql://spooladmin:[PASSWORD]@[RDS_ENDPOINT]:5432/spool
```

### Frontend (if needed)
```
REACT_APP_API_URL=https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod
```

## Security Considerations

1. **Authentication**: All API calls require valid JWT token
2. **Authorization**: Users can only access their own threads
3. **Data Privacy**: No cross-user data exposure
4. **Connection Security**: RDS uses SSL/TLS encryption
5. **Secrets Management**: Database credentials in SSM Parameter Store

## Performance Optimization

1. **Indexes**: Created on student_id, status, and created_at
2. **Query Optimization**: Use thread_details view for common queries
3. **Connection Pooling**: Implement in Lambda for better performance
4. **Caching**: Consider ElastiCache for frequently accessed threads