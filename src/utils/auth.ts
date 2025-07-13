import { supabase } from '../config/supabase';

/**
 * Clear any existing authentication session
 * Useful for development and handling stale sessions
 */
export const clearExistingSession = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('Clearing existing session for user:', user.id);
      await supabase.auth.signOut();
    } else {
      console.log('No existing session to clear');
    }
  } catch (error) {
    console.log('No existing session to clear');
  }
};

/**
 * Check if there's a valid session
 */
export const hasValidSession = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    return false;
  }
};