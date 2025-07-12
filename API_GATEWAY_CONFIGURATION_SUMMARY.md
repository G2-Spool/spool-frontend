# API Gateway Configuration Summary

## 🎯 Objective
Configure AWS API Gateway for Spool's thread-based learning platform with proper CORS support, Cognito authentication, and Lambda integrations.

## ✅ What Was Completed

### 1. **API Gateway Configuration**
- Created Cognito User Pool authorizer (ID: `sh8r2e`)
- Configured authentication for protected endpoints
- Set up Lambda proxy integrations for all thread endpoints
- Added Lambda invocation permissions

### 2. **Endpoints Configured**

| Endpoint | Methods | Authentication | Lambda Function |
|----------|---------|----------------|-----------------|
| `/api/thread` | GET, POST, OPTIONS | Cognito | spool-create-thread |
| `/api/thread/list` | GET, OPTIONS | Cognito | spool-create-thread |
| `/api/thread/{threadId}` | GET, OPTIONS | Cognito | spool-create-thread |
| `/api/thread/{threadId}/graph` | GET, OPTIONS | Cognito | spool-thread-graph-api |

### 3. **CORS Configuration Status**

#### API Gateway Level ✅
- OPTIONS methods configured for all endpoints
- Mock integration returns CORS headers for preflight requests
- Deployed to production stage

#### Lambda Function Level 🚨
- **spool-thread-graph-api**: ✅ Already has complete CORS headers
- **spool-create-thread**: ⚠️ Only has partial CORS headers

## 📝 Critical Finding: Lambda Proxy Integration

With Lambda proxy integration, CORS headers MUST be returned by the Lambda functions themselves, not just API Gateway. This is why the frontend is still experiencing CORS errors.

## 🔧 Immediate Action Required

### Update `spool-create-thread` Lambda

1. **Replace** `lambda/createThread/src/index.js` with `lambda/createThread/src/index-with-cors.js`
   ```bash
   cd lambda/createThread/src
   cp index-with-cors.js index.js
   ```

2. **Deploy the updated Lambda**
   ```bash
   cd lambda/createThread
   zip -r function.zip .
   aws lambda update-function-code \
     --function-name spool-create-thread \
     --zip-file fileb://function.zip \
     --region us-east-1
   ```

## 🧪 Testing Commands

### Test OPTIONS (Preflight)
```bash
curl -X OPTIONS https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

### Test with Authentication
```bash
# Get a Cognito token first, then:
curl https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread/list \
  -H "Origin: http://localhost:5173" \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -v
```

## 🏗️ Architecture Overview

```
Frontend (localhost:5173)
    ↓ HTTPS + CORS
API Gateway (alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod)
    ↓ Cognito Authorization
    ↓ Lambda Proxy Integration
Lambda Functions
    ├── spool-thread-graph-api (✅ CORS configured)
    └── spool-create-thread (⚠️ Needs CORS update)
```

## 📊 Configuration Details

### API Gateway ID
- **API ID**: `alj6xppcj6`
- **Region**: `us-east-1`
- **Stage**: `prod`
- **Base URL**: `https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod`

### Cognito Configuration
- **User Pool ID**: `us-east-1_H7Kti5MPI`
- **Authorizer ID**: `sh8r2e`
- **Authorization Header**: `Authorization: Bearer <idToken>`

### AWS Resources
- **Account ID**: `560281064968`
- **Lambda Functions**: 
  - `spool-thread-graph-api`
  - `spool-create-thread`

## 🚀 Next Steps

1. **Update Lambda Function** - Apply the CORS fix to `spool-create-thread`
2. **Test Frontend Integration** - Verify CORS errors are resolved
3. **Monitor CloudWatch** - Check Lambda logs for any issues
4. **Consider Security** - Replace `*` in CORS origin with specific domains

## 📚 Documentation References

- [Lambda Proxy Integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html)
- [CORS with Lambda Proxy](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)
- [Cognito User Pool Authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html)

## ⚡ Quick Reference

### Frontend API Call Example
```javascript
const response = await fetch('https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/api/thread/list', {
  headers: {
    'Authorization': `Bearer ${cognitoIdToken}`,
    'Content-Type': 'application/json'
  }
});
```

### Lambda CORS Response Format
```javascript
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
};
```

## ✅ Success Criteria

Once the Lambda function is updated:
1. OPTIONS requests return 200 with CORS headers
2. GET/POST requests include CORS headers in responses
3. Frontend can call API without CORS errors
4. Authentication with Cognito tokens works correctly 