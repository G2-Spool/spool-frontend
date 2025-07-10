import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
      ...(import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID && {
        identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
      }),
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
      }
    }
  },
  API: {
    REST: {
      SpoolAPI: {
        endpoint: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
      }
    }
  }
};

export const configureAmplify = () => {
  // Check if required configuration is present
  const requiredVars = {
    VITE_COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    VITE_COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID,
    VITE_AWS_REGION: import.meta.env.VITE_AWS_REGION
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('Please ensure these are set in your .env file or Amplify environment');
    console.error('Current env:', import.meta.env);
  }

  // Always configure Amplify, even with missing vars, to avoid runtime errors
  // Amplify will provide more specific error messages when operations are attempted
  Amplify.configure(amplifyConfig);
};