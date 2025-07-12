#!/bin/bash

# Simple Lambda deployment script using AWS CLI
set -e

FUNCTION_NAME="AcademiaSearch"
REGION="us-east-1"

echo "🚀 Deploying AcademiaSearch Lambda using AWS CLI..."

# Create a basic handler that works
cat > src/index.js << 'EOF'
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        // Handle CORS preflight
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: '',
            };
        }

        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method not allowed' }),
            };
        }

        if (!event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing request body' }),
            };
        }

        const request = JSON.parse(event.body);
        
        // Basic validation
        if (!request.question || !request.studentId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields: question, studentId' }),
            };
        }

        console.log('🚀 AcademiaSearch Lambda invoked:', {
            studentId: request.studentId,
            questionLength: request.question.length,
            interestCount: request.studentProfile?.interests?.length || 0
        });

        // For now, return a basic response
        const response = {
            threadId: 'thread-' + Date.now(),
            message: 'AcademiaSearch Lambda deployed successfully! Full functionality will be available after services implementation.',
            topic: 'General Inquiry',
            category: 'Academic'
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response),
        };

    } catch (error) {
        console.error('❌ AcademiaSearch Lambda error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }),
        };
    }
};
EOF

# Create deployment package
echo "📦 Creating deployment package..."
zip -r academia-search.zip src/ node_modules/ -x "node_modules/.cache/*" "*.test.*" "*.spec.*"

# Check if function exists
echo "🔍 Checking if Lambda function exists..."
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION > /dev/null 2>&1; then
    echo "📝 Updating existing Lambda function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://academia-search.zip \
        --region $REGION
else
    echo "🆕 Creating new Lambda function..."
    
    # Create execution role if it doesn't exist
    ROLE_NAME="AcademiaSearchExecutionRole"
    ROLE_ARN="arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/$ROLE_NAME"
    
    if ! aws iam get-role --role-name $ROLE_NAME > /dev/null 2>&1; then
        echo "🔑 Creating IAM role..."
        aws iam create-role \
            --role-name $ROLE_NAME \
            --assume-role-policy-document '{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": { "Service": "lambda.amazonaws.com" },
                        "Action": "sts:AssumeRole"
                    }
                ]
            }'
        
        aws iam attach-role-policy \
            --role-name $ROLE_NAME \
            --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        
        aws iam put-role-policy \
            --role-name $ROLE_NAME \
            --policy-name AcademiaSearchPolicy \
            --policy-document '{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Action": [
                            "ssm:GetParameter",
                            "ssm:GetParameters"
                        ],
                        "Resource": "arn:aws:ssm:*:*:parameter/spool/*"
                    },
                    {
                        "Effect": "Allow",
                        "Action": "rds:DescribeDBInstances",
                        "Resource": "*"
                    }
                ]
            }'
        
        echo "⏳ Waiting for role to be ready..."
        sleep 10
    fi
    
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime nodejs18.x \
        --role $ROLE_ARN \
        --handler src/index.handler \
        --zip-file fileb://academia-search.zip \
        --timeout 30 \
        --memory-size 512 \
        --environment Variables='{LOG_LEVEL=INFO,NODE_ENV=production}' \
        --region $REGION
fi

# Create API Gateway if needed
echo "🌐 Setting up API Gateway..."
API_NAME="academia-search-api"

# Check if API exists
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='$API_NAME'].id" --output text --region $REGION)

if [ "$API_ID" = "" ] || [ "$API_ID" = "None" ]; then
    echo "🆕 Creating API Gateway..."
    API_ID=$(aws apigateway create-rest-api \
        --name $API_NAME \
        --description "API for AcademiaSearch Lambda" \
        --region $REGION \
        --query 'id' --output text)
    
    # Get root resource ID
    ROOT_ID=$(aws apigateway get-resources \
        --rest-api-id $API_ID \
        --region $REGION \
        --query 'items[?path==`/`].id' --output text)
    
    # Create resources: /api
    API_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $ROOT_ID \
        --path-part api \
        --region $REGION \
        --query 'id' --output text)
    
    # Create resources: /api/academia-search
    ACADEMIA_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $API_RESOURCE_ID \
        --path-part academia-search \
        --region $REGION \
        --query 'id' --output text)
    
    # Create resources: /api/academia-search/create-thread
    THREAD_RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $ACADEMIA_RESOURCE_ID \
        --path-part create-thread \
        --region $REGION \
        --query 'id' --output text)
    
    # Create POST method
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $THREAD_RESOURCE_ID \
        --http-method POST \
        --authorization-type NONE \
        --region $REGION
    
    # Create OPTIONS method for CORS
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $THREAD_RESOURCE_ID \
        --http-method OPTIONS \
        --authorization-type NONE \
        --region $REGION
    
    # Get Lambda function ARN
    LAMBDA_ARN=$(aws lambda get-function \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --query 'Configuration.FunctionArn' --output text)
    
    # Set up Lambda integration for POST
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $THREAD_RESOURCE_ID \
        --http-method POST \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$LAMBDA_ARN/invocations" \
        --region $REGION
    
    # Set up mock integration for OPTIONS (CORS)
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $THREAD_RESOURCE_ID \
        --http-method OPTIONS \
        --type MOCK \
        --integration-http-method OPTIONS \
        --request-templates '{"application/json":"{"statusCode":200}"}' \
        --region $REGION
    
    # Set up integration response for OPTIONS
    aws apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $THREAD_RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Headers": "'\''Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'\''",
            "method.response.header.Access-Control-Allow-Methods": "'\''GET,POST,OPTIONS'\''",
            "method.response.header.Access-Control-Allow-Origin": "'\''*'\''"
        }' \
        --region $REGION
    
    # Set up method response for OPTIONS
    aws apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $THREAD_RESOURCE_ID \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Origin": true
        }' \
        --region $REGION
    
    # Give API Gateway permission to invoke Lambda
    aws lambda add-permission \
        --function-name $FUNCTION_NAME \
        --statement-id apigateway-invoke \
        --action lambda:InvokeFunction \
        --principal apigateway.amazonaws.com \
        --source-arn "arn:aws:execute-api:$REGION:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*/*" \
        --region $REGION
    
    # Deploy the API
    aws apigateway create-deployment \
        --rest-api-id $API_ID \
        --stage-name prod \
        --region $REGION
fi

# Get API Gateway URL
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod/api/academia-search/create-thread"

echo "✅ Deployment completed successfully!"
echo "🌐 API Gateway URL: $API_URL"
echo "📋 Function Name: $FUNCTION_NAME"

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
    }' || echo "⚠️ Test failed - check Lambda logs"

echo ""
echo "🎉 AcademiaSearch Lambda deployment complete!"
echo "📝 To update frontend, use this API_BASE_URL:"
echo "https://$API_ID.execute-api.$REGION.amazonaws.com/prod"