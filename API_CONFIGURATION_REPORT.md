# API Configuration Investigation Report

## 🚨 CRITICAL FINDINGS

### 1. **Frontend IS Using the Correct API Gateway!**
- The frontend configuration in `/src/config/api.ts` correctly points to:
  - **Production**: `https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod` (spool-api)
  - **Staging**: `https://1nnruhxb5d.execute-api.us-east-1.amazonaws.com/prod` (academia-search-api)
- The `.env` file also correctly sets: `VITE_API_BASE_URL=https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod`

### 2. **The Real Issues Found:**

#### Issue 1: CORS Not Configured
- **NEITHER API Gateway returns CORS headers**
- Both APIs (spool-api and academia-search-api) are missing:
  - `Access-Control-Allow-Origin`
  - `Access-Control-Allow-Headers`
  - `Access-Control-Allow-Methods`
- This causes the browser to block all requests due to CORS policy

#### Issue 2: Authentication Configuration Mismatch
- The spool-api returns: `"Invalid key=value pair (missing equal-sign) in Authorization header"`
- This suggests the API expects AWS SigV4 authentication, not Bearer tokens
- The frontend is sending: `Authorization: Bearer ${idToken}`

#### Issue 3: Missing API Gateway Endpoints
- Both APIs return 403 "Missing Authentication Token" for thread endpoints
- This could mean:
  - The thread endpoints aren't deployed to the API Gateway
  - The Lambda functions aren't properly integrated
  - The API Gateway deployment is outdated

### 3. **API Configurations Discovered:**

#### Spool API (alj6xppcj6) - MAIN API
- **Purpose**: Main application API
- **Endpoints tested**:
  - `/api/thread/connection/test` - 403 (Missing Authentication Token)
  - `/api/thread/list` - 403 (Missing Authentication Token)
  - `/api/thread/{threadId}/graph` - 401 (Unauthorized)

#### Academia Search API (1nnruhxb5d) - STAGING/SEARCH API
- **Purpose**: Listed as staging endpoint in config
- **Endpoints tested**:
  - All return 403 "Forbidden"

#### Exercise API (79dgy4x54a) - SEPARATE SERVICE
- **Purpose**: Exercise generation and evaluation
- **Base URL**: `https://79dgy4x54a.execute-api.us-east-1.amazonaws.com/production/api/exercise`
- **Note**: This service has its own hardcoded URL in `exercise.service.ts`

## 📋 Root Causes of Network Errors

1. **CORS Policy Blocking**: Browser blocks requests due to missing CORS headers
2. **Authentication Mismatch**: API expects different auth format than frontend sends
3. **Endpoint Configuration**: Thread endpoints may not be properly deployed

## 🔧 Required Fixes

### 1. Enable CORS on API Gateway
```yaml
# Add to API Gateway configuration
Cors:
  AllowOrigins:
    - 'http://localhost:5173'
    - 'http://localhost:3000'
    - 'https://your-production-domain.com'
  AllowHeaders:
    - 'Content-Type'
    - 'Authorization'
    - 'X-Amz-Date'
    - 'X-Api-Key'
    - 'X-Amz-Security-Token'
  AllowMethods:
    - GET
    - POST
    - PUT
    - DELETE
    - OPTIONS
```

### 2. Fix Authentication
Either:
- Configure API Gateway to accept Bearer tokens (Cognito User Pool Authorizer)
- OR update frontend to use AWS SigV4 signing

### 3. Deploy Thread Endpoints
- Verify Lambda functions are deployed
- Check API Gateway integrations
- Ensure proper resource paths are configured
- Deploy the API Gateway stage

### 4. Update Frontend Error Handling
```typescript
// Add better error handling for CORS and auth issues
if (error.message.includes('CORS')) {
  console.error('CORS error - API Gateway needs configuration');
} else if (error.message.includes('Authentication')) {
  console.error('Auth error - check token format');
}
```

## 📊 Summary

The frontend IS configured correctly with the right API Gateway IDs. The network errors are caused by:
1. Missing CORS configuration on the API Gateway
2. Authentication format mismatch
3. Potentially missing endpoint deployments

The confusion about API Gateway IDs was a red herring - the real issues are infrastructure configuration on the AWS side.