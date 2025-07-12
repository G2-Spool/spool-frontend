// Error types for better error handling
export const ErrorType = {
  NETWORK: 'NETWORK',
  AUTHENTICATION: 'AUTHENTICATION',
  PERMISSION: 'PERMISSION',
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface AppError extends Error {
  type: ErrorType;
  statusCode?: number;
  details?: Record<string, unknown>;
  retryable?: boolean;
}

// Error factory for creating typed errors
export class ErrorFactory {
  static create(error: unknown): AppError {
    const appError = new Error() as AppError;
    
    // Handle axios errors
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      const status = axiosError.response.status;
      appError.statusCode = status;
      appError.message = axiosError.response.data?.message || axiosError.message;
      appError.details = axiosError.response.data;
      
      switch (status) {
        case 401:
          appError.type = ErrorType.AUTHENTICATION;
          appError.retryable = false;
          break;
        case 403:
          appError.type = ErrorType.PERMISSION;
          appError.retryable = false;
          break;
        case 404:
          appError.type = ErrorType.NOT_FOUND;
          appError.retryable = false;
          break;
        case 422:
        case 400:
          appError.type = ErrorType.VALIDATION;
          appError.retryable = false;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          appError.type = ErrorType.SERVER;
          appError.retryable = true;
          break;
        default:
          appError.type = ErrorType.UNKNOWN;
          appError.retryable = status >= 500;
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      // Network error
      appError.type = ErrorType.NETWORK;
      appError.message = 'Network error. Please check your connection.';
      appError.retryable = true;
    } else {
      // Unknown error
      appError.type = ErrorType.UNKNOWN;
      appError.message = (error instanceof Error ? error.message : String(error)) || 'An unexpected error occurred';
      appError.retryable = false;
    }
    
    return appError;
  }
}

// User-friendly error messages
export const getErrorMessage = (error: AppError): string => {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection.';
    case ErrorType.AUTHENTICATION:
      return 'Your session has expired. Please log in again.';
    case ErrorType.PERMISSION:
      return 'You do not have permission to perform this action.';
    case ErrorType.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorType.VALIDATION:
      return (error.details as any)?.message || 'Please check your input and try again.';
    case ErrorType.SERVER:
      return 'Server error. Our team has been notified. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Error recovery strategies
export const errorRecovery = {
  handleAuthError: () => {
    // Clear auth tokens and redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  },
  
  handleNetworkError: (retry: () => void) => {
    // Show offline indicator and retry when back online
    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      retry();
    };
    window.addEventListener('online', handleOnline);
  },
  
  handleServerError: (error: AppError) => {
    // Log to error tracking service
    console.error('Server error:', {
      type: error.type,
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    });
    
    // Could integrate with Sentry, LogRocket, etc.
    // Sentry.captureException(error);
  },
};

// React hook for error handling
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown) => {
    const appError = ErrorFactory.create(error);
    const message = getErrorMessage(appError);
    
    // Show user-friendly error message
    toast.error(message);
    
    // Handle specific error types
    switch (appError.type) {
      case ErrorType.AUTHENTICATION:
        errorRecovery.handleAuthError();
        break;
      case ErrorType.SERVER:
        errorRecovery.handleServerError(appError);
        break;
    }
    
    return appError;
  }, []);
  
  return { handleError };
};

// Retry logic with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const appError = ErrorFactory.create(error);
      
      if (!appError.retryable || i === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};