#!/bin/bash

# Deploy Neo4j Books Lambda Function
set -e

FUNCTION_NAME="spool-neo4j-books"
REGION="us-east-1"
RUNTIME="nodejs18.x"
HANDLER="src/index.handler"
TIMEOUT=30
MEMORY_SIZE=256

echo "🚀 Deploying Neo4j Books Lambda Function..."

# Navigate to lambda directory
cd "$(dirname "$0")/.."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create deployment package
echo "📦 Creating deployment package..."
zip -r neo4jBooks.zip . -x "*.git*" -x "scripts/*" -x "tests/*" -x "*.md"

# Check if function exists
FUNCTION_EXISTS=$(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>&1 || true)

if [[ $FUNCTION_EXISTS == *"ResourceNotFoundException"* ]]; then
    echo "🆕 Creating new Lambda function..."
    
    # Get the Lambda execution role ARN
    ROLE_ARN=$(aws iam get-role --role-name lambda-execution-role --query 'Role.Arn' --output text 2>/dev/null || echo "")
    
    if [ -z "$ROLE_ARN" ]; then
        echo "❌ Error: Lambda execution role not found. Please create it first."
        exit 1
    fi
    
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --role $ROLE_ARN \
        --handler $HANDLER \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --zip-file fileb://neo4jBooks.zip \
        --region $REGION
        
    echo "⏳ Waiting for function to be active..."
    aws lambda wait function-active --function-name $FUNCTION_NAME --region $REGION
else
    echo "🔄 Updating existing Lambda function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://neo4jBooks.zip \
        --region $REGION
        
    echo "⏳ Waiting for update to complete..."
    aws lambda wait function-updated --function-name $FUNCTION_NAME --region $REGION
    
    # Update function configuration
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --handler $HANDLER \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --region $REGION
fi

# Add permissions for SSM parameter access
echo "🔐 Updating Lambda permissions for SSM access..."
aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id AllowSSMParameterAccess \
    --action lambda:InvokeFunction \
    --principal ssm.amazonaws.com \
    --region $REGION 2>/dev/null || true

# Clean up
rm -f neo4jBooks.zip

echo "✅ Neo4j Books Lambda deployed successfully!"
echo "📝 Function ARN: $(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION --query 'Configuration.FunctionArn' --output text)"