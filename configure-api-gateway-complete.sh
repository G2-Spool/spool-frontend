#!/bin/bash

# Complete API Gateway configuration for Spool thread endpoints
# This script adds CORS support and proper authorization

API_ID="alj6xppcj6"
REGION="us-east-1"
ACCOUNT_ID="560281064968"
STAGE="prod"
COGNITO_USER_POOL_ID="us-east-1_H7Kti5MPI"

echo "🚀 Starting complete API Gateway configuration..."

# Function to add CORS configuration with proper headers
configure_cors() {
    local resource_id=$1
    local path=$2
    
    echo "📝 Configuring CORS for $path"
    
    # Add OPTIONS method
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --authorization-type NONE \
        --region $REGION \
        2>/dev/null || echo "OPTIONS method already exists"
    
    # Add mock integration for OPTIONS
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --type MOCK \
        --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
        --region $REGION \
        2>/dev/null || echo "OPTIONS integration already exists"
    
    # Add method response for OPTIONS
    aws apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --status-code 200 \
        --response-models '{"application/json": "Empty"}' \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Origin":false,"method.response.header.Access-Control-Allow-Credentials":false}' \
        --region $REGION \
        2>/dev/null || echo "OPTIONS method response already exists"
    
    # Add integration response for OPTIONS
    aws apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method OPTIONS \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'","method.response.header.Access-Control-Allow-Credentials":"'"'"'true'"'"'"}' \
        --response-templates '{"application/json": ""}' \
        --region $REGION \
        2>/dev/null || echo "OPTIONS integration response already exists"
}

# Function to update method with Cognito authorization
update_method_auth() {
    local resource_id=$1
    local http_method=$2
    local path=$3
    
    echo "🔐 Updating authorization for $http_method $path"
    
    # Create Cognito authorizer if it doesn't exist
    AUTHORIZER_ID=$(aws apigateway get-authorizers \
        --rest-api-id $API_ID \
        --region $REGION \
        --query "items[?name=='CognitoAuthorizer'].id | [0]" \
        --output text)
    
    if [ "$AUTHORIZER_ID" == "None" ] || [ -z "$AUTHORIZER_ID" ]; then
        echo "Creating Cognito authorizer..."
        AUTHORIZER_ID=$(aws apigateway create-authorizer \
            --rest-api-id $API_ID \
            --name CognitoAuthorizer \
            --type COGNITO_USER_POOLS \
            --provider-arns "arn:aws:cognito-idp:$REGION:$ACCOUNT_ID:userpool/$COGNITO_USER_POOL_ID" \
            --identity-source 'method.request.header.Authorization' \
            --region $REGION \
            --query 'id' \
            --output text)
        echo "Created authorizer: $AUTHORIZER_ID"
    fi
    
    # Update method to use Cognito authorization
    aws apigateway update-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $http_method \
        --patch-operations \
            op=replace,path=/authorizationType,value=COGNITO_USER_POOLS \
            op=replace,path=/authorizerId,value=$AUTHORIZER_ID \
        --region $REGION \
        2>/dev/null || echo "Method authorization already configured"
}

# Function to add CORS headers to method response
add_cors_to_method() {
    local resource_id=$1
    local http_method=$2
    local path=$3
    
    echo "🌐 Adding CORS headers to $http_method $path response"
    
    # Add method response with CORS headers
    aws apigateway put-method-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $http_method \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin":false,"method.response.header.Access-Control-Allow-Credentials":false}' \
        --region $REGION \
        2>/dev/null || echo "Method response already exists"
    
    # Update integration response to include CORS headers
    aws apigateway put-integration-response \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $http_method \
        --status-code 200 \
        --response-parameters '{"method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'","method.response.header.Access-Control-Allow-Credentials":"'"'"'true'"'"'"}' \
        --region $REGION \
        2>/dev/null || echo "Integration response already exists"
}

# Function to add missing resources
create_resource_if_missing() {
    local parent_id=$1
    local path_part=$2
    
    # Check if resource exists
    RESOURCE_ID=$(aws apigateway get-resources \
        --rest-api-id $API_ID \
        --region $REGION \
        --query "items[?parentId=='$parent_id' && pathPart=='$path_part'].id | [0]" \
        --output text)
    
    if [ "$RESOURCE_ID" == "None" ] || [ -z "$RESOURCE_ID" ]; then
        echo "Creating resource: $path_part"
        RESOURCE_ID=$(aws apigateway create-resource \
            --rest-api-id $API_ID \
            --parent-id $parent_id \
            --path-part $path_part \
            --region $REGION \
            --query 'id' \
            --output text)
    fi
    
    echo $RESOURCE_ID
}

# 1. Configure /api/thread endpoint
echo "
=== Configuring /api/thread ==="
configure_cors "633f8s" "/api/thread"

# Add POST method for creating threads
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id 633f8s \
    --http-method POST \
    --authorization-type COGNITO_USER_POOLS \
    --authorizer-id $(aws apigateway get-authorizers --rest-api-id $API_ID --region $REGION --query "items[?name=='CognitoAuthorizer'].id | [0]" --output text) \
    --region $REGION \
    2>/dev/null || echo "POST method already exists"

# Add Lambda integration for POST
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id 633f8s \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:spool-create-thread/invocations" \
    --region $REGION \
    2>/dev/null || echo "POST integration already exists"

add_cors_to_method "633f8s" "POST" "/api/thread"

# Add GET method for listing threads
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id 633f8s \
    --http-method GET \
    --authorization-type COGNITO_USER_POOLS \
    --authorizer-id $(aws apigateway get-authorizers --rest-api-id $API_ID --region $REGION --query "items[?name=='CognitoAuthorizer'].id | [0]" --output text) \
    --region $REGION \
    2>/dev/null || echo "GET method already exists"

# Add Lambda integration for GET
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id 633f8s \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:spool-create-thread/invocations" \
    --region $REGION \
    2>/dev/null || echo "GET integration already exists"

add_cors_to_method "633f8s" "GET" "/api/thread"

# 2. Configure /api/thread/{threadId} endpoint
echo "
=== Configuring /api/thread/{threadId} ==="
configure_cors "fn1i1p" "/api/thread/{threadId}"

# Add GET method
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id fn1i1p \
    --http-method GET \
    --authorization-type COGNITO_USER_POOLS \
    --authorizer-id $(aws apigateway get-authorizers --rest-api-id $API_ID --region $REGION --query "items[?name=='CognitoAuthorizer'].id | [0]" --output text) \
    --request-parameters '{"method.request.path.threadId":true}' \
    --region $REGION \
    2>/dev/null || echo "GET method already exists"

aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id fn1i1p \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:spool-create-thread/invocations" \
    --region $REGION \
    2>/dev/null || echo "GET integration already exists"

add_cors_to_method "fn1i1p" "GET" "/api/thread/{threadId}"

# 3. Configure /api/thread/{threadId}/graph endpoint
echo "
=== Configuring /api/thread/{threadId}/graph ==="
configure_cors "bkpzmq" "/api/thread/{threadId}/graph"

# Update GET method authorization
update_method_auth "bkpzmq" "GET" "/api/thread/{threadId}/graph"
add_cors_to_method "bkpzmq" "GET" "/api/thread/{threadId}/graph"

# 4. Add Lambda permissions for all integrations
echo "
=== Adding Lambda permissions ==="

# Permissions for spool-create-thread
aws lambda add-permission \
    --function-name spool-create-thread \
    --statement-id "apigateway-thread-post" \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/POST/api/thread" \
    --region $REGION 2>/dev/null || true

aws lambda add-permission \
    --function-name spool-create-thread \
    --statement-id "apigateway-thread-get" \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/GET/api/thread" \
    --region $REGION 2>/dev/null || true

aws lambda add-permission \
    --function-name spool-create-thread \
    --statement-id "apigateway-thread-id-get" \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/GET/api/thread/{threadId}" \
    --region $REGION 2>/dev/null || true

# Permission for spool-thread-graph-api
aws lambda add-permission \
    --function-name spool-thread-graph-api \
    --statement-id "apigateway-graph-get" \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/GET/api/thread/{threadId}/graph" \
    --region $REGION 2>/dev/null || true

# 5. Create additional thread endpoints that might be missing
echo "
=== Creating additional thread endpoints ==="

# Create /list endpoint under /thread
LIST_RESOURCE_ID=$(create_resource_if_missing "633f8s" "list")
if [ ! -z "$LIST_RESOURCE_ID" ] && [ "$LIST_RESOURCE_ID" != "None" ]; then
    configure_cors "$LIST_RESOURCE_ID" "/api/thread/list"
    
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $LIST_RESOURCE_ID \
        --http-method GET \
        --authorization-type COGNITO_USER_POOLS \
        --authorizer-id $(aws apigateway get-authorizers --rest-api-id $API_ID --region $REGION --query "items[?name=='CognitoAuthorizer'].id | [0]" --output text) \
        --region $REGION \
        2>/dev/null || echo "GET method already exists"
    
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $LIST_RESOURCE_ID \
        --http-method GET \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:spool-create-thread/invocations" \
        --region $REGION \
        2>/dev/null || echo "GET integration already exists"
    
    add_cors_to_method "$LIST_RESOURCE_ID" "GET" "/api/thread/list"
fi

# Create /connection/test endpoint under /thread
CONNECTION_RESOURCE_ID=$(create_resource_if_missing "633f8s" "connection")
if [ ! -z "$CONNECTION_RESOURCE_ID" ] && [ "$CONNECTION_RESOURCE_ID" != "None" ]; then
    TEST_RESOURCE_ID=$(create_resource_if_missing "$CONNECTION_RESOURCE_ID" "test")
    if [ ! -z "$TEST_RESOURCE_ID" ] && [ "$TEST_RESOURCE_ID" != "None" ]; then
        configure_cors "$TEST_RESOURCE_ID" "/api/thread/connection/test"
        
        aws apigateway put-method \
            --rest-api-id $API_ID \
            --resource-id $TEST_RESOURCE_ID \
            --http-method GET \
            --authorization-type NONE \
            --region $REGION \
            2>/dev/null || echo "GET method already exists"
        
        aws apigateway put-integration \
            --rest-api-id $API_ID \
            --resource-id $TEST_RESOURCE_ID \
            --http-method GET \
            --type AWS_PROXY \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:spool-create-thread/invocations" \
            --region $REGION \
            2>/dev/null || echo "GET integration already exists"
        
        add_cors_to_method "$TEST_RESOURCE_ID" "GET" "/api/thread/connection/test"
    fi
fi

# 6. Deploy the API
echo "
=== Deploying API changes ==="
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --description "Configure thread endpoints with CORS and proper authorization" \
    --region $REGION \
    --query 'id' \
    --output text)

echo "✅ Deployment created: $DEPLOYMENT_ID"

# 7. Verify the deployment
echo "
=== Verifying deployment ==="
echo "🔗 API endpoint: https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE"

# Test the endpoints
echo "
Testing endpoints..."
echo "GET /api/thread/connection/test"
curl -s -o /dev/null -w "%{http_code}" "https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/api/thread/connection/test" || echo " (This may fail without proper Lambda implementation)"

echo "
✅ API Gateway configuration complete!"
echo "
Next steps:"
echo "1. Ensure your Lambda functions handle the requests properly"
echo "2. Update your frontend to include Authorization headers with Cognito tokens"
echo "3. Test CORS by making requests from your frontend application" 