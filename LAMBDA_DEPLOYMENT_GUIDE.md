# CreateThread Lambda Deployment Guide

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Switch between users as needed:
   - **InfraBot**: For IAM roles and DynamoDB table creation
   - **ShpoolBot**: For Lambda deployment and API Gateway updates

## Step 1: Deploy Infrastructure (Use InfraBot)

```bash
# Navigate to Lambda directory
cd /workspaces/spool-frontend/lambda/createThread

# Create IAM role for Lambda execution
./scripts/create-iam-role.sh

# Create DynamoDB table for threads (temporary storage)
./scripts/create-dynamodb-table.sh
```

## Step 2: Configure RDS Connection

Since the Lambda needs to connect to RDS within VPC, update the environment variables:

```bash
# Add RDS connection parameters to Systems Manager Parameter Store
aws ssm put-parameter \
  --name "/spool/prod/rds/host" \
  --value "YOUR_RDS_ENDPOINT" \
  --type "SecureString" \
  --overwrite

aws ssm put-parameter \
  --name "/spool/prod/rds/database" \
  --value "spool_db" \
  --type "SecureString" \
  --overwrite

aws ssm put-parameter \
  --name "/spool/prod/rds/username" \
  --value "spool_admin" \
  --type "SecureString" \
  --overwrite

aws ssm put-parameter \
  --name "/spool/prod/rds/password" \
  --value "YOUR_RDS_PASSWORD" \
  --type "SecureString" \
  --overwrite
```

## Step 3: Deploy Lambda Function (Use ShpoolBot)

```bash
# Deploy Lambda with VPC configuration
./scripts/deploy-with-vpc.sh

# Or if VPC is not yet configured, use basic deployment
./scripts/deploy.sh
```

## Step 4: Update API Gateway

Add the Lambda routes to the existing API Gateway:

```bash
# Get the Lambda ARN
LAMBDA_ARN=$(aws lambda get-function --function-name spool-create-thread --query 'Configuration.FunctionArn' --output text)

# Add routes to API Gateway (replace with your API Gateway ID)
API_ID="alj6xppcj6"

# Create Lambda integration
aws apigatewayv2 create-integration \
  --api-id $API_ID \
  --integration-type AWS_PROXY \
  --integration-uri $LAMBDA_ARN \
  --payload-format-version 2.0 \
  --connection-type INTERNET

# Create routes
aws apigatewayv2 create-route \
  --api-id $API_ID \
  --route-key "POST /api/thread/create" \
  --target "integrations/INTEGRATION_ID"

# Add other routes as needed...
```

## Step 5: Update Interview Service Integration

The spool-interview-service needs to invoke the Lambda when in thread mode. Add this code to the interview service:

```javascript
// In spool-interview-service
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const lambda = new LambdaClient({ region: "us-east-1" });

async function createThreadFromInterview(sessionData) {
  // When interview completes in thread mode
  if (sessionData.mode === 'thread') {
    const command = new InvokeCommand({
      FunctionName: 'spool-create-thread',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        httpMethod: 'POST',
        path: '/create',
        body: JSON.stringify({
          userId: sessionData.studentId,
          title: extractTitleFromConversation(sessionData.messages),
          description: sessionData.conversationSummary,
          interests: sessionData.extractedInterests,
          concepts: sessionData.identifiedConcepts,
          status: 'active'
        })
      })
    });

    try {
      const response = await lambda.send(command);
      const result = JSON.parse(Buffer.from(response.Payload).toString());
      return JSON.parse(result.body);
    } catch (error) {
      console.error('Failed to create thread via Lambda:', error);
      throw error;
    }
  }
}
```

## Step 6: Test the Integration

```bash
# Test Lambda directly
./scripts/test-lambda.sh

# Test through API Gateway
curl -X POST https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread/create \
  -H "Authorization: Bearer YOUR_COGNITO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Thread",
    "description": "Testing Lambda deployment",
    "interests": ["math", "physics"],
    "concepts": ["calculus", "mechanics"]
  }'
```

## Step 7: Monitor and Debug

1. Check CloudWatch Logs:
```bash
aws logs tail /aws/lambda/spool-create-thread --follow
```

2. Monitor Lambda metrics:
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=spool-create-thread \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum
```

## Troubleshooting

### Common Issues:

1. **Lambda timeout**: Increase timeout in deploy script if RDS connection is slow
2. **VPC connectivity**: Ensure Lambda is in same VPC as RDS with proper security groups
3. **IAM permissions**: Lambda role needs access to RDS, SSM, and CloudWatch
4. **Cold starts**: Consider reserved concurrency for better performance

### Debug Commands:

```bash
# Check Lambda configuration
aws lambda get-function --function-name spool-create-thread

# Test Lambda invocation
aws lambda invoke \
  --function-name spool-create-thread \
  --payload '{"httpMethod":"GET","path":"/health"}' \
  response.json

# Check execution role permissions
aws iam get-role-policy --role-name spool-lambda-execution-role --policy-name LambdaExecutionPolicy
```

## Next Steps

1. Configure CloudWatch alarms for Lambda errors
2. Set up X-Ray tracing for end-to-end visibility
3. Implement caching for database connections
4. Add comprehensive logging for debugging
5. Create dashboards for monitoring thread creation metrics