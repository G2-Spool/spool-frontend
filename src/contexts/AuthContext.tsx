import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { AuthError } from '@supabase/supabase-js';
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

  const fetchUserData = async () => {
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
      
      if (error || !supabaseUser) {
        setUser(null);
        setStudentProfile(null);
        return;
      }
      
      // Map Supabase user to our User type
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: 'student', // Always student for individual learners
        isActive: true,
        emailVerified: supabaseUser.email_confirmed_at !== null,
        createdAt: new Date(supabaseUser.created_at || Date.now()),
        updatedAt: new Date(),
      };
      
      setUser(userData);
      
      // Fetch student profile
      // In production, this would be an API call
      // const profile = await fetchStudentProfile(userData.id);
      // For now, use mock data
      setStudentProfile(mockStudentProfile);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setStudentProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing session
    fetchUserData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchUserData();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setStudentProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        await fetchUserData();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
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
    } finally {
      setIsLoading(false);
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
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setStudentProfile(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  const value: AuthContextType = {
    user,
    studentProfile,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};