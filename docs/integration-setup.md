# Spool Integration Setup Guide

This guide explains how to connect the Amplify-hosted frontend to the ECS backend services through API Gateway and Elastic Load Balancer.

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  Amplify        │────▶│  API Gateway     │────▶│  ALB            │
│  Frontend       │     │  (HTTP API)      │     │  (Private)      │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                              ┌────────────────────────────┴───────────────┐
                              │                                            │
                    ┌─────────▼──────────┐                    ┌───────────▼──────────┐
                    │                    │                    │                      │
                    │  Interview        │                    │  Content Service     │
                    │  Service          │                    │  (ECS:8002)          │
                    │  (ECS:8001)        │                    │                      │
                    │                    │                    └──────────────────────┘
                    └────────────────────┘
```

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured
3. Node.js 18+ installed
4. Docker installed (for local testing)
5. CDK CLI installed (`npm install -g aws-cdk`)

## Step 1: Deploy Backend Infrastructure

### 1.1 Deploy ECS Services

```bash
# Navigate to infrastructure directory
cd spool-interview-service/infrastructure/cdk

# Install dependencies
npm install

# Bootstrap CDK (if not already done)
cdk bootstrap

# Deploy the stack
cdk deploy SpoolInterviewInfraStack
```

### 1.2 Note the Outputs

After deployment, note these values from the CDK outputs:
- API Gateway URL: `https://[api-id].execute-api.us-east-1.amazonaws.com`
- ALB DNS Name: `internal-[name].elb.amazonaws.com`
- VPC Link ID: `vpclink-[id]`

## Step 2: Configure API Gateway

### 2.1 API Gateway Routes

The API Gateway should have these routes configured (done via CDK):

```yaml
Routes:
  /api/auth/*:
    integration: http_proxy
    target: http://[alb-dns]/api/auth/$proxy
    
  /api/student-profile/*:
    integration: http_proxy
    target: http://[alb-dns]/api/student-profile/$proxy
    
  /api/interview/*:
    integration: http_proxy
    target: http://[alb-dns]/api/interview/$proxy
    
  /api/content/*:
    integration: http_proxy
    target: http://[alb-dns]/api/content/$proxy
    
  /api/exercise/*:
    integration: http_proxy
    target: http://[alb-dns]/api/exercise/$proxy
    
  /api/progress/*:
    integration: http_proxy
    target: http://[alb-dns]/api/progress/$proxy
```

### 2.2 Configure CORS

Update API Gateway CORS settings:

```json
{
  "AllowOrigins": [
    "http://localhost:5173",
    "https://your-amplify-app.amplifyapp.com"
  ],
  "AllowMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "AllowHeaders": ["*"],
  "ExposeHeaders": ["*"],
  "MaxAge": 86400,
  "AllowCredentials": true
}
```

## Step 3: Configure Cognito

### 3.1 Create User Pool

```bash
# Create Cognito User Pool
aws cognito-idp create-user-pool \
  --pool-name spool-users \
  --auto-verified-attributes email \
  --username-attributes email \
  --schema '[
    {
      "Name": "email",
      "Required": true,
      "Mutable": true
    },
    {
      "Name": "custom:role",
      "AttributeDataType": "String",
      "Mutable": true
    },
    {
      "Name": "custom:organization_id",
      "AttributeDataType": "String",
      "Mutable": true
    }
  ]'
```

### 3.2 Create App Client

```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id [your-pool-id] \
  --client-name spool-web-client \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --supported-identity-providers COGNITO
```

## Step 4: Configure Amplify Frontend

### 4.1 Environment Variables

Create `.env.local` in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=https://[your-api-gateway-id].execute-api.us-east-1.amazonaws.com
VITE_API_GATEWAY_URL=https://[your-api-gateway-id].execute-api.us-east-1.amazonaws.com

# Cognito Configuration
VITE_COGNITO_USER_POOL_ID=[your-user-pool-id]
VITE_COGNITO_CLIENT_ID=[your-client-id]
VITE_COGNITO_IDENTITY_POOL_ID=[your-identity-pool-id]
VITE_AWS_REGION=us-east-1

# Optional Direct Service URLs (for development)
VITE_INTERVIEW_SERVICE_URL=
VITE_TURN_SERVER_URL=turn.spool.education
```

### 4.2 Amplify SSM Parameters

For production deployment, set these SSM parameters:

```bash
# Run the update script
cd spool-frontend
./scripts/update-amplify-ssm-params.sh \
  --app-id [your-amplify-app-id] \
  --branch-name main \
  --api-endpoint https://[your-api-gateway-id].execute-api.us-east-1.amazonaws.com \
  --cognito-region us-east-1 \
  --user-pool-id [your-user-pool-id] \
  --client-id [your-client-id] \
  --identity-pool-id [your-identity-pool-id]
```

### 4.3 Amplify Build Settings

Update `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - echo "VITE_API_BASE_URL=$REACT_APP_API_ENDPOINT" >> .env
        - echo "VITE_COGNITO_USER_POOL_ID=$REACT_APP_COGNITO_USER_POOL_ID" >> .env
        - echo "VITE_COGNITO_CLIENT_ID=$REACT_APP_COGNITO_USER_POOL_CLIENT_ID" >> .env
        - echo "VITE_AWS_REGION=$REACT_APP_COGNITO_REGION" >> .env
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Step 5: Database Setup

### 5.1 Initialize RDS Database

```bash
# Connect to RDS instance
psql -h [rds-endpoint] -U postgres -d spool

# Run schema creation
\i database/schema/init.sql

# Generate mock data for testing
\i database/mock-data/generate-cognito-users.sql
```

### 5.2 Configure Database Connections

Update ECS task environment variables:

```json
{
  "DATABASE_URL": "postgresql://user:pass@[rds-endpoint]:5432/spool",
  "NEO4J_URI": "neo4j+s://[neo4j-endpoint]",
  "NEO4J_USER": "neo4j",
  "NEO4J_PASSWORD": "[password]",
  "PINECONE_API_KEY": "[api-key]",
  "PINECONE_ENVIRONMENT": "us-east-1"
}
```

## Step 6: Testing the Integration

### 6.1 Test API Gateway

```bash
# Test health endpoint
curl https://[api-gateway-url]/api/health

# Test with authentication
curl -H "Authorization: Bearer [cognito-jwt-token]" \
  https://[api-gateway-url]/api/student-profile
```

### 6.2 Test Frontend Connection

1. Start the frontend locally:
```bash
cd spool-frontend
npm run dev
```

2. Open browser console and check:
   - No CORS errors
   - API calls returning 200 status
   - Authentication flow working

### 6.3 End-to-End Test

1. Sign up a new user
2. Complete onboarding flow
3. Verify data in RDS:
```sql
SELECT * FROM users WHERE email = 'test@example.com';
SELECT * FROM student_profiles WHERE user_id = '[user-id]';
```

## Step 7: Onboarding Flow Implementation

### 7.1 User Journey

1. **Sign Up** → Creates Cognito account
2. **First Login** → Redirected to `/onboarding`
3. **Onboarding Steps**:
   - Welcome screen
   - Profile setup (name, grade)
   - Text interview intro
   - Interest discovery
   - Product tour
4. **Completion** → Redirected to dashboard

### 7.2 Backend Endpoints

Ensure these endpoints are available:

```
GET  /api/student-profile - Check if profile exists
PUT  /api/student-profile - Create/update profile
POST /api/student-profile/interests - Save interests
POST /api/interview/start - Begin text interview
POST /api/interview/complete - Finish interview
POST /api/onboarding/complete - Mark onboarding done
```

### 7.3 Frontend Components

Created components:
- `OnboardingWizard.tsx` - Main orchestrator
- `OnboardingWelcome.tsx` - Introduction
- `ProfileSetup.tsx` - Basic info collection
- `TextInterviewIntro.tsx` - Interview preparation
- `InterestDiscovery.tsx` - Interest selection
- `ProductTour.tsx` - Feature walkthrough

## Step 8: Monitoring & Debugging

### 8.1 CloudWatch Logs

Monitor logs for each service:
```bash
# API Gateway logs
aws logs tail /aws/apigateway/[api-id] --follow

# ECS service logs
aws logs tail /ecs/spool-interview --follow
```

### 8.2 Common Issues

1. **CORS Errors**: Check API Gateway CORS configuration
2. **502 Bad Gateway**: Verify ALB target group health
3. **401 Unauthorized**: Check Cognito JWT validation
4. **Connection Refused**: Ensure security groups allow traffic

### 8.3 Health Checks

Each service should expose:
```
GET /health - Basic health check
GET /health/detailed - Detailed status with dependencies
```

## Step 9: Production Checklist

- [ ] SSL certificates configured on ALB
- [ ] API Gateway custom domain set up
- [ ] Cognito domain customized
- [ ] Environment variables secured in SSM
- [ ] Database passwords rotated
- [ ] CloudWatch alarms configured
- [ ] Backup strategy implemented
- [ ] Auto-scaling policies set
- [ ] Security groups minimized
- [ ] API rate limiting enabled

## Troubleshooting

### Frontend Can't Connect to API
1. Check browser console for errors
2. Verify environment variables are set
3. Test API Gateway directly with curl
4. Check CORS headers in response

### Authentication Issues
1. Verify Cognito configuration
2. Check JWT token expiration
3. Ensure user attributes are mapped
4. Test with AWS CLI

### Database Connection Errors
1. Verify RDS security group
2. Check database credentials
3. Test connection from ECS tasks
4. Monitor connection pool usage

## Next Steps

1. Set up CI/CD pipeline
2. Configure monitoring dashboards
3. Implement error tracking (Sentry)
4. Set up automated backups
5. Create runbooks for common issues

For questions or issues, contact the development team or check the project wiki.