#!/bin/bash

# Deployment script for CreateThread Lambda function
# This script uses AWS CLI with ShpoolBot credentials

set -e

echo "Starting deployment of CreateThread Lambda function..."

# Configuration
FUNCTION_NAME="spool-create-thread"
RUNTIME="nodejs18.x"
HANDLER="src/index.handler"
ROLE_ARN="arn:aws:iam::560281064968:role/spool-lambda-execution-role"
TIMEOUT=30
MEMORY_SIZE=256
REGION="us-east-1"

# Environment variables
COGNITO_USER_POOL_ID="us-east-1_H7Kti5MPI"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo "Error: AWS CLI is not configured. Please configure AWS CLI with ShpoolBot credentials."
    exit 1
fi

# Check current user
CURRENT_USER=$(aws sts get-caller-identity --query 'Arn' --output text)
echo "Deploying as: $CURRENT_USER"

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Package the function
echo "Packaging Lambda function..."
rm -f createThread.zip
zip -r createThread.zip . -x "*.git*" "tests/*" "scripts/*" "*.md" "*.json" "!package.json"

# Create or update the Lambda function
echo "Checking if Lambda function exists..."
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION >/dev/null 2>&1; then
    echo "Updating existing Lambda function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://createThread.zip \
        --region $REGION
    
    echo "Updating function configuration..."
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --handler $HANDLER \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --environment Variables="{COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID,AWS_REGION=$REGION}" \
        --region $REGION
else
    echo "Creating new Lambda function..."
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --role $ROLE_ARN \
        --handler $HANDLER \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --zip-file fileb://createThread.zip \
        --environment Variables="{COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID,AWS_REGION=$REGION}" \
        --region $REGION
fi

# Clean up
rm -f createThread.zip

echo "Deployment completed successfully!"
echo "Function ARN: arn:aws:lambda:$REGION:560281064968:function:$FUNCTION_NAME"
echo ""
echo "Next steps:"
echo "1. Create the DynamoDB table: $DYNAMODB_TABLE_NAME"
echo "2. Update API Gateway to route /api/thread/* to this Lambda function"
echo "3. Test the function using the AWS Console or CLI"