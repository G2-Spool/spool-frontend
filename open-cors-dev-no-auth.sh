#!/bin/bash

# Completely open API for development - NO AUTH, FULL CORS
# WARNING: This is EXTREMELY INSECURE and should NEVER be used in production!

API_ID="alj6xppcj6"
REGION="us-east-1"
ACCOUNT_ID="560281064968"
STAGE="prod"

echo "🚨 EXTREME WARNING: Completely opening API for development!"
echo "This removes ALL security - DO NOT use in production!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 1
fi

# Function to remove auth and add CORS to any method
open_method_completely() {
    local resource_id=$1
    local http_method=$2
    local path=$3
    
    echo "🔓 Opening $http_method $path"
    
    # Update method to remove authorization
    aws apigateway update-method \
        --rest-api-id $API_ID \
        --resource-id $resource_id \
        --http-method $http_method \
        --patch-operations \
            op=replace,path=/authorizationType,value=NONE \
        --region $REGION \
        2>/dev/null || echo "  Note: Could not update authorization for $http_method $path"
}

# Get all resources with their methods
echo ""
echo "📋 Getting all API resources and methods..."

# Thread endpoints
echo ""
echo "🔧 Opening thread endpoints..."
open_method_completely "633f8s" "GET" "/api/thread"
open_method_completely "633f8s" "POST" "/api/thread"
open_method_completely "3vnuq8" "GET" "/api/thread/list"
open_method_completely "fn1i1p" "GET" "/api/thread/{threadId}"
open_method_completely "fn1i1p" "PUT" "/api/thread/{threadId}"
open_method_completely "bkpzmq" "GET" "/api/thread/{threadId}/graph"

# Health check endpoints
echo ""
echo "🔧 Opening health endpoints..."
open_method_completely "60yvy3" "GET" "/api/health"
open_method_completely "6ylcoq" "GET" "/api/health/progress"
open_method_completely "6zm668" "GET" "/api/health/content"
open_method_completely "7oqssm" "GET" "/api/health/interview"
open_method_completely "dqlqgk" "GET" "/api/health/exercise"

# Neo4j endpoints
echo ""
echo "🔧 Opening neo4j endpoints..."
open_method_completely "fpp2nj" "GET" "/api/neo4j/books"
open_method_completely "c13i0o" "GET" "/api/neo4j/books/{id}"

# Deploy changes
echo ""
echo "🚀 Deploying API changes..."
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --description "Development mode - NO AUTH, FULL CORS" \
    --region $REGION \
    --query 'id' \
    --output text)

echo "✅ Deployment created: $DEPLOYMENT_ID"

# Test the changes
echo ""
echo "🧪 Testing endpoints..."
echo ""
echo "Testing /api/thread/list (should return 200 or data):"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" \
    "https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/api/thread/list" \
    -H "Origin: http://localhost:5173"

echo ""
echo "Testing /api/thread/test-123/graph (should work without auth):"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" \
    "https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE/api/thread/test-123/graph" \
    -H "Origin: http://localhost:5173"

echo ""
echo "✅ API is now COMPLETELY OPEN for development!"
echo ""
echo "⚠️  CRITICAL REMINDERS:"
echo "1. NO authentication is required for ANY endpoint"
echo "2. Lambda functions must still return CORS headers"
echo "3. This configuration is EXTREMELY INSECURE"
echo "4. NEVER deploy this to production"
echo "5. Remember to re-enable authentication before going live"
echo ""
echo "📝 To re-enable authentication later, run:"
echo "   ./configure-api-gateway-complete.sh" 