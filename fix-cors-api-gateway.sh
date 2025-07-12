#!/bin/bash

# Fix CORS configuration on API Gateway with proper response templates

API_ID="alj6xppcj6"
REGION="us-east-1"
ACCOUNT_ID="560281064968"
STAGE="prod"

echo "🔧 Fixing CORS configuration on API Gateway..."

# Function to properly configure CORS for OPTIONS method
fix_cors_options() {
    local resource_id=$1
    local path=$2
    
    echo "🛠️  Fixing CORS for OPTIONS $path"
    
    # Delete existing OPTIONS method if it exists
    aws apigateway delete-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --region $REGION \
        2>/dev/null || true
    
    # Create OPTIONS method
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --authorization-type NONE \
        --region $REGION
    
    # Create method response
    aws apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --status-code 200 \
        --response-models '{"application/json": "Empty"}' \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Headers": false,
            "method.response.header.Access-Control-Allow-Methods": false,
            "method.response.header.Access-Control-Allow-Origin": false,
            "method.response.header.Access-Control-Allow-Credentials": false
        }' \
        --region $REGION
    
    # Create integration
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --type MOCK \
        --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
        --region $REGION
    
    # Create integration response with actual CORS headers
    aws apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --status-code 200 \
        --selection-pattern "" \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Headers": "'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'"'"'",
            "method.response.header.Access-Control-Allow-Methods": "'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'",
            "method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'",
            "method.response.header.Access-Control-Allow-Credentials": "'"'"'true'"'"'"
        }' \
        --response-templates '{"application/json": ""}' \
        --region $REGION
}

# Function to enable CORS on actual methods
enable_cors_on_method() {
    local resource_id=$1
    local http_method=$2
    local path=$3
    
    echo "🌐 Enabling CORS for $http_method $path"
    
    # Check if Lambda proxy integration exists
    integration_type=$(aws apigateway get-integration \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $http_method \
        --region $REGION \
        --query 'type' \
        --output text 2>/dev/null || echo "NONE")
    
    if [ "$integration_type" == "AWS_PROXY" ]; then
        echo "⚠️  Lambda proxy integration detected - CORS must be handled in Lambda function"
        echo "   Adding Gateway-level CORS as fallback..."
    fi
    
    # Update method response to include CORS headers
    aws apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $http_method \
        --status-code 200 \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Origin": false,
            "method.response.header.Access-Control-Allow-Credentials": false,
            "method.response.header.Access-Control-Allow-Headers": false,
            "method.response.header.Access-Control-Allow-Methods": false
        }' \
        --region $REGION \
        2>/dev/null || true
}

# Configure each endpoint
echo "
=== Fixing /api/thread ==="
fix_cors_options "633f8s" "/api/thread"
enable_cors_on_method "633f8s" "GET" "/api/thread"
enable_cors_on_method "633f8s" "POST" "/api/thread"

echo "
=== Fixing /api/thread/{threadId} ==="
fix_cors_options "fn1i1p" "/api/thread/{threadId}"
enable_cors_on_method "fn1i1p" "GET" "/api/thread/{threadId}"

echo "
=== Fixing /api/thread/{threadId}/graph ==="
fix_cors_options "bkpzmq" "/api/thread/{threadId}/graph"
enable_cors_on_method "bkpzmq" "GET" "/api/thread/{threadId}/graph"

echo "
=== Fixing /api/thread/list ==="
fix_cors_options "3vnuq8" "/api/thread/list"
enable_cors_on_method "3vnuq8" "GET" "/api/thread/list"

# Deploy changes
echo "
=== Deploying CORS fixes ==="
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --description "Fix CORS configuration" \
    --region $REGION \
    --query 'id' \
    --output text)

echo "✅ Deployment created: $DEPLOYMENT_ID"

# Important note about Lambda proxy integration
echo "
⚠️  IMPORTANT: Lambda Proxy Integration Note"
echo "================================================"
echo "Your API uses Lambda proxy integration, which means:"
echo "1. The Lambda function MUST return CORS headers in its response"
echo "2. API Gateway CORS configuration is only for OPTIONS preflight"
echo "3. Update your Lambda functions to include:"
echo ""
echo "const response = {"
echo "  statusCode: 200,"
echo "  headers: {"
echo "    'Access-Control-Allow-Origin': '*',"
echo "    'Access-Control-Allow-Credentials': true,"
echo "    'Access-Control-Allow-Headers': 'Content-Type,Authorization',"
echo "    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'"
echo "  },"
echo "  body: JSON.stringify(data)"
echo "};"
echo ""
echo "Without this, CORS will still fail even with API Gateway configuration!" 