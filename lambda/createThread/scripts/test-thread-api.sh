#!/bin/bash

# Test the thread API endpoints directly
API_URL="https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod"

echo "Testing Thread API Endpoints..."

# Test POST /api/thread (should fail with 401 but return CORS headers)
echo -e "\n1️⃣ Testing POST /api/thread:"
curl -X POST "$API_URL/api/thread" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"subject": "Math", "grade": 6}' \
  -v 2>&1 | grep -E "(HTTP/2|access-control|message)"

# Test GET /api/thread/list (should fail with 401 but return CORS headers)
echo -e "\n2️⃣ Testing GET /api/thread/list:"
curl -X GET "$API_URL/api/thread/list" \
  -H "Origin: http://localhost:5173" \
  -v 2>&1 | grep -E "(HTTP/2|access-control|message)"

# Test a simple OPTIONS request
echo -e "\n3️⃣ Testing OPTIONS /api/thread:"
curl -X OPTIONS "$API_URL/api/thread" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -i