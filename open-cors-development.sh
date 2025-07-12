#!/bin/bash

# Open CORS for ALL endpoints in development mode
# WARNING: This is NOT secure and should only be used for development!

API_ID="alj6xppcj6"
REGION="us-east-1"
ACCOUNT_ID="560281064968"
STAGE="prod"

echo "🚨 WARNING: Opening CORS for ALL endpoints in development mode!"
echo "This configuration is NOT secure for production use!"
echo ""

# Function to configure wide-open CORS for OPTIONS
configure_open_cors() {
    local resource_id=$1
    local path=$2
    
    echo "🔓 Opening CORS for $path"
    
    # Delete existing OPTIONS method
    aws apigateway delete-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --region $REGION \
        2>/dev/null || true
    
    # Create OPTIONS method with no auth
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
            "method.response.header.Access-Control-Allow-Credentials": false,
            "method.response.header.Access-Control-Max-Age": false
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
    
    # Create integration response with wide-open CORS
    aws apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --status-code 200 \
        --selection-pattern "" \
        --response-parameters '{
            "method.response.header.Access-Control-Allow-Headers": "'"'"'*'"'"'",
            "method.response.header.Access-Control-Allow-Methods": "'"'"'*'"'"'",
            "method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'",
            "method.response.header.Access-Control-Allow-Credentials": "'"'"'true'"'"'",
            "method.response.header.Access-Control-Max-Age": "'"'"'86400'"'"'"
        }' \
        --response-templates '{"application/json": ""}' \
        --region $REGION
}

# Get ALL resources in the API
echo "📋 Getting all API resources..."
RESOURCES=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region $REGION \
    --query 'items[?path!=`/`].[id,path]' \
    --output text)

# Configure CORS for each resource
echo ""
echo "🔧 Configuring open CORS for all endpoints..."
while IFS=$'\t' read -r resource_id path; do
    configure_open_cors "$resource_id" "$path"
done <<< "$RESOURCES"

# Also update the root resource
echo ""
echo "🔧 Configuring open CORS for root endpoint..."
ROOT_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region $REGION \
    --query 'items[?path==`/`].id | [0]' \
    --output text)
configure_open_cors "$ROOT_ID" "/"

# Deploy changes
echo ""
echo "🚀 Deploying API changes..."
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --description "Open CORS for development mode" \
    --region $REGION \
    --query 'id' \
    --output text)

echo "✅ Deployment created: $DEPLOYMENT_ID"

# Update Lambda environment variables to ensure they know they're in dev mode
echo ""
echo "📝 Updating Lambda functions for development mode..."

# Update spool-thread-graph-api
aws lambda update-function-configuration \
    --function-name spool-thread-graph-api \
    --environment "Variables={NODE_ENV=development,CORS_ORIGIN='*'}" \
    --region $REGION \
    >/dev/null 2>&1 || echo "Note: Could not update spool-thread-graph-api environment"

# Update spool-create-thread
aws lambda update-function-configuration \
    --function-name spool-create-thread \
    --environment "Variables={COGNITO_USER_POOL_ID=us-east-1_H7Kti5MPI,NODE_ENV=development,CORS_ORIGIN='*'}" \
    --region $REGION \
    >/dev/null 2>&1 || echo "Note: Could not update spool-create-thread environment"

echo ""
echo "✅ CORS is now WIDE OPEN for development!"
echo ""
echo "🔍 Test with:"
echo "curl -X OPTIONS https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/api/thread -v"
echo ""
echo "⚠️  Remember to:"
echo "1. This configuration accepts requests from ANY origin"
echo "2. All headers are allowed"
echo "3. All methods are allowed"
echo "4. Credentials are allowed from any origin"
echo "5. DO NOT use this configuration in production!"
echo ""
echo "🔒 For production, update CORS_ORIGIN to specific domains" 