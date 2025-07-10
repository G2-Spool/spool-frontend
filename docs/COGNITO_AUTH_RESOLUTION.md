# Cognito Authentication Issue Resolution

## Issue Summary
The application was displaying "Auth UserPool not configured" error after login attempts.

## Root Cause Analysis

### 1. Environment Variable Configuration
The issue stems from environment variables not being properly loaded in the Amplify deployment environment. The application uses Vite environment variables (prefixed with `VITE_`) that must be available at build time.

### 2. Multiple User Pool Confusion
Investigation revealed:
- `.env` file uses: `us-east-1_TBQtRz0K6`
- `.env.local` file uses: `us-east-1_H7Kti5MPI`
- The Identity Pool is linked to a different User Pool than configured

### 3. ShpoolBot User Configuration
The ShpoolBot user exists in the UserPool with:
- Email: `shpoolbot@spool.com`
- Nickname: `ShpoolBot`
- The UserPool requires email-based authentication

## Solution Implemented

### 1. Updated Amplify Configuration
Modified `/src/config/amplify.ts` to:
- Add better error logging for missing environment variables
- Always configure Amplify even if variables are missing (prevents runtime crashes)
- Log current environment to help debug deployment issues

### 2. Environment Variables Required
Ensure these are set in AWS Amplify Console:
```
VITE_COGNITO_USER_POOL_ID=us-east-1_TBQtRz0K6
VITE_COGNITO_CLIENT_ID=2bdesb5u92d8irnqjvprn8aooo
VITE_AWS_REGION=us-east-1
```

## Deployment Instructions

### AWS Amplify Console Configuration
1. Go to AWS Amplify Console
2. Select your app
3. Go to "Environment variables"
4. Add the three required variables above
5. Ensure "Build settings" includes environment variables
6. Redeploy the application

### Authentication Usage
To authenticate as ShpoolBot:
- Username: `shpoolbot@spool.com` (NOT "ShpoolBot")
- Password: As configured in Cognito

## Testing Verification
After deployment, check browser console for:
1. Environment variable logs
2. Successful Amplify configuration message
3. No "Auth UserPool not configured" errors

## Future Improvements
1. Consider using AWS Systems Manager Parameter Store for sensitive configuration
2. Implement environment-specific configuration loading
3. Add health check endpoint to verify Cognito connectivity
4. Consolidate to a single User Pool to avoid confusion