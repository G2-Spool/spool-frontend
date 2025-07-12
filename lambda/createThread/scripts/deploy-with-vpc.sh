#!/bin/bash

# Enhanced deployment script for CreateThread Lambda function with VPC configuration
# This script uses AWS CLI with ShpoolBot credentials

set -e

echo "Starting deployment of CreateThread Lambda function with VPC configuration..."

# Configuration
FUNCTION_NAME="spool-create-thread"
RUNTIME="nodejs18.x"
HANDLER="src/index.handler"
ROLE_ARN="arn:aws:iam::560281064968:role/spool-lambda-execution-role"
TIMEOUT=30
MEMORY_SIZE=256
REGION="us-east-1"

# VPC Configuration (from ECS service)
SUBNET_IDS="subnet-1b789f7d,subnet-0fb16901"
SECURITY_GROUP_ID="sg-b969c293"

# Environment variables
COGNITO_USER_POOL_ID="us-east-1_H7Kti5MPI"
# Get RDS connection string from SSM Parameter Store
echo "Retrieving RDS connection details from SSM Parameter Store..."
DB_HOST=$(aws ssm get-parameter --name "/spool/prod/rds/host" --with-decryption --query "Parameter.Value" --output text --region $REGION 2>/dev/null || echo "")
DB_PORT=$(aws ssm get-parameter --name "/spool/prod/rds/port" --with-decryption --query "Parameter.Value" --output text --region $REGION 2>/dev/null || echo "5432")
DB_NAME=$(aws ssm get-parameter --name "/spool/prod/rds/database" --with-decryption --query "Parameter.Value" --output text --region $REGION 2>/dev/null || echo "")
DB_USER=$(aws ssm get-parameter --name "/spool/prod/rds/username" --with-decryption --query "Parameter.Value" --output text --region $REGION 2>/dev/null || echo "")
DB_PASS=$(aws ssm get-parameter --name "/spool/prod/rds/password" --with-decryption --query "Parameter.Value" --output text --region $REGION 2>/dev/null || echo "")

if [ -n "$DB_HOST" ] && [ -n "$DB_NAME" ] && [ -n "$DB_USER" ] && [ -n "$DB_PASS" ]; then
    DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
    echo "Database connection string constructed successfully"
else
    echo "Warning: Could not retrieve all database parameters from SSM. Lambda will attempt to fetch them at runtime."
    DATABASE_URL=""
fi

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
# Include everything except git, tests, scripts, and markdown files
# But make sure to include node_modules and package.json
zip -r createThread.zip . -x "*.git*" "tests/*" "scripts/*" "*.md" "package-lock.json"

# Create or update the Lambda function
echo "Checking if Lambda function exists..."
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION >/dev/null 2>&1; then
    echo "Updating existing Lambda function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://createThread.zip \
        --region $REGION
    
    echo "Updating function configuration with VPC..."
    if [ -n "$DATABASE_URL" ]; then
        aws lambda update-function-configuration \
            --function-name $FUNCTION_NAME \
            --runtime $RUNTIME \
            --handler $HANDLER \
            --timeout $TIMEOUT \
            --memory-size $MEMORY_SIZE \
            --environment Variables="{COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID,DATABASE_URL=$DATABASE_URL}" \
            --vpc-config SubnetIds=$SUBNET_IDS,SecurityGroupIds=$SECURITY_GROUP_ID \
            --region $REGION
    else
        aws lambda update-function-configuration \
            --function-name $FUNCTION_NAME \
            --runtime $RUNTIME \
            --handler $HANDLER \
            --timeout $TIMEOUT \
            --memory-size $MEMORY_SIZE \
            --environment Variables="{COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID}" \
            --vpc-config SubnetIds=$SUBNET_IDS,SecurityGroupIds=$SECURITY_GROUP_ID \
            --region $REGION
    fi
else
    echo "Creating new Lambda function with VPC configuration..."
    if [ -n "$DATABASE_URL" ]; then
        aws lambda create-function \
            --function-name $FUNCTION_NAME \
            --runtime $RUNTIME \
            --role $ROLE_ARN \
            --handler $HANDLER \
            --timeout $TIMEOUT \
            --memory-size $MEMORY_SIZE \
            --zip-file fileb://createThread.zip \
            --environment Variables="{COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID,DATABASE_URL=$DATABASE_URL}" \
            --vpc-config SubnetIds=$SUBNET_IDS,SecurityGroupIds=$SECURITY_GROUP_ID \
            --region $REGION
    else
        aws lambda create-function \
            --function-name $FUNCTION_NAME \
            --runtime $RUNTIME \
            --role $ROLE_ARN \
            --handler $HANDLER \
            --timeout $TIMEOUT \
            --memory-size $MEMORY_SIZE \
            --zip-file fileb://createThread.zip \
            --environment Variables="{COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID}" \
            --vpc-config SubnetIds=$SUBNET_IDS,SecurityGroupIds=$SECURITY_GROUP_ID \
            --region $REGION
    fi
fi

# Clean up
rm -f createThread.zip

echo "Deployment completed successfully!"
echo "Function ARN: arn:aws:lambda:$REGION:560281064968:function:$FUNCTION_NAME"
echo ""
echo "Important notes:"
echo "- Lambda is now configured with VPC access to connect to RDS"
echo "- Using the same subnets and security group as ECS services"
echo "- RDS connection details will be retrieved from SSM Parameter Store"
echo ""
echo "Next steps:"
echo "1. Update API Gateway to route /api/thread/* to this Lambda function"
echo "2. Test the function using the AWS Console or CLI"