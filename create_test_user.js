const { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');

const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

async function createTestUser() {
  const userPoolId = 'us-east-1_TBQtRz0K6';
  const email = 'test@example.com';
  const password = 'TestPass123\!';
  
  try {
    // Create user
    const createCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'custom:role', Value: 'student' }
      ],
      MessageAction: 'SUPPRESS',
      TemporaryPassword: password
    });
    
    const createResult = await client.send(createCommand);
    console.log('User created:', createResult.User.Username);
    
    // Set permanent password
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: email,
      Password: password,
      Permanent: true
    });
    
    await client.send(setPasswordCommand);
    console.log('Password set successfully');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createTestUser();
