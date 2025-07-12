// API Configuration for Spool Frontend
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