import { signOut, getCurrentUser } from 'aws-amplify/auth';

/**
 * Clear any existing authentication session
 * Useful for development and handling stale sessions
 */
export const clearExistingSession = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      console.log('Clearing existing session for user:', currentUser.userId);
      await signOut({ global: true });
    }
  } catch (error) {
    // No current user or error getting user - that's fine
    console.log('No existing session to clear');
  }
};

/**
 * Check if there's a valid session
 */
export const hasValidSession = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    return false;
  }
};