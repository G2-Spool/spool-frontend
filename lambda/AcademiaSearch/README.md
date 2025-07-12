# AcademiaSearch Lambda Function

## Overview

The AcademiaSearch Lambda function is a serverless service that provides intelligent academic topic analysis and content retrieval. It integrates with OpenAI for natural language processing, Pinecone for vector search, and AWS RDS for data persistence.

## Architecture

```
CreateThreadModal.tsx → API Gateway → Lambda → OpenAI → Pinecone → RDS → Response
```

### Flow:
1. **User Input**: Student asks a question through CreateThreadModal.tsx
2. **Academic Analysis**: OpenAI GPT-4 analyzes the question and generates 5 detailed academic topic descriptions
3. **Vector Search**: Pinecone searches for the top 10 most relevant content chunks using embeddings
4. **Data Storage**: Results are stored in PostgreSQL RDS database
5. **Response**: Thread ID and metadata returned to frontend

## Features

- 🧠 **Intelligent Analysis**: Uses GPT-4 to identify academic subjects, topics, and concepts
- 🔍 **Vector Search**: Semantic search through academic content using Pinecone
- 💾 **Persistent Storage**: Stores analysis results and retrieved content in RDS
- 🔒 **Secure**: Uses AWS Parameter Store for API key management
- 📝 **Comprehensive Logging**: Structured logging with request tracking
- ⚡ **Error Handling**: Robust error handling with proper HTTP status codes
- 🧪 **Tested**: Comprehensive unit and integration tests

## API Endpoint

```
POST /api/academia-search/create-thread
```

### Request Body:
```json
{
  "question": "How do neural networks learn?",
  "studentId": "student-123",
  "studentProfile": {
    "interests": [
      {
        "interest": "Machine Learning",
        "category": "career", 
        "strength": 8
      }
    ],
    "firstName": "John",
    "grade": "12"
  }
}
```

### Response:
```json
{
  "threadId": "uuid-v4",
  "message": "Learning thread created successfully with academic analysis and relevant content",
  "topic": "Computer Science",
  "category": "STEM"
}
```

## Database Schema

### Tables:
- **academia_threads**: Main thread records with student info
- **academia_topics**: 5 academic topic descriptions per thread
- **academia_chunks**: Top 10 relevant content chunks per thread

## Environment Variables

- `LOG_LEVEL`: Logging level (DEBUG, INFO, WARN, ERROR)
- `NODE_ENV`: Environment (production, staging, dev)

## AWS Parameter Store Keys

Required parameters:
- `/spool/openai-api-key`: OpenAI API key
- `/spool/pinecone-api-key`: Pinecone API key  
- `/spool/prod/rds/host`: RDS hostname
- `/spool/prod/rds/port`: RDS port
- `/spool/prod/rds/database`: Database name
- `/spool/prod/rds/username`: Database username
- `/spool/prod/rds/password`: Database password

## Deployment

### Prerequisites
- AWS CLI configured
- SAM CLI installed
- Node.js 18.x
- AWS permissions for Lambda, API Gateway, Parameter Store, RDS

### Deploy to AWS:
```bash
cd lambda/AcademiaSearch
chmod +x deploy.sh
./deploy.sh prod
```

### Manual deployment:
```bash
npm install
npm run build
sam deploy --guided
```

## Testing

### Run unit tests:
```bash
npm test
```

### Run with coverage:
```bash
npm run test:coverage
```

### Integration testing:
```bash
# Deploy to staging first
./deploy.sh staging

# Test the deployed endpoint
curl -X POST "https://your-api-id.execute-api.us-east-1.amazonaws.com/staging/api/academia-search/create-thread" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How do computers understand human language?",
    "studentId": "test-student",
    "studentProfile": {
      "interests": [{"interest": "Computer Science", "category": "career", "strength": 9}],
      "firstName": "Test",
      "grade": "12"
    }
  }'
```

## Performance

- **Cold start**: ~2-3 seconds
- **Warm execution**: ~5-10 seconds  
- **Memory**: 512MB
- **Timeout**: 30 seconds
- **Concurrent executions**: 10 (configurable)

## Monitoring

### CloudWatch Logs:
- `/aws/lambda/AcademiaSearch-prod`

### Metrics:
- Invocation count
- Duration  
- Error rate
- Success rate

### Custom metrics:
- OpenAI API latency
- Pinecone search latency
- Database operation latency

## Troubleshooting

### Common Issues:

1. **OpenAI API errors**:
   - Check API key in Parameter Store
   - Verify rate limits
   - Check network connectivity

2. **Pinecone connection failures**:
   - Verify API key and index name
   - Check index exists and is ready
   - Verify dimensions match (1536 for text-embedding-ada-002)

3. **Database connection issues**:
   - Check RDS instance status
   - Verify security group allows Lambda access
   - Confirm credentials in Parameter Store

4. **Cold start timeouts**:
   - Increase memory allocation
   - Implement connection pooling
   - Use provisioned concurrency for high-traffic

### Logs Analysis:
```bash
# Get recent logs
aws logs filter-log-events \
  --log-group-name "/aws/lambda/AcademiaSearch-prod" \
  --start-time $(date -d "1 hour ago" +%s)000

# Search for errors
aws logs filter-log-events \
  --log-group-name "/aws/lambda/AcademiaSearch-prod" \
  --filter-pattern "ERROR"
```

## Security

- API keys stored in AWS Parameter Store with encryption
- Database credentials managed through Parameter Store
- RDS connections use SSL/TLS
- Lambda execution role follows least privilege principle
- CORS configured for specific origins only

## Cost Optimization

- Memory optimized for typical workloads (512MB)
- Short timeout to prevent runaway executions
- Connection pooling for database efficiency
- Efficient Pinecone queries (top-k limiting)

## Future Enhancements

- [ ] Caching layer for repeated queries
- [ ] Multi-language support
- [ ] Advanced personalization based on learning history
- [ ] Real-time streaming responses
- [ ] A/B testing framework for different models