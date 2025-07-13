import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Card } from '../components/atoms/Card';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { clearExistingSession } from '../utils/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Debug logging
  useEffect(() => {
    console.log('LoginPage render - isAuthenticated:', isAuthenticated, 'user:', user?.id, 'authLoading:', authLoading);
  }, [isAuthenticated, user, authLoading]);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, redirecting to:', from);
      setIsLoading(false); // Reset loading state when authenticated
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      console.log('Login successful, waiting for auth state update...');
      // Don't navigate here - let the useEffect handle it when isAuthenticated updates
      // Also don't reset isLoading here - let useEffect handle it
    } catch (err: any) {
      console.error('Login error in form:', err);
      setError(err.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-obsidian dark:text-gray-100 mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to continue your learning journey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 dark:bg-error/20 border border-error/20 dark:border-error/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail className="h-5 w-5" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="h-5 w-5" />}
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="h-5 w-5 text-teal-600 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 bg-gray-100 dark:bg-gray-700 transition-all duration-200 hover:border-teal-400 dark:hover:border-teal-400"
              />
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full rounded-lg"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Development helper - remove in production */}
        {import.meta.env.DEV && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 text-center">Development Tools</p>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await clearExistingSession();
                  setError('');
                  alert('Session cleared. You can now log in.');
                } catch (err) {
                  console.error('Failed to clear session:', err);
                }
              }}
              className="w-full"
            >
              Clear Existing Session
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('Current auth state:', {
                  isAuthenticated,
                  user: user ? { id: user.id, email: user.email } : null,
                  authLoading,
                  isLoading
                });
                alert(`Auth state:\nisAuthenticated: ${isAuthenticated}\nUser: ${user?.email || 'null'}\nAuth loading: ${authLoading}\nForm loading: ${isLoading}`);
              }}
              className="w-full mt-2"
            >
              Check Auth State
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};