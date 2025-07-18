import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { AuthError, Session } from '@supabase/supabase-js';
import type { User, StudentProfile } from '../types';

interface AuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mock student profile for demo
const mockStudentProfile: StudentProfile = {
  id: '123',
  userId: '123',
  firstName: 'Alex',
  lastName: 'Johnson',
  interests: ['gaming', 'coding', 'environmental conservation', 'team sports'],
  careerInterests: ['technology', 'game development'],
  philanthropicInterests: ['environment', 'education'],
  learningStyleIndicators: { visual: 0.8, kinesthetic: 0.6 },
  lifeCategoryWeights: {
    personal: 0.3,
    social: 0.2,
    career: 0.3,
    philanthropic: 0.2,
  },
  totalPoints: 1250,
  currentStreakDays: 7,
  longestStreakDays: 14,
  lastActivityDate: new Date(),
  badgesEarned: [],
  level: 3,
  experiencePoints: 2400,
  preferredSessionLength: 45,
  dailyGoalMinutes: 30,
  notificationPreferences: {
    emailNotifications: true,
    streakReminders: true,
    achievementAlerts: true,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Process session and set user data
  const processSession = async (session: Session | null) => {
    console.log('Processing session:', session?.user?.id);
    
    if (!session || !session.user) {
      console.log('No session or user, clearing state');
      setUser(null);
      setStudentProfile(null);
      setSession(null);
      return;
    }

    // Create fallback user data first
    const fallbackUserData: User = {
      id: session.user.id,
      email: session.user.email || '',
      role: 'student',
      isActive: true,
      emailVerified: session.user.email_confirmed_at !== null,
      createdAt: new Date(session.user.created_at || Date.now()),
      updatedAt: new Date(),
    };

    try {
      // Add timeout to database query
      const fetchUserWithTimeout = Promise.race([
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 3000)
        )
      ]);

      const { data: userData, error } = await fetchUserWithTimeout as any;

      if (error || !userData) {
        console.warn('Database query failed, using fallback data:', error?.message);
        setUser(fallbackUserData);
      } else {
        // Map database user to our User type
        const user: User = {
          id: userData.id,
          email: userData.email,
          role: 'student',
          isActive: true,
          emailVerified: session.user.email_confirmed_at !== null,
          createdAt: new Date(userData.created_at || Date.now()),
          updatedAt: new Date(),
        };
        setUser(user);
      }
    } catch (error) {
      console.warn('Error processing session, using fallback data:', error);
      setUser(fallbackUserData);
    }

    setSession(session);
    
    // Set mock student profile
    const profileWithUserId = { ...mockStudentProfile, userId: session.user.id, id: session.user.id };
    setStudentProfile(profileWithUserId);
    console.log('User and profile set successfully');
  };

  useEffect(() => {
    let mounted = true;
    let initTimeout: NodeJS.Timeout;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set a timeout to prevent indefinite loading
        initTimeout = setTimeout(() => {
          console.warn('Auth initialization timeout - forcing loading complete');
          if (mounted && isLoading) {
            setIsLoading(false);
          }
        }, 10000); // Increased to 10 seconds for better reliability
        
        // Get the initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        // Process the session (removed unnecessary refresh)
        if (mounted) {
          await processSession(session);
          setIsLoading(false);
          console.log('Auth initialization complete');
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      } finally {
        // Clear timeout if it hasn't fired
        if (initTimeout) {
          clearTimeout(initTimeout);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      
      if (!mounted) return;

      // Process the new session
      await processSession(session);
      
      // Loading state is handled by the auth state change itself
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      if (data.user && data.session) {
        console.log('Login successful, processing session');
        // Process the session immediately
        await processSession(data.session);
      }
    } catch (error: any) {
      console.error('Login error caught:', error);
      
      // Handle Supabase-specific errors
      if (error instanceof AuthError) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address');
        } else {
          throw new Error(error.message || 'An error occurred during login');
        }
      } else {
        throw new Error(error.message || 'An error occurred during login');
      }
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setStudentProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setStudentProfile(null);
      setSession(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    processSession(session);
  };

  const value: AuthContextType = {
    user,
    studentProfile,
    isLoading,
    isAuthenticated: !!user && !!session,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};