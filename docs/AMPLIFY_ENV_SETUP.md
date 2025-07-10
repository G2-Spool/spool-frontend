# AWS Amplify Environment Variables Setup

## ⚠️ CRITICAL: Environment Variables Not Loading

The application is failing because environment variables are not set in AWS Amplify Console.

## Step-by-Step Fix Instructions

### 1. Access AWS Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app: `spool-frontend`
3. Click on the branch: `main`

### 2. Set Environment Variables
1. In the left sidebar, click on **"Environment variables"**
2. Click **"Manage variables"**
3. Add these THREE required variables:

| Variable Name | Value |
|--------------|-------|
| `VITE_COGNITO_USER_POOL_ID` | `us-east-1_TBQtRz0K6` |
| `VITE_COGNITO_CLIENT_ID` | `2bdesb5u92d8irnqjvprn8aooo` |
| `VITE_AWS_REGION` | `us-east-1` |

### 3. Optional Variables (if needed)
| Variable Name | Value | Notes |
|--------------|-------|-------|
| `VITE_COGNITO_IDENTITY_POOL_ID` | (leave empty) | Not required for basic auth |
| `VITE_API_BASE_URL` | `https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/` | If using deployed API |

### 4. Save and Redeploy
1. Click **"Save"** after adding all variables
2. Go back to your app overview
3. Click **"Redeploy this version"** to trigger a new build with the environment variables

### 5. Verify in Build Logs
During the build, you should see the environment variables being used. Check the build logs for any errors.

## Alternative: Using Build Settings

If the above doesn't work, you can also try adding them to the build settings:

1. Go to **"Build settings"**
2. Click **"Edit"**
3. In the build spec, add environment variables:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "VITE_COGNITO_USER_POOL_ID=$VITE_COGNITO_USER_POOL_ID"
        - echo "VITE_COGNITO_CLIENT_ID=$VITE_COGNITO_CLIENT_ID"
        - echo "VITE_AWS_REGION=$VITE_AWS_REGION"
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

## Troubleshooting

### If variables still don't load:
1. Check that variable names are EXACTLY as shown (case-sensitive)
2. Ensure no extra spaces in values
3. Try clearing browser cache after deployment
4. Check Amplify build logs for any errors

### Testing locally:
```bash
# Create a .env.local file with:
VITE_COGNITO_USER_POOL_ID=us-east-1_TBQtRz0K6
VITE_COGNITO_CLIENT_ID=2bdesb5u92d8irnqjvprn8aooo
VITE_AWS_REGION=us-east-1

# Run locally
npm run dev
```

## Important Notes
- Vite environment variables MUST be prefixed with `VITE_`
- They are replaced at BUILD TIME, not runtime
- After setting env vars, you MUST redeploy for changes to take effect