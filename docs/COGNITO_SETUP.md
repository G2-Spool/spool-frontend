# AWS Cognito Configuration Guide

## Overview
This application uses AWS Cognito for authentication. The configuration is managed through environment variables and initialized in the Amplify configuration.

## Required Configuration

### Environment Variables
The following environment variables must be set in your `.env` file:

```bash
# AWS Cognito Configuration  
VITE_COGNITO_USER_POOL_ID=us-east-1_TBQtRz0K6
VITE_COGNITO_CLIENT_ID=2bdesb5u92d8irnqjvprn8aooo
VITE_AWS_REGION=us-east-1

# Optional - only if using Federated Identities
VITE_COGNITO_IDENTITY_POOL_ID=
```

### Configuration Files

1. **`/src/config/amplify.ts`** - Main Amplify configuration
   - Reads environment variables
   - Configures Auth with Cognito
   - Validates required configuration

2. **`/src/main.tsx`** - Application entry point
   - Calls `configureAmplify()` before rendering
   - Ensures Amplify is initialized early

3. **`/src/contexts/AuthContext.tsx`** - Authentication context
   - Provides auth methods (login, logout)
   - Manages user state
   - Handles Cognito auth operations

## Testing Configuration

### Quick Test
Run the test script to verify your Cognito configuration:

```bash
npm run test:cognito
```

To test with credentials:
```bash
npm run test:cognito user@example.com password123
```

### Manual Verification

1. **Check Environment Variables**
   ```bash
   # Verify .env file exists and contains required values
   cat .env | grep VITE_COGNITO
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Check Browser Console**
   - Open browser DevTools
   - Look for any Amplify configuration errors
   - Verify no missing environment variable warnings

## Common Issues and Solutions

### Issue: "Missing required environment variables"
**Solution**: Ensure all required variables are set in `.env`:
- `VITE_COGNITO_USER_POOL_ID`
- `VITE_COGNITO_CLIENT_ID`
- `VITE_AWS_REGION`

### Issue: "Invalid UserPoolId"
**Solution**: Verify the User Pool ID format (should be like `us-east-1_XXXXXXXXX`)

### Issue: "Invalid ClientId"
**Solution**: 
1. Check that the App Client ID is correct
2. Ensure the App Client allows username/password auth
3. Verify no client secret is configured (public client)

### Issue: "Network error"
**Solution**:
1. Check AWS region is correct
2. Verify internet connectivity
3. Check if Cognito service is available in your region

## Amplify Build Configuration

For Amplify hosting, add these environment variables in the Amplify Console:

1. Go to your Amplify app
2. Navigate to "Environment variables"
3. Add the following:
   - `VITE_COGNITO_USER_POOL_ID`
   - `VITE_COGNITO_CLIENT_ID`
   - `VITE_AWS_REGION`
   - `VITE_COGNITO_IDENTITY_POOL_ID` (if using)

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as a template
2. **Use least privilege** - Configure minimal Cognito permissions
3. **Enable MFA** - Consider enabling multi-factor authentication
4. **Monitor usage** - Set up CloudWatch alarms for unusual activity
5. **Rotate credentials** - Periodically update App Client IDs

## Additional Resources

- [AWS Amplify Auth Documentation](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/)
- [Cognito User Pool Configuration](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)
- [Amplify Environment Variables](https://docs.amplify.aws/guides/hosting/environment-variables/)