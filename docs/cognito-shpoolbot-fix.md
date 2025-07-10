# Cognito ShpoolBot User Configuration Fix

## Issue Summary
The user "ShpoolBot" could not authenticate because it didn't exist in the Cognito UserPool. Additionally, the UserPool configuration requires email addresses as usernames, not arbitrary strings.

## Root Cause
1. The Cognito UserPool (us-east-1_TBQtRz0K6) is configured with `UsernameAttributes: ["email"]`
2. This means users must authenticate using their email address, not a custom username
3. The user "ShpoolBot" was not created in the UserPool

## Solution Implemented

### 1. Created ShpoolBot User
- Created user with email: `shpoolbot@spool.com`
- Set password: `ShpoolBot123!` (meets all password requirements)
- Added nickname attribute: `ShpoolBot` for display purposes
- Set email_verified: true to avoid verification issues

### 2. User Attributes
```json
{
  "email": "shpoolbot@spool.com",
  "email_verified": "true",
  "nickname": "ShpoolBot",
  "given_name": "Shpool",
  "family_name": "Bot"
}
```

### 3. Authentication Instructions
When authenticating as ShpoolBot:
- **Username**: `shpoolbot@spool.com` (NOT "ShpoolBot")
- **Password**: `ShpoolBot123!`

## UserPool Configuration Details
- **Pool ID**: us-east-1_TBQtRz0K6
- **Pool Name**: spool-user-pool
- **Username Attributes**: email (users must use email to login)
- **Password Policy**:
  - Minimum length: 8
  - Require uppercase: true
  - Require lowercase: true
  - Require numbers: true
  - Require symbols: false

## App Client Configuration
- **Frontend Client ID**: 2bdesb5u92d8irnqjvprn8aooo
- **Client Name**: spool-frontend-client

## Script for Creating Similar Users
See `create_shpoolbot_user.js` for a template on how to create users programmatically when the UserPool uses email as username.

## Important Notes
1. Since the UserPool uses email as the username attribute, all users must authenticate with their email address
2. The nickname attribute can be used to store a preferred display name
3. The actual username in Cognito is a UUID, but users authenticate with their email