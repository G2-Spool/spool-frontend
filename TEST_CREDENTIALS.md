# Test Credentials for Spool Frontend

## Test Student Account
- **Email**: test@example.com
- **Password**: TestPass123!
- **Role**: Student

## Known Issues and Solutions

### "There is already a signed in user" Error
This error occurs when AWS Amplify detects an existing session. Solutions:

1. **Use the "Clear Existing Session" button** on the login page (only visible in development mode)
2. **Clear browser storage**:
   - Open browser developer tools (F12)
   - Go to Application/Storage tab
   - Clear Local Storage and Session Storage for the site
   - Refresh the page

3. **Force logout in console**:
   ```javascript
   // Run this in browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

## AWS Cognito Configuration
- **User Pool ID**: us-east-1_TBQtRz0K6
- **Client ID**: 2bdesb5u92d8irnqjvprn8aooo
- **Region**: us-east-1

## Authentication Flow
1. The app checks for existing sessions on login
2. If a session exists, it attempts to sign out first
3. Then proceeds with the new login
4. If issues persist, use the "Clear Existing Session" button

## For Developers
The authentication implementation includes:
- Automatic session cleanup before login
- Global sign out to clear all devices
- Development tools for session management
- Retry logic for "already signed in" errors