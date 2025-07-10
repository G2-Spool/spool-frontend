import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';

async function createShpoolBot() {
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
  const userPoolId = 'us-east-1_TBQtRz0K6';
  
  // Since the user pool uses email as username, we need to provide an email
  const email = 'shpoolbot@spool.com';
  const password = 'ShpoolBot123!'; // Meets password requirements
  
  try {
    // Create user
    const createCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email, // Must be an email since UsernameAttributes is set to email
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'given_name', Value: 'Shpool' },
        { Name: 'family_name', Value: 'Bot' },
        { Name: 'nickname', Value: 'ShpoolBot' } // Store the preferred username as nickname
      ],
      MessageAction: 'SUPPRESS', // Don't send welcome email
      TemporaryPassword: password
    });
    
    const createResult = await client.send(createCommand);
    console.log('User created:', createResult.User);
    
    // Set permanent password
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: email,
      Password: password,
      Permanent: true
    });
    
    await client.send(setPasswordCommand);
    console.log('Password set as permanent');
    
    console.log(`\nShpoolBot user created successfully!`);
    console.log(`Username: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Note: Since the user pool uses email as username, you must use ${email} to login, not "ShpoolBot"`);
    
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

createShpoolBot();