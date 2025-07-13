import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Card } from '../components/atoms/Card';
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'student',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
          },
        },
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      if (data.user) {
        setSuccess(true);
        
        // Check if email confirmation is required
        if (data.session) {
          // User is automatically signed in (email confirmation disabled)
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          // Email confirmation required
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }
    } catch (err: any) {
      if (err.message?.includes('User already registered')) {
        setError('An account with this email already exists');
      } else if (err.message?.includes('Password should be at least')) {
        setError('Password must be at least 6 characters');
      } else {
        setError(err.message || 'An error occurred during sign up');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (success) {
    return (
      <Card>
        <div className="relative">
          <Link
            to="/"
            className="absolute -top-1 -left-1 p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Created Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Please check your email to confirm your account.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="relative">
        <Link
          to="/"
          className="absolute -top-1 -left-1 p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-obsidian mb-2">Create Your Account</h1>
          <p className="text-gray-600">Start your personalized learning journey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              leftIcon={<User className="h-5 w-5" />}
              required
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              leftIcon={<User className="h-5 w-5" />}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            leftIcon={<Mail className="h-5 w-5" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            leftIcon={<Lock className="h-5 w-5" />}
            required
            autoComplete="new-password"
            helperText="Must be at least 6 characters"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            leftIcon={<Lock className="h-5 w-5" />}
            required
            autoComplete="new-password"
          />

          <div className="text-sm text-gray-600">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-[#38b2ac] hover:text-teal-700 dark:hover:text-teal-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#38b2ac] hover:text-teal-700 dark:hover:text-teal-300">
              Privacy Policy
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full rounded-lg"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#38b2ac] font-medium hover:text-teal-700 dark:hover:text-teal-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
};