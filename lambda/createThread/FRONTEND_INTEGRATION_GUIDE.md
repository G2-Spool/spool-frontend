# Frontend Integration Guide for Thread API

## API Configuration

### Base URL
```javascript
const API_URL = 'https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod';
```

### Request Configuration
```javascript
const makeRequest = async (endpoint, options = {}) => {
  const token = await getIdToken(); // Your Cognito token retrieval
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include', // Important for CORS with credentials
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
```

## Available Endpoints

### Thread API
```javascript
export const threadAPI = {
  // List all threads
  list: () => makeRequest('/api/thread/list'),
  
  // Create a new thread
  create: (data) => makeRequest('/api/thread', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Get specific thread
  get: (threadId) => makeRequest(`/api/thread/${threadId}`),
  
  // Update thread
  update: (threadId, data) => makeRequest(`/api/thread/${threadId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Get thread graph
  getGraph: (threadId) => makeRequest(`/api/thread/${threadId}/graph`),
};
```

## CORS Configuration
The Lambda function now returns the following CORS headers:
- `Access-Control-Allow-Origin`: http://localhost:5173 (or * in development)
- `Access-Control-Allow-Methods`: GET, POST, PUT, DELETE, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization, and AWS-specific headers
- `Access-Control-Allow-Credentials`: true

## Error Handling
All endpoints return consistent error responses with CORS headers:
```javascript
{
  "error": "Error type",
  "message": "Detailed error message",
  "requestId": "AWS request ID (if available)"
}
```

## Authentication
All endpoints require a valid Cognito JWT token in the Authorization header:
```
Authorization: Bearer <your-cognito-jwt-token>
```

## Testing the Integration
1. Ensure your frontend is running on `http://localhost:5173`
2. Make sure you have a valid Cognito token
3. Test with a simple request:

```javascript
// Test connection
threadAPI.list()
  .then(data => console.log('Threads:', data))
  .catch(error => console.error('Error:', error));
```

## Troubleshooting
1. If you get CORS errors, check:
   - The Origin header matches the configured ALLOWED_ORIGIN
   - You're including credentials in the request
   - The Authorization header is properly formatted

2. If you get 401/403 errors:
   - Verify your Cognito token is valid and not expired
   - Check that the token includes the correct user pool ID

3. Check browser DevTools Network tab for:
   - Request headers being sent
   - Response headers received
   - Any preflight OPTIONS requests