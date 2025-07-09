import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import type { SignInOutput } from 'aws-amplify/auth';
import type { User, StudentProfile } from '../types';

// Configure Amplify with Cognito
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
      },
    }
  }
});

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
    parentReports: false,
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
      const cognitoUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      // Map Cognito attributes to our User type
      const userData: User = {
        id: cognitoUser.userId,
        email: attributes.email || '',
        role: (attributes['custom:role'] as any) || 'student',
        isActive: true,
        emailVerified: attributes.email_verified === 'true',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setUser(userData);
      
      // If user is a student, fetch their profile
      if (userData.role === 'student') {
        // In production, this would be an API call
        // const profile = await fetchStudentProfile(userData.id);
        // For now, use mock data
        setStudentProfile(mockStudentProfile);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setStudentProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First, check if there's already a signed-in user and sign them out
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('Signing out existing user...');
          await signOut({ global: true });
          // Add a small delay to ensure the sign out completes
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err) {
        // No current user, which is fine
      }
      
      let signInResult: SignInOutput;
      try {
        signInResult = await signIn({ username: email, password });
      } catch (signInError: any) {
        // If we get the "already signed in" error, force sign out and retry
        if (signInError.message?.includes('already a signed in user')) {
          console.log('Forcing sign out due to existing session...');
          await signOut({ global: true });
          await new Promise(resolve => setTimeout(resolve, 1000));
          signInResult = await signIn({ username: email, password });
        } else {
          throw signInError;
        }
      }
      
      if (signInResult.isSignedIn) {
        await fetchUserData();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.name === 'UserNotFoundException' || error.name === 'NotAuthorizedException') {
        throw new Error('Invalid email or password');
      } else if (error.name === 'UserNotConfirmedException') {
        throw new Error('Please confirm your email address');
      } else if (error.message?.includes('already a signed in user')) {
        // If we still get this error, force sign out and retry
        try {
          await signOut({ global: true });
          const { isSignedIn } = await signIn({ username: email, password });
          if (isSignedIn) {
            await fetchUserData();
          }
        } catch (retryError: any) {
          throw new Error(retryError.message || 'An error occurred during login');
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
      await signOut({ global: true });
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