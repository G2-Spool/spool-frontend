# CreateThread Lambda Deployment Guide

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Node.js 18+ installed
3. Access to ShpoolBot (for Lambda deployment) or InfraBot (for IAM/DynamoDB setup)

## Deployment Steps

### 1. Create IAM Role (Use InfraBot credentials)

```bash
# Switch to InfraBot credentials
aws configure set aws_access_key_id <INFRABOT_ACCESS_KEY>
aws configure set aws_secret_access_key <INFRABOT_SECRET_KEY>

# Create IAM role
./scripts/create-iam-role.sh
```

### 2. Deploy Lambda Function (Use ShpoolBot credentials)

```bash
# Switch to ShpoolBot credentials
aws configure set aws_access_key_id <SHPOOLBOT_ACCESS_KEY>
aws configure set aws_secret_access_key <SHPOOLBOT_SECRET_KEY>

# Deploy the Lambda function with VPC configuration
./scripts/deploy-with-vpc.sh
```

### 4. Update API Gateway

Add the following routes to the API Gateway configuration:

```yaml
# In api-gateway-stack.ts or CloudFormation template
/api/thread/create:
  POST:
    integration:
      type: AWS_PROXY
      uri: arn:aws:lambda:us-east-1:560281064968:function:spool-create-thread
    authorization: COGNITO_USER_POOLS

/api/thread/{id}:
  GET:
    integration:
      type: AWS_PROXY
      uri: arn:aws:lambda:us-east-1:560281064968:function:spool-create-thread
    authorization: COGNITO_USER_POOLS
  PUT:
    integration:
      type: AWS_PROXY
      uri: arn:aws:lambda:us-east-1:560281064968:function:spool-create-thread
    authorization: COGNITO_USER_POOLS

/api/thread/list/{studentId}:
  GET:
    integration:
      type: AWS_PROXY
      uri: arn:aws:lambda:us-east-1:560281064968:function:spool-create-thread
    authorization: COGNITO_USER_POOLS
```

### 5. Grant API Gateway Permission

```bash
aws lambda add-permission \
    --function-name spool-create-thread \
    --statement-id apigateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:us-east-1:560281064968:alj6xppcj6/*/api/thread/*"
```

### 6. Test the Deployment

```bash
# Test using the provided script
./scripts/test-lambda.sh

# Or test via API Gateway
curl -X POST https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread/create \
  -H "Authorization: Bearer <COGNITO_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Thread",
    "description": "Testing thread creation",
    "interests": ["test"],
    "concepts": ["testing"]
  }'
```

## Environment Variables

The Lambda function uses the following environment variables:

- `DYNAMODB_TABLE_NAME`: Name of the DynamoDB table (default: spool-threads)
- `COGNITO_USER_POOL_ID`: Cognito User Pool ID (us-east-1_H7Kti5MPI)
- `AWS_REGION`: AWS region (us-east-1)

## Monitoring

Check CloudWatch Logs:
- Log Group: `/aws/lambda/spool-create-thread`

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure you're using the correct AWS credentials
2. **Table Not Found**: Run the create-dynamodb-table.sh script
3. **Function Not Found**: Ensure the Lambda was deployed successfully
4. **API Gateway 5xx**: Check Lambda logs in CloudWatch

### Debug Mode

Set the `DEBUG` environment variable to enable verbose logging:

```bash
aws lambda update-function-configuration \
  --function-name spool-create-thread \
  --environment Variables="{DEBUG=true,DYNAMODB_TABLE_NAME=spool-threads,COGNITO_USER_POOL_ID=us-east-1_H7Kti5MPI}"
```