// API Configuration for Spool Frontend
// Supabase Edge Functions Base URL
const SUPABASE_URL = 'https://ubtwzfbtfekmgvswlfsd.supabase.co';
const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

export const API_BASE_URL = SUPABASE_FUNCTIONS_URL;

// Environment-specific endpoints
export const API_ENDPOINTS = {
  production: SUPABASE_FUNCTIONS_URL,
  staging: SUPABASE_FUNCTIONS_URL,
  development: 'http://localhost:54321/functions/v1', // Supabase local development
  
  // Service-specific edge function endpoints
  academiaSearch: {
    createThread: `${SUPABASE_FUNCTIONS_URL}/academia-search`,
    search: `${SUPABASE_FUNCTIONS_URL}/academia-search`
  },
  interview: {
    start: `${SUPABASE_FUNCTIONS_URL}/interview-start`,
    message: `${SUPABASE_FUNCTIONS_URL}/interview-message`,
    end: `${SUPABASE_FUNCTIONS_URL}/interview-end`
  },
  studentProfile: {
    get: `${SUPABASE_FUNCTIONS_URL}/student-profile`,
    update: `${SUPABASE_FUNCTIONS_URL}/student-profile`
  },
  learning: {
    paths: `${SUPABASE_FUNCTIONS_URL}/learning-paths`,
    pathById: `${SUPABASE_FUNCTIONS_URL}/learning-paths/:id`,
    searchPaths: `${SUPABASE_FUNCTIONS_URL}/learning-paths/search`,
    pathProgress: `${SUPABASE_FUNCTIONS_URL}/learning-paths/:id/progress`
  },
  textbooks: {
    all: `${SUPABASE_FUNCTIONS_URL}/textbooks`,
    byId: `${SUPABASE_FUNCTIONS_URL}/textbooks/:id`
  },
  students: `${SUPABASE_FUNCTIONS_URL}/students`,
  
  // Supabase Edge Functions
  contentAssembly: `${SUPABASE_FUNCTIONS_URL}/content-assembly`,
  exerciseGeneration: `${SUPABASE_FUNCTIONS_URL}/exercise-generation`,
  interestDiscovery: `${SUPABASE_FUNCTIONS_URL}/interest-discovery`,
  progressTracking: `${SUPABASE_FUNCTIONS_URL}/progress-tracking`,
  threadDiscovery: `${SUPABASE_FUNCTIONS_URL}/thread-discovery`,
  threadGeneration: `${SUPABASE_FUNCTIONS_URL}/thread-generation`
} as const;

// Thread-specific edge function endpoints
export const THREAD_ENDPOINTS = {
  graph: `${SUPABASE_FUNCTIONS_URL}/thread-graph`,
  list: `${SUPABASE_FUNCTIONS_URL}/threads`, 
  connection: `${SUPABASE_FUNCTIONS_URL}/thread-connection-test`,
  create: `${SUPABASE_FUNCTIONS_URL}/thread-create`,
  update: `${SUPABASE_FUNCTIONS_URL}/thread-update`
} as const;

// Helper function to get the appropriate base URL based on environment
export function getApiBaseUrl(): string {
  const env = import.meta.env.MODE || 'development';
  if (env === 'development' && import.meta.env.VITE_USE_LOCAL_SUPABASE === 'true') {
    return 'http://localhost:54321/functions/v1';
  }
  return SUPABASE_FUNCTIONS_URL;
}