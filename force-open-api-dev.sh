#!/bin/bash

# Force open API Gateway for development - removes ALL authentication
# WARNING: EXTREMELY INSECURE - DEVELOPMENT ONLY!

API_ID="alj6xppcj6"
REGION="us-east-1"
STAGE="prod"

echo "🚨 FORCEFULLY REMOVING ALL API GATEWAY AUTHENTICATION!"
echo "⚠️  This is ONLY for development and is EXTREMELY INSECURE!"
echo ""

# First, let's check what methods have authorization
echo "📋 Checking current authorization status..."
echo ""

# Function to force remove authorization
force_remove_auth() {
    local resource_id=$1
    local method=$2
    local path=$3
    
    echo "🔓 Removing auth from $method $path (resource: $resource_id)"
    
    # Delete the method entirely
    aws apigateway delete-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $method \
        --region $REGION \
        2>&1 | grep -v "NotFoundException" || true
    
    # Recreate without authorization
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $method \
        --authorization-type NONE \
        --region $REGION \
        2>&1 | grep -v "ConflictException" || true
    
    # Re-add the Lambda integration
    if [[ "$path" == *"graph"* ]]; then
        LAMBDA_ARN="arn:aws:lambda:$REGION:560281064968:function:spool-thread-graph-api"
    else
        LAMBDA_ARN="arn:aws:lambda:$REGION:560281064968:function:spool-create-thread"
    fi
    
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $method \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$LAMBDA_ARN/invocations" \
        --region $REGION \
        2>&1 | grep -v "ConflictException" || true
}

# Remove auth from all thread endpoints
echo "🔧 Removing authentication from thread endpoints..."
force_remove_auth "633f8s" "GET" "/api/thread"
force_remove_auth "633f8s" "POST" "/api/thread"
force_remove_auth "3vnuq8" "GET" "/api/thread/list"
force_remove_auth "fn1i1p" "GET" "/api/thread/{threadId}"
force_remove_auth "bkpzmq" "GET" "/api/thread/{threadId}/graph"

# Deploy immediately
echo ""
echo "🚀 Deploying changes..."
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --description "DEVELOPMENT ONLY - No auth, open CORS" \
    --region $REGION \
    --query 'id' \
    --output text)

echo "✅ Deployment completed: $DEPLOYMENT_ID"

# Wait a moment for deployment
echo "⏳ Waiting for deployment to propagate..."
sleep 5

# Test the endpoints
echo ""
echo "🧪 Testing endpoints without authentication..."
echo ""

echo "1. Testing /api/thread/{threadId}/graph:"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    "https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/api/thread/test-123/graph" \
    -H "Origin: http://localhost:5173")
STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "   Status: $STATUS"
if [[ "$STATUS" == "200" ]]; then
    echo "   ✅ Success! Endpoint is accessible without auth"
    echo "$RESPONSE" | grep -i "access-control" || echo "   ⚠️  But no CORS headers found"
else
    echo "   ❌ Still getting authentication error"
fi

echo ""
echo "2. Testing /api/thread/list:"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    "https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/api/thread/list" \
    -H "Origin: http://localhost:5173")
STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
echo "   Status: $STATUS"

echo ""
echo "📝 IMPORTANT NOTES:"
echo "1. The API Gateway no longer requires authentication"
echo "2. Lambda functions still need to return CORS headers"
echo "3. If you're still getting CORS errors, the Lambda functions need updating"
echo "4. This configuration is EXTREMELY INSECURE"
echo ""
echo "🔐 To restore security later:"
echo "   ./configure-api-gateway-complete.sh" 