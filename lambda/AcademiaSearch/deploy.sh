#!/bin/bash

# AcademiaSearch Lambda Deployment Script
set -e

# Configuration
FUNCTION_NAME="AcademiaSearch"
STACK_NAME="academia-search-stack"
ENVIRONMENT=${1:-prod}
REGION="us-east-1"

echo "🚀 Deploying AcademiaSearch Lambda to environment: $ENVIRONMENT"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Validate SAM template
echo "✅ Validating SAM template..."
sam validate --template template.yaml

# Build SAM application
echo "🏗️ Building SAM application..."
sam build --template template.yaml

# Deploy the stack
echo "🚀 Deploying to AWS..."
sam deploy \
    --template-file .aws-sam/build/template.yaml \
    --stack-name "${STACK_NAME}-${ENVIRONMENT}" \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --parameter-overrides Environment=$ENVIRONMENT \
    --region $REGION \
    --no-fail-on-empty-changeset

# Get the API Gateway URL
API_URL=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}-${ENVIRONMENT}" \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`AcademiaSearchApi`].OutputValue' \
    --output text)

echo "✅ Deployment completed successfully!"
echo "🌐 API Gateway URL: $API_URL"

# Test the deployment
echo "🧪 Testing deployment..."
curl -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d '{
        "question": "How do neural networks learn?",
        "studentId": "test-student-123",
        "studentProfile": {
            "interests": [
                {"interest": "Machine Learning", "category": "career", "strength": 8}
            ],
            "firstName": "Test",
            "grade": "12"
        }
    }' || echo "⚠️ Test failed - this is expected if API keys are not properly configured"

echo "🎉 AcademiaSearch Lambda deployment complete!"
echo "📋 Next steps:"
echo "   1. Update frontend API_BASE_URL to: $(echo $API_URL | sed 's|/api/academia-search/create-thread||')"
echo "   2. Ensure Parameter Store has all required API keys"
echo "   3. Test the complete flow from CreateThreadModal.tsx"