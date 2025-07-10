// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  
  // Student Profile
  studentProfile: {
    get: '/api/student-profile',
    update: '/api/student-profile',
    interests: '/api/student-profile/interests',
  },
  
  // Voice Interview
  interview: {
    start: '/api/interview/start',
    complete: '/api/interview/complete',
    transcript: '/api/interview/transcript',
  },
  
  // Learning (Pinecone-powered)
  learning: {
    subjects: '/api/subjects',
    paths: '/api/learning-paths',
    pathById: '/api/learning-paths/:id',
    pathProgress: '/api/learning-paths/:id/progress',
    searchPaths: '/api/learning-paths/search',
    concept: '/api/concepts/:conceptId',
    progress: '/api/progress',
  },
  
  // Courses (Pinecone-powered)
  courses: {
    all: '/api/courses',
    search: '/api/courses/search',
    byId: '/api/courses/:id',
    recommendations: '/api/courses/recommendations',
  },
  
  // Exercises
  exercises: {
    generate: '/api/exercises/generate',
    submit: '/api/exercises/submit',
    evaluate: '/api/exercises/evaluate',
  },
  
  // Analytics
  analytics: {
    engagement: '/api/analytics/engagement',
    progress: '/api/analytics/progress',
  },
  
  // Admin
  admin: {
    pineconeStats: '/api/admin/pinecone/stats',
  },
  
  // Textbooks
  textbooks: {
    all: '/api/textbooks',
    byId: '/api/textbooks/:id',
  },
};