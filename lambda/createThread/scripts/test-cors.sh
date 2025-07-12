#!/bin/bash

API_URL="https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod"
ORIGIN="http://localhost:5173"

echo "🧪 Testing CORS with Lambda Proxy Integration..."

# Test OPTIONS preflight
echo -e "\n1️⃣ Testing OPTIONS preflight request:"
curl -X OPTIONS "$API_URL/api/thread" \
    -H "Origin: $ORIGIN" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Authorization,Content-Type" \
    -v 2>&1 | grep -i "access-control"

# Test actual request (should fail with 401 but include CORS headers)
echo -e "\n2️⃣ Testing GET request without auth:"
curl -X GET "$API_URL/api/thread/list" \
    -H "Origin: $ORIGIN" \
    -H "Content-Type: application/json" \
    -v 2>&1 | grep -i "access-control"

# Test connection endpoint
echo -e "\n3️⃣ Testing connection test endpoint:"
curl -X GET "$API_URL/api/thread/connection/test" \
    -H "Origin: $ORIGIN" \
    -v 2>&1 | grep -E "(access-control|message)"