# AWS API Gateway Setup Guide

## Overview

This guide explains how to set up and configure AWS API Gateway (managed service) for the Spool platform. The API Gateway provides centralized authentication, routing, and monitoring for all microservices.

## Architecture

```
[React Frontend] → [CloudFront] → [API Gateway] → [Cognito Authorizer] → [ALB] → [ECS Services]
```

## Key Features

### 1. AWS Managed Service Benefits
- **Automatic Scaling**: Handles millions of requests without configuration
- **Built-in Security**: DDoS protection, SSL/TLS termination
- **Native Cognito Integration**: Seamless JWT token validation
- **CloudWatch Monitoring**: Full request logging and metrics
- **Cost Effective**: Pay-per-request pricing (~$3.50/million requests)

### 2. Service Endpoints

All services are accessible through a single API Gateway URL:

```
https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/
├── /interview/*    → Interview Service (Port 8001)
├── /content/*      → Content Service (Port 8002)
├── /exercise/*     → Exercise Service (Port 8003)
├── /progress/*     → Progress Service (Port 8004)
└── /health/*       → Health checks for all services
```

### 3. Authentication Flow

1. **User Login**: Frontend authenticates with Cognito
2. **Token Acquisition**: Cognito returns JWT tokens
3. **API Requests**: Frontend includes JWT in Authorization header
4. **Token Validation**: API Gateway validates JWT with Cognito
5. **Request Forwarding**: Validated requests forwarded to services

## Deployment Instructions

### Prerequisites
- AWS CLI configured with appropriate credentials
- AWS CDK installed (`npm install -g aws-cdk`)
- Node.js 18+ installed
- Docker installed (for building services)

### Step 1: Deploy Infrastructure

```bash
cd spool-infrastructure/scripts
./deploy-api-gateway.sh
```

This script will:
1. Deploy Cognito User Pool and Identity Pool
2. Deploy ECS services and ALB
3. Deploy API Gateway with all routes configured
4. Create frontend `.env.local` file with all endpoints

### Step 2: Verify Deployment

Check the deployment outputs:
```bash
# Get API Gateway URL
aws cloudformation describe-stacks \
  --stack-name ApiGatewayStack \
  --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" \
  --output text

# Test health endpoint
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/health
```

### Step 3: Update Frontend Configuration

The deployment script automatically creates `.env.local` with:
```env
# AWS Cognito Configuration
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_AWS_REGION=us-east-1

# API Configuration
VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/
```

## API Gateway Configuration Details

### CORS Configuration
```typescript
defaultCorsPreflightOptions: {
  allowOrigins: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://app.spool.education',
    'https://spool.education',
  ],
  allowMethods: apigateway.Cors.ALL_METHODS,
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'X-Correlation-ID',
  ],
  allowCredentials: true,
}
```

### Rate Limiting
- **Default**: 1000 requests/second with burst of 2000
- **Monthly Quota**: 100,000 requests per API key
- **Throttling**: Per-client IP address

### Request Transformation
Headers added to backend requests:
- `X-Correlation-ID`: Unique request ID for tracing
- `X-User-ID`: Cognito user sub claim
- `X-User-Email`: User email from JWT

## Service Integration

### Interview Service
Endpoints for text-based interviews:
```
POST /api/interview/start
POST /api/interview/{session_id}/message
GET  /api/interview/{session_id}/status
POST /api/interview/{session_id}/complete
```

### Content Service
```
POST /api/content/upload
GET  /api/content/concepts/{id}
POST /api/content/personalize
GET  /api/content/hooks/{concept_id}
```

### Exercise Service
```
POST /api/exercise/generate
POST /api/exercise/evaluate
GET  /api/exercise/{id}
POST /api/exercise/remediation
```

### Progress Service
```
GET  /api/progress/student/{id}
POST /api/progress/update
GET  /api/progress/reports/{id}
POST /api/progress/achievements
```

## Monitoring and Debugging

### CloudWatch Logs
- **Access Logs**: `/aws/api-gateway/spool-api/access`
- **Execution Logs**: `/aws/api-gateway/spool-api/execution`

### Metrics Dashboard
Monitor in CloudWatch:
- Request count by endpoint
- 4XX/5XX error rates
- Latency percentiles (p50, p90, p99)
- Integration latency to backend services

### X-Ray Tracing
Enable distributed tracing:
```bash
# View traces
aws xray get-trace-summaries \
  --time-range-type LastHour \
  --query "TraceSummaries[?ServiceIds[?Name=='spool-api']]"
```

## Security Best Practices

1. **Token Validation**: All endpoints require valid Cognito JWT
2. **HTTPS Only**: API Gateway enforces SSL/TLS
3. **API Keys**: Optional for external integrations
4. **WAF Integration**: Can add AWS WAF for additional protection
5. **Secrets Management**: All secrets stored in Systems Manager Parameter Store

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify origin is in allowed list
   - Check credentials flag is set
   - Ensure preflight requests work

2. **401 Unauthorized**
   - Check JWT token expiration
   - Verify Cognito User Pool ID matches
   - Ensure Authorization header format: `Bearer <token>`

3. **504 Gateway Timeout**
   - Check backend service health
   - Verify ALB target group health
   - Review integration timeout (29s max)

4. **429 Too Many Requests**
   - Rate limit exceeded
   - Implement exponential backoff
   - Consider requesting limit increase

## Testing

### Manual Testing
```bash
# Get Cognito token (use AWS CLI or Amplify)
TOKEN="your-jwt-token"

# Test authenticated endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/interview/health

# Test interview start
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user"}' \
  https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/interview/start
```

### Load Testing
```bash
# Using Artillery
artillery quick \
  --count 100 \
  --num 10 \
  https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/health
```

## Maintenance

### Updating API Gateway
```bash
# Update CDK code
cd spool-infrastructure/cdk
# Make changes to api-gateway-stack.ts

# Deploy updates
cdk deploy ApiGatewayStack
```

### Adding New Service
1. Update `api-gateway-stack.ts` with new route
2. Add service URL to configuration
3. Deploy with CDK
4. Update frontend environment variables

## Cost Optimization

- **Caching**: Enable API Gateway caching for GET requests
- **Compression**: Enable gzip compression
- **Regional Endpoint**: Use regional vs edge-optimized
- **Reserved Capacity**: Consider for predictable traffic

## Support

For issues or questions:
- Check CloudWatch Logs first
- Review X-Ray traces for request flow
- Contact DevOps team for infrastructure issues
- File issues in GitHub for bugs