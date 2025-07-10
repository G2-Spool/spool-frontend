#!/usr/bin/env node

import { config } from 'dotenv';
import { Amplify } from 'aws-amplify';
import { signIn, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

// Load environment variables
config();

// Configure Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.VITE_COGNITO_USER_POOL_ID || '',
      userPoolClientId: process.env.VITE_COGNITO_CLIENT_ID || '',
      ...(process.env.VITE_COGNITO_IDENTITY_POOL_ID && {
        identityPoolId: process.env.VITE_COGNITO_IDENTITY_POOL_ID,
      }),
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
      }
    }
  }
};

console.log('Testing Cognito Configuration...\n');
console.log('Environment Variables:');
console.log('  User Pool ID:', process.env.VITE_COGNITO_USER_POOL_ID ? '✓ Set' : '✗ Missing');
console.log('  Client ID:', process.env.VITE_COGNITO_CLIENT_ID ? '✓ Set' : '✗ Missing');
console.log('  Identity Pool ID:', process.env.VITE_COGNITO_IDENTITY_POOL_ID ? '✓ Set' : '○ Not set (optional)');
console.log('  AWS Region:', process.env.VITE_AWS_REGION ? '✓ Set' : '✗ Missing');

try {
  Amplify.configure(amplifyConfig);
  console.log('\n✓ Amplify configured successfully');
  
  // Test authentication
  if (process.argv[2] && process.argv[3]) {
    console.log('\nTesting authentication...');
    const email = process.argv[2];
    const password = process.argv[3];
    
    try {
      const { isSignedIn } = await signIn({ username: email, password });
      if (isSignedIn) {
        console.log('✓ Authentication successful');
        const user = await getCurrentUser();
        console.log('  User ID:', user.userId);
        const attributes = await fetchUserAttributes();
        console.log('  Email:', attributes.email);
        console.log('  Email Verified:', attributes.email_verified);
      }
    } catch (error) {
      console.error('✗ Authentication failed:', error.message);
    }
  } else {
    console.log('\nTo test authentication, run:');
    console.log('  node test-cognito-config.js <email> <password>');
  }
} catch (error) {
  console.error('\n✗ Amplify configuration failed:', error.message);
}