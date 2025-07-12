# API Gateway & Lambda CORS Configuration Guide

## 🚨 Current Issue

The API Gateway is configured correctly, but because we're using **Lambda Proxy Integration**, the CORS headers must be returned by the Lambda functions themselves, not just API Gateway.

## 📋 Summary of Findings

1. **API Gateway Configuration**: ✅ Correctly configured with Cognito authorizer
2. **Lambda Integration**: ✅ Properly connected to Lambda functions
3. **CORS Headers**: ❌ Not being returned because Lambda functions don't include them

## 🔧 Required Lambda Function Updates

### For `spool-thread-graph-api` Lambda

Update the Lambda function to return CORS headers in EVERY response:

```javascript
// At the top of your handler function
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// For successful responses
const successResponse = {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
        // your data here
    })
};

// For error responses
const errorResponse = {
    statusCode: 400,
    headers: corsHeaders,
    body: JSON.stringify({
        error: 'Error message'
    })
};

// Handle OPTIONS requests
if (event.httpMethod === 'OPTIONS') {
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
    };
}
```

### For `spool-create-thread` Lambda

Similarly, update this function to include CORS headers:

```javascript
exports.handler = async (event) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    try {
        // Your existing logic here
        
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(result)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: error.message })
        };
    }
};
```

## 🚀 Quick Fix Steps

1. **Update Lambda Functions**
   ```bash
   # Navigate to your Lambda function code
   cd lambda/threadGraph/src
   # or
   cd lambda/createThread/src
   
   # Edit the handler file to include CORS headers
   ```

2. **Deploy Updated Lambda Functions**
   ```bash
   # For thread graph API
   cd lambda/threadGraph
   zip -r function.zip .
   aws lambda update-function-code \
     --function-name spool-thread-graph-api \
     --zip-file fileb://function.zip \
     --region us-east-1

   # For create thread
   cd lambda/createThread
   zip -r function.zip .
   aws lambda update-function-code \
     --function-name spool-create-thread \
     --zip-file fileb://function.zip \
     --region us-east-1
   ```

## 📊 Testing After Fix

```bash
# Test OPTIONS (preflight)
curl -X OPTIONS https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test actual request (will need auth token)
curl https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread \
  -H "Origin: http://localhost:5173" \
  -H "Authorization: Bearer YOUR_COGNITO_TOKEN" \
  -v
```

## 🔍 Current Lambda Functions Status

| Function | CORS Headers | Handler Location |
|----------|--------------|------------------|
| spool-thread-graph-api | ✅ Has CORS headers in code | src/index.handler |
| spool-create-thread | ❓ Unknown - needs check | src/index.handler |

## ⚡ Alternative: API Gateway CORS (Non-Proxy)

If you want API Gateway to handle CORS instead of Lambda:
1. Change integration type from `AWS_PROXY` to `AWS`
2. Configure request/response mappings
3. Let API Gateway add CORS headers

But this requires significant changes to how Lambda functions work.

## 🎯 Recommended Action

1. **Update Lambda functions** to include CORS headers (easiest)
2. **Test thoroughly** with your frontend application
3. **Consider using environment variables** for allowed origins instead of '*'

## 📝 Frontend Requirements

Ensure your frontend is sending proper headers:

```javascript
// In your API service
const response = await fetch(`${API_URL}/api/thread`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
    }
});
```

## 🔗 Resources

- [AWS Lambda Proxy Integration Response Format](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format)
- [Enabling CORS for Lambda Proxy Integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html#how-to-cors-lambda-proxy)

## ✅ Success Criteria

After implementing these changes:
1. OPTIONS requests return 200 with CORS headers
2. GET/POST requests include CORS headers in response
3. Frontend can successfully call the API without CORS errors
4. Authentication still works correctly with Cognito 