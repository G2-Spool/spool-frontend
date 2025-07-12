#!/bin/bash

# Test CORS headers on API Gateway endpoints

API_URL="https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod"

echo "🧪 Testing CORS headers on API Gateway endpoints..."
echo "================================================="

# Function to test CORS preflight
test_cors_preflight() {
    local endpoint=$1
    local method=$2
    
    echo ""
    echo "📍 Testing: OPTIONS $endpoint"
    echo "Expected: CORS headers in response"
    
    response=$(curl -s -X OPTIONS \
        -H "Origin: http://localhost:5173" \
        -H "Access-Control-Request-Method: $method" \
        -H "Access-Control-Request-Headers: Authorization,Content-Type" \
        -D - \
        "$API_URL$endpoint" 2>&1)
    
    echo "Response headers:"
    echo "$response" | grep -i "access-control" || echo "❌ No CORS headers found!"
    echo "---"
}

# Function to test actual request
test_cors_request() {
    local endpoint=$1
    local method=$2
    
    echo ""
    echo "📍 Testing: $method $endpoint"
    echo "Expected: 401/403 with CORS headers (since no auth token provided)"
    
    response=$(curl -s -X $method \
        -H "Origin: http://localhost:5173" \
        -H "Content-Type: application/json" \
        -w "\nHTTP Status: %{http_code}" \
        -D - \
        "$API_URL$endpoint" 2>&1)
    
    echo "Response:"
    echo "$response" | grep -E "(HTTP Status:|access-control-allow-origin)" || echo "❌ No CORS headers found!"
    echo "---"
}

# Test thread endpoints
echo "
1️⃣ Testing /api/thread endpoints"
test_cors_preflight "/api/thread" "GET"
test_cors_request "/api/thread" "GET"
test_cors_preflight "/api/thread" "POST"
test_cors_request "/api/thread" "POST"

echo "
2️⃣ Testing /api/thread/list endpoint"
test_cors_preflight "/api/thread/list" "GET"
test_cors_request "/api/thread/list" "GET"

echo "
3️⃣ Testing /api/thread/{threadId}/graph endpoint"
test_cors_preflight "/api/thread/test-thread-123/graph" "GET"
test_cors_request "/api/thread/test-thread-123/graph" "GET"

echo "
4️⃣ Testing /api/thread/connection/test endpoint (no auth required)"
test_cors_preflight "/api/thread/connection/test" "GET"
test_cors_request "/api/thread/connection/test" "GET"

echo "
✅ CORS testing complete!"
echo ""
echo "Expected results:"
echo "- OPTIONS requests should return CORS headers"
echo "- GET/POST requests should return 401/403 with CORS headers"
echo "- /api/thread/connection/test might return different status if Lambda handles it" 