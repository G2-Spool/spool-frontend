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
  interests: [
    { interest: 'gaming', category: 'personal', strength: 0.9 },
    { interest: 'coding', category: 'career', strength: 0.85 },
    { interest: 'environmental conservation', category: 'philanthropic', strength: 0.8 },
    { interest: 'team sports', category: 'social', strength: 0.75 },
  ],
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
  const processSession = (session: Session | null) => {
    console.log('Processing session:', session?.user?.id);
    
    if (!session || !session.user) {
      console.log('No session or user, clearing state');
      setUser(null);
      setStudentProfile(null);
      setSession(null);
      return;
    }

    // Map Supabase user to our User type
    const userData: User = {
      id: session.user.id,
      email: session.user.email || '',
      role: 'student',
      isActive: true,
      emailVerified: session.user.email_confirmed_at !== null,
      createdAt: new Date(session.user.created_at || Date.now()),
      updatedAt: new Date(),
    };

    console.log('Setting user data:', userData);
    setUser(userData);
    setSession(session);
    
    // Set mock student profile
    const profileWithUserId = { ...mockStudentProfile, userId: userData.id, id: userData.id };
    setStudentProfile(profileWithUserId);
    console.log('User and profile set successfully');
  };

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get the initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (mounted) {
          processSession(session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      
      if (!mounted) return;

      // Process the new session
      processSession(session);
      
      // Only set loading to false if we're not already loaded
      if (isLoading) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isLoading]); // Add isLoading to dependencies

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
        processSession(data.session);
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