#!/bin/bash

echo "Testing CORS on both API Gateways..."
echo ""

echo "=== Testing spool-api (alj6xppcj6) ==="
echo "Thread connection test endpoint:"
curl -X OPTIONS -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: authorization,content-type" -I https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread/connection/test 2>/dev/null | grep -i "access-control"

echo ""
echo "=== Testing academia-search-api (1nnruhxb5d) ==="
echo "Thread connection test endpoint:"
curl -X OPTIONS -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: authorization,content-type" -I https://1nnruhxb5d.execute-api.us-east-1.amazonaws.com/prod/api/thread/connection/test 2>/dev/null | grep -i "access-control"

echo ""
echo "=== Testing GET requests with auth ==="
echo "spool-api thread list:"
curl -X GET -H "Authorization: Bearer test" https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread/list 2>/dev/null | head -c 200

echo ""
echo ""
echo "academia-search-api thread list:"
curl -X GET -H "Authorization: Bearer test" https://1nnruhxb5d.execute-api.us-east-1.amazonaws.com/prod/api/thread/list 2>/dev/null | head -c 200