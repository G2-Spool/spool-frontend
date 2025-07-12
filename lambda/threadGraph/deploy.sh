#!/bin/bash

# Thread Graph Lambda Deployment Script
# This script deploys the Neo4j Thread Graph API to AWS Lambda

set -e

echo "🚀 Deploying Thread Graph Lambda Function..."

# Configuration
FUNCTION_NAME="spool-thread-graph-api"
REGION="us-east-1"
ROLE_NAME="lambda-thread-graph-role"

# Create IAM role if it doesn't exist
echo "📋 Setting up IAM role..."
ROLE_ARN=""

if aws iam get-role --role-name $ROLE_NAME >/dev/null 2>&1; then
    echo "✅ Role $ROLE_NAME already exists"
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
else
    echo "📝 Creating new role $ROLE_NAME..."
    
    # Create trust policy
    cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

    # Create the role
    ROLE_ARN=$(aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document file://trust-policy.json \
        --query 'Role.Arn' \
        --output text)
    
    # Attach necessary policies
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess
        
    # Wait for role to be available
    echo "⏳ Waiting for role to be available..."
    sleep 10
    
    rm -f trust-policy.json
fi

echo "✅ Role ARN: $ROLE_ARN"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create deployment package
echo "📁 Creating deployment package..."
rm -f threadGraph.zip
zip -r threadGraph.zip src/ node_modules/ package.json

# Deploy or update Lambda function
echo "🚀 Deploying Lambda function..."

if aws lambda get-function --function-name $FUNCTION_NAME >/dev/null 2>&1; then
    echo "🔄 Updating existing function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://threadGraph.zip
        
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --runtime nodejs18.x \
        --handler src/index.handler \
        --timeout 30 \
        --memory-size 512 \
        --environment Variables='{NODE_ENV=production}'
else
    echo "📝 Creating new function..."
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime nodejs18.x \
        --role $ROLE_ARN \
        --handler src/index.handler \
        --zip-file fileb://threadGraph.zip \
        --timeout 30 \
        --memory-size 512 \
        --environment Variables='{NODE_ENV=production}' \
        --description "Neo4j Thread Graph API for Spool Learning Platform"
fi

# Get function ARN
FUNCTION_ARN=$(aws lambda get-function --function-name $FUNCTION_NAME --query 'Configuration.FunctionArn' --output text)
echo "✅ Function ARN: $FUNCTION_ARN"

# Configure API Gateway integration
echo "🌐 Setting up API Gateway integration..."

# Get API Gateway ID
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='spool-api'].id" --output text)

if [ -z "$API_ID" ] || [ "$API_ID" == "None" ]; then
    echo "❌ API Gateway 'spool-api' not found"
    exit 1
fi

echo "✅ API Gateway ID: $API_ID"

# Get root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/'].id" --output text)

# Check if /api resource exists
API_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?pathPart=='api'].id" --output text)

if [ -z "$API_RESOURCE_ID" ] || [ "$API_RESOURCE_ID" == "None" ]; then
    echo "📝 Creating /api resource..."
    API_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $ROOT_RESOURCE_ID \
        --path-part api \
        --query 'id' \
        --output text)
fi

# Check if /thread resource exists under /api
THREAD_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?pathPart=='thread' && parentId=='$API_RESOURCE_ID'].id" --output text)

if [ -z "$THREAD_RESOURCE_ID" ] || [ "$THREAD_RESOURCE_ID" == "None" ]; then
    echo "📝 Creating /thread resource..."
    THREAD_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $API_RESOURCE_ID \
        --path-part thread \
        --query 'id' \
        --output text)
fi

# Create {threadId} resource
THREAD_ID_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?pathPart=='{threadId}' && parentId=='$THREAD_RESOURCE_ID'].id" --output text)

if [ -z "$THREAD_ID_RESOURCE_ID" ] || [ "$THREAD_ID_RESOURCE_ID" == "None" ]; then
    echo "📝 Creating {threadId} resource..."
    THREAD_ID_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $THREAD_RESOURCE_ID \
        --path-part '{threadId}' \
        --query 'id' \
        --output text)
fi

# Create /graph resource
GRAPH_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?pathPart=='graph' && parentId=='$THREAD_ID_RESOURCE_ID'].id" --output text)

if [ -z "$GRAPH_RESOURCE_ID" ] || [ "$GRAPH_RESOURCE_ID" == "None" ]; then
    echo "📝 Creating /graph resource..."
    GRAPH_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $THREAD_ID_RESOURCE_ID \
        --path-part graph \
        --query 'id' \
        --output text)
fi

# Add GET method to /graph resource
echo "🔧 Setting up GET method..."

# Check if GET method exists
if aws apigateway get-method --rest-api-id $API_ID --resource-id $GRAPH_RESOURCE_ID --http-method GET >/dev/null 2>&1; then
    echo "🔄 Updating existing GET method..."
    aws apigateway delete-method --rest-api-id $API_ID --resource-id $GRAPH_RESOURCE_ID --http-method GET
fi

aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $GRAPH_RESOURCE_ID \
    --http-method GET \
    --authorization-type COGNITO_USER_POOLS \
    --authorizer-id $(aws apigateway get-authorizers --rest-api-id $API_ID --query 'items[0].id' --output text) \
    --request-parameters '{
        "method.request.path.threadId": true
    }'

# Add Lambda integration
echo "🔗 Setting up Lambda integration..."
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $GRAPH_RESOURCE_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations

# Add Lambda permission for API Gateway
echo "🔑 Adding Lambda permissions..."
aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id api-gateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$(aws sts get-caller-identity --query Account --output text):$API_ID/*" \
    --output text || echo "Permission already exists"

# Deploy API Gateway
echo "🚀 Deploying API Gateway changes..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --description "Thread Graph API deployment - $(date)"

# Cleanup
rm -f threadGraph.zip

# Output final endpoint URL
ENDPOINT_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod/api/thread/{threadId}/graph"
echo ""
echo "✅ Deployment complete!"
echo "🌐 Thread Graph API Endpoint: $ENDPOINT_URL"
echo "🧪 Test Endpoint: https://$API_ID.execute-api.$REGION.amazonaws.com/prod/api/thread/test"
echo ""
echo "📝 Usage examples:"
echo "  GET $ENDPOINT_URL"
echo "  Replace {threadId} with actual thread ID (e.g., 'thread-123')"
echo ""
echo "🔑 Remember to include Authorization header with Cognito JWT token"