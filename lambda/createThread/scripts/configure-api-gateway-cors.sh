#!/bin/bash

API_ID="alj6xppcj6"
REGION="us-east-1"
ACCOUNT_ID="560281064968"
STAGE="prod"

echo "🔧 Configuring API Gateway for Lambda Proxy Integration with CORS..."

# Function to configure CORS for OPTIONS method
configure_cors_options() {
    local resource_id=$1
    local path=$2
    
    echo "📝 Configuring CORS for OPTIONS $path"
    
    # Delete existing OPTIONS method if exists
    aws apigateway delete-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --region $REGION 2>/dev/null || true
    
    # Create OPTIONS method
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --authorization-type NONE \
        --region $REGION
    
    # Create Lambda proxy integration for OPTIONS
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:spool-create-thread/invocations" \
        --region $REGION
}

# Get resource IDs for our endpoints
echo "🔍 Getting API Gateway resource IDs..."
resources=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION)

# Extract resource IDs (you may need to adjust these based on actual output)
# For now, let's try to get them dynamically
echo "$resources" | jq -r '.items[] | "\(.id) \(.path)"'

# Configure all endpoints (update these resource IDs based on actual values)
# You'll need to replace these with actual resource IDs from the output above
configure_cors_options "633f8s" "/api/thread"
configure_cors_options "fn1i1p" "/api/thread/{threadId}"
configure_cors_options "bkpzmq" "/api/thread/{threadId}/graph"
configure_cors_options "3vnuq8" "/api/thread/list"

# Add Lambda permission for OPTIONS
echo "🔐 Adding Lambda permissions for OPTIONS..."
aws lambda add-permission \
    --function-name spool-create-thread \
    --statement-id "apigateway-options-permission" \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/OPTIONS/*" \
    --region $REGION 2>/dev/null || true

# Deploy changes
echo "🚀 Deploying API Gateway changes..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --description "Configure OPTIONS for Lambda proxy" \
    --region $REGION

echo "✅ API Gateway configuration complete!"