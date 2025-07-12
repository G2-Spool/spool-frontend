# Thread Graph AWS Integration Setup

## Overview

This document describes the AWS infrastructure setup for the Thread Graph feature, which integrates Neo4j AuraDB with the Spool frontend through AWS Lambda and API Gateway.

## Architecture

```
Frontend → API Gateway → Lambda → Neo4j AuraDB
```

### Components

1. **Neo4j AuraDB**: Cloud-hosted Neo4j database storing thread relationship data
2. **AWS Lambda**: `spool-thread-graph-api` function handling Neo4j queries
3. **AWS API Gateway**: RESTful endpoint integration with Cognito authentication
4. **AWS Systems Manager**: Parameter Store for secure credential management

## Deployed Resources

### Neo4j Credentials (Parameter Store)
- `/spool/neo4j/uri`: `neo4j+s://9d61bfe9.databases.neo4j.io`
- `/spool/neo4j/username`: `neo4j`
- `/spool/neo4j/password`: SecureString (CHANGE IN PRODUCTION)

### Lambda Function
- **Name**: `spool-thread-graph-api`
- **Runtime**: Node.js 18.x
- **Memory**: 512MB
- **Timeout**: 30 seconds
- **Role**: `lambda-thread-graph-role`
- **ARN**: `arn:aws:lambda:us-east-1:560281064968:function:spool-thread-graph-api`

### API Gateway Endpoint
- **API ID**: `alj6xppcj6`
- **Base URL**: `https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod`
- **Thread Graph Endpoint**: `/api/thread/{threadId}/graph`
- **Full URL**: `https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread/{threadId}/graph`
- **Authentication**: Cognito User Pool required

## API Endpoints

### Get Thread Graph
```
GET /api/thread/{threadId}/graph
Authorization: Bearer <cognito-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "threadId": "thread-123",
  "graph": {
    "nodes": [
      {
        "id": "chunk-1",
        "type": "ChunkIndex",
        "name": "Introduction to Algebra",
        "subject": "Mathematics",
        "book": "Algebra Basics",
        "chapter": "Chapter 1",
        "section": "Introduction",
        "relevanceScore": 0.95,
        "position": 1
      }
    ],
    "edges": [
      {
        "source": "chunk-1",
        "target": "concept-1",
        "type": "CONCEPT_RELATES_TO",
        "strength": 0.8
      }
    ],
    "metadata": {
      "threadId": "thread-123",
      "totalNodes": 25,
      "subjects": ["Mathematics", "Physics"],
      "crossSubjectBridges": ["Engineering"]
    }
  },
  "timestamp": "2025-07-12T19:32:00Z"
}
```

### Test Neo4j Connection
```
GET /api/thread/test
Authorization: Bearer <cognito-jwt-token>
```

## Frontend Integration

### Service Layer
- **File**: `/src/services/threadGraph.service.ts`
- **Class**: `ThreadGraphService`
- **Methods**:
  - `getThreadGraph(threadId)`: Fetch raw graph data
  - `getThreadGraphForD3(threadId)`: Get D3.js-compatible format
  - `testConnection()`: Test Neo4j connectivity

### React Hooks
- **File**: `/src/hooks/useThreadGraph.ts`
- **Hooks**:
  - `useThreadGraph(threadId, enabled)`: Raw graph data
  - `useThreadGraphD3(threadId, enabled)`: D3.js formatted data
  - `useNeo4jConnectionTest(enabled)`: Connection testing

### Usage Example
```typescript
import { useThreadGraphD3 } from '../hooks/useThreadGraph';

function ThreadGraphComponent({ threadId }: { threadId: string }) {
  const { data, isLoading, error } = useThreadGraphD3(threadId, true);
  
  if (isLoading) return <div>Loading graph...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <D3GraphVisualization 
      nodes={data.nodes} 
      links={data.links}
      metadata={data.metadata}
    />
  );
}
```

## Neo4j Query Used

The Lambda function executes this Cypher query to fetch thread graph data:

```cypher
MATCH path = (s:Subject)<-[:BELONGS_TO]-(b:Book)<-[:BELONGS_TO]-(c:Chapter)<-[:BELONGS_TO]-(sec:Section)<-[:BELONGS_TO]-(ci:ChunkIndex)
WHERE EXISTS((ci)-[:PART_OF_THREAD]->(:Thread {id: $threadId}))
WITH path, s, b, c, sec, ci
OPTIONAL MATCH (ci)-[:CONCEPT_RELATES_TO]->(concept:Concept)
OPTIONAL MATCH (s)-[:BRIDGES_TO]->(otherSubject:Subject)
RETURN {
  nodes: collect(DISTINCT {
    id: ci.id,
    type: 'ChunkIndex',
    name: ci.title,
    content: ci.content,
    subject: s.name,
    book: b.title,
    chapter: c.title,
    section: sec.title,
    relevanceScore: ci.relevance_score,
    position: ci.position
  }) + collect(DISTINCT {
    id: concept.id,
    type: 'Concept',
    name: concept.name,
    subject: concept.subject,
    difficulty: concept.difficulty
  }) + collect(DISTINCT {
    id: s.id,
    type: 'Subject',
    name: s.name,
    color: s.color_code
  }),
  edges: collect(DISTINCT {
    source: ci.id,
    target: concept.id,
    type: 'CONCEPT_RELATES_TO',
    strength: 0.8
  }) + collect(DISTINCT {
    source: s.id,
    target: otherSubject.id,
    type: 'BRIDGES_TO',
    strength: 0.9
  }),
  metadata: {
    threadId: $threadId,
    totalNodes: size(collect(DISTINCT ci)) + size(collect(DISTINCT concept)) + size(collect(DISTINCT s)),
    subjects: collect(DISTINCT s.name),
    crossSubjectBridges: collect(DISTINCT otherSubject.name)
  }
} AS threadGraph
LIMIT 100
```

## Security & Configuration

### IAM Role Permissions
The `lambda-thread-graph-role` has:
- Basic Lambda execution permissions
- Systems Manager Parameter Store read access
- CloudWatch Logs write access

### CORS Configuration
The Lambda function includes CORS headers for frontend integration:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Correlation-ID',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};
```

### Authentication
- All endpoints require Cognito User Pool JWT tokens
- API Gateway validates tokens before forwarding to Lambda
- Unauthorized requests return 401 with "Missing Authentication Token"

## Production Considerations

### Security
1. **Change Neo4j Password**: Update `/spool/neo4j/password` in Parameter Store
2. **Restrict CORS Origins**: Update CORS configuration to specific domains
3. **API Rate Limiting**: Consider adding rate limits to API Gateway
4. **VPC Integration**: Consider placing Lambda in VPC for network security

### Performance
1. **Connection Pooling**: Neo4j driver includes connection pooling
2. **Query Optimization**: Current query limits to 100 results
3. **Caching**: Frontend hooks cache for 10 minutes
4. **Error Handling**: Graceful degradation with empty graph on errors

### Monitoring
1. **CloudWatch Logs**: `/aws/lambda/spool-thread-graph-api`
2. **API Gateway Metrics**: Request count, latency, error rates
3. **Lambda Metrics**: Duration, memory usage, error count
4. **Neo4j Monitoring**: Use Neo4j Aura console for database metrics

## Deployment

The deployment was completed using:
```bash
cd /workspaces/spool-frontend/lambda/threadGraph
./deploy.sh
```

This script:
1. Creates IAM role with necessary permissions
2. Packages Lambda function with dependencies
3. Deploys Lambda function to AWS
4. Configures API Gateway resources and integration
5. Sets up proper Lambda permissions for API Gateway

## Testing

### Manual Testing
```bash
# Test with authentication (requires Cognito token)
curl -X GET \
  "https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread/test-123/graph" \
  -H "Authorization: Bearer YOUR_COGNITO_JWT_TOKEN"

# Test connection endpoint
curl -X GET \
  "https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread/test" \
  -H "Authorization: Bearer YOUR_COGNITO_JWT_TOKEN"
```

### Frontend Testing
Use the React hooks in development mode:
```typescript
// Test connection
const { data: connectionTest } = useNeo4jConnectionTest(true);

// Test thread graph
const { data: graphData } = useThreadGraph('test-thread-id', true);
```

## Next Steps

1. **Update Neo4j Password**: Change the placeholder password in Parameter Store
2. **Populate Neo4j Database**: Add actual thread and concept data
3. **Create ThreadGraph Component**: Build D3.js visualization component
4. **Integrate with ThreadCard**: Add hover trigger for graph display
5. **Add Error Boundaries**: Implement proper error handling in UI
6. **Performance Testing**: Test with realistic data volumes

## Support

For issues or questions:
- Check CloudWatch Logs for Lambda errors
- Verify Neo4j AuraDB connectivity
- Confirm Cognito authentication is working
- Review API Gateway integration configuration