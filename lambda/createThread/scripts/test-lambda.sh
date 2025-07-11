#!/bin/bash

# Script to test the CreateThread Lambda function

set -e

FUNCTION_NAME="spool-create-thread"
REGION="us-east-1"

echo "Testing CreateThread Lambda function..."

# Test event for creating a learning path
cat > test-event.json <<EOF
{
  "httpMethod": "POST",
  "path": "/api/thread/create",
  "headers": {
    "Content-Type": "application/json"
  },
  "requestContext": {
    "authorizer": {
      "claims": {
        "sub": "test-user-123",
        "email": "test@example.com",
        "cognito:groups": ["students"]
      }
    }
  },
  "body": "{\"subject\":\"Math\",\"textbookId\":\"550e8400-e29b-41d4-a716-446655440000\",\"conceptsTotal\":50,\"dailyTargetMinutes\":45}"
}
EOF

echo "Invoking Lambda function with test event..."
aws lambda invoke \
    --function-name $FUNCTION_NAME \
    --payload file://test-event.json \
    --cli-binary-format raw-in-base64-out \
    --region $REGION \
    response.json

echo ""
echo "Lambda response:"
cat response.json | jq .

# Clean up
rm -f test-event.json response.json

echo ""
echo "Test completed!"