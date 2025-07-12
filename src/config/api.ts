// API Configuration for Spool Frontend
// Enhanced to include both existing AWS endpoints and new microservice endpoints

// ===== EXISTING AWS API GATEWAY ENDPOINTS =====
export const API_BASE_URL = 'https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod';

// Alternative endpoints for different environments
export const API_ENDPOINTS = {
  production: 'https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod',
  staging: 'https://1nnruhxb5d.execute-api.us-east-1.amazonaws.com/prod',
  development: 'http://localhost:3001',
} as const;

// Thread-specific endpoints
export const THREAD_ENDPOINTS = {
  graph: '/api/thread/{threadId}/graph',
  list: '/api/thread/list', 
  connection: '/api/thread/connection/test',
} as const;

// ===== SPOOL-GITHUB MICROSERVICE ENDPOINTS =====
// API Service URLs (migrated from Spool-GitHub)
export const API_SERVICES = {
  AUTH: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001',
  CONTENT: import.meta.env.VITE_CONTENT_SERVICE_URL || 'http://localhost:3002',
  EXERCISE: import.meta.env.VITE_EXERCISE_SERVICE_URL || 'http://localhost:3003',
  PROGRESS: import.meta.env.VITE_PROGRESS_SERVICE_URL || 'http://localhost:3004',
  INTERVIEW: import.meta.env.VITE_INTERVIEW_SERVICE_URL || 'http://localhost:8080',
} as const;

// Microservice API Endpoints
export const MICROSERVICE_ENDPOINTS = {
  // Auth Service
  AUTH: {
    SIGNIN: `${API_SERVICES.AUTH}/auth/signin`,
    SIGNUP: `${API_SERVICES.AUTH}/auth/signup`,
    CONFIRM: `${API_SERVICES.AUTH}/auth/confirm`,
    SIGNOUT: `${API_SERVICES.AUTH}/auth/signout`,
    ME: `${API_SERVICES.AUTH}/auth/me`,
    REFRESH: `${API_SERVICES.AUTH}/auth/refresh`,
    FORGOT_PASSWORD: `${API_SERVICES.AUTH}/auth/forgot-password`,
    RESET_PASSWORD: `${API_SERVICES.AUTH}/auth/reset-password`,
  },
  
  // Content Service
  CONTENT: {
    TOPICS: `${API_SERVICES.CONTENT}/content/topics`,
    TOPIC_DETAILS: `${API_SERVICES.CONTENT}/content/topics`,
    CONCEPTS: `${API_SERVICES.CONTENT}/content/concepts`,
    CONCEPT_DETAILS: `${API_SERVICES.CONTENT}/content/concepts`,
    MODULES: `${API_SERVICES.CONTENT}/content/modules`,
    LEARNING_PATH: `${API_SERVICES.CONTENT}/content/learning-path`,
    UPDATE_LEARNING_PATH: `${API_SERVICES.CONTENT}/content/learning-path/update`,
    PERSONALIZED_CONTENT: `${API_SERVICES.CONTENT}/content/personalized`,
    RECOMMENDATIONS: `${API_SERVICES.CONTENT}/content/recommendations`,
  },
  
  // Exercise Service
  EXERCISE: {
    GENERATE: `${API_SERVICES.EXERCISE}/exercises/generate`,
    ASSESS_ANSWER: `${API_SERVICES.EXERCISE}/exercises/assess`,
    GET_EXERCISES: `${API_SERVICES.EXERCISE}/exercises`,
    SUBMIT_ANSWER: `${API_SERVICES.EXERCISE}/exercises/submit`,
    GET_FEEDBACK: `${API_SERVICES.EXERCISE}/exercises/feedback`,
  },
  
  // Progress Service
  PROGRESS: {
    GET_PROGRESS: `${API_SERVICES.PROGRESS}/progress`,
    UPDATE_PROGRESS: `${API_SERVICES.PROGRESS}/progress/update`,
    GET_STATS: `${API_SERVICES.PROGRESS}/progress/stats`,
    GET_ACHIEVEMENTS: `${API_SERVICES.PROGRESS}/progress/achievements`,
    GET_LEARNING_STREAK: `${API_SERVICES.PROGRESS}/progress/streak`,
  },
  
  // Interview Service
  INTERVIEW: {
    WEBSOCKET: `${API_SERVICES.INTERVIEW.replace('http', 'ws')}/interview`,
  },
} as const;

// ===== HELPER FUNCTIONS =====
// Helper function to get auth headers
export function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper function for API calls
export async function apiCall<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Helper function to build URL with parameters
export function buildUrl(template: string, params: Record<string, string>): string {
  let url = template;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`{${key}}`, value);
  }
  return url;
}