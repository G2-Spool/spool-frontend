const { createThreadHandler } = require('./handlers/createThread');
const { getThreadHandler } = require('./handlers/getThread');
const { listThreadsHandler } = require('./handlers/listThreads');
const { updateThreadHandler } = require('./handlers/updateThread');

// CORS headers that work with Cognito and API Gateway
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Helper function to ensure all responses have CORS headers
const createResponse = (statusCode, body, additionalHeaders = {}) => {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      ...additionalHeaders
    },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  };
};

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, '');
  }

  try {
    const { httpMethod, path, pathParameters, resource } = event;
    
    // Use resource path for routing (more reliable than path)
    // Resource will be like "/api/thread/{proxy+}" or specific resource paths
    const resourcePath = resource || path;
    
    let response;
    
    // Normalize the path by removing trailing slashes and handling proxy
    const normalizedPath = path ? path.replace(/\/$/, '') : '';
    
    // Handle different API Gateway integration patterns
    if (resource && resource.includes('{proxy+}')) {
      // Proxy integration - parse the actual path
      const proxyPath = normalizedPath.replace(/^\/api/, '');
      
      switch (true) {
        case httpMethod === 'POST' && proxyPath === '/thread':
          response = await createThreadHandler(event);
          break;
          
        case httpMethod === 'GET' && proxyPath === '/thread':
          response = await listThreadsHandler(event);
          break;
          
        case httpMethod === 'GET' && proxyPath === '/thread/list':
          response = await listThreadsHandler(event);
          break;
          
        case httpMethod === 'GET' && proxyPath.match(/^\/thread\/[^\/]+$/):
          response = await getThreadHandler(event);
          break;
          
        case httpMethod === 'PUT' && proxyPath.match(/^\/thread\/[^\/]+$/):
          response = await updateThreadHandler(event);
          break;
          
        case httpMethod === 'GET' && proxyPath === '/thread/connection/test':
          response = createResponse(200, {
            message: 'Thread API connection successful',
            timestamp: new Date().toISOString(),
            lambdaName: process.env.AWS_LAMBDA_FUNCTION_NAME,
            region: process.env.AWS_REGION
          });
          break;
          
        default:
          response = createResponse(400, {
            error: 'Invalid request',
            message: `Unsupported method ${httpMethod} for path ${proxyPath}`,
            debug: { path: normalizedPath, resource, httpMethod, proxyPath },
            availableEndpoints: [
              'POST /api/thread',
              'GET /api/thread',
              'GET /api/thread/list', 
              'GET /api/thread/{threadId}',
              'PUT /api/thread/{threadId}',
              'GET /api/thread/connection/test'
            ]
          });
      }
    } else {
      // Direct resource mapping
      switch (true) {
        case httpMethod === 'POST' && resourcePath === '/api/thread':
          response = await createThreadHandler(event);
          break;
          
        case httpMethod === 'GET' && resourcePath === '/api/thread':
          response = await listThreadsHandler(event);
          break;
          
        case httpMethod === 'GET' && resourcePath === '/api/thread/list':
          response = await listThreadsHandler(event);
          break;
          
        case httpMethod === 'GET' && resourcePath === '/api/thread/{threadId}':
          response = await getThreadHandler(event);
          break;
          
        case httpMethod === 'PUT' && resourcePath === '/api/thread/{threadId}':
          response = await updateThreadHandler(event);
          break;
          
        case httpMethod === 'GET' && resourcePath === '/api/thread/connection/test':
          response = createResponse(200, {
            message: 'Thread API connection successful',
            timestamp: new Date().toISOString(),
            lambdaName: process.env.AWS_LAMBDA_FUNCTION_NAME,
            region: process.env.AWS_REGION
          });
          break;
          
        default:
          response = createResponse(400, {
            error: 'Invalid request',
            message: `Unsupported method ${httpMethod} for resource ${resourcePath}`,
            debug: { path, resource: resourcePath, httpMethod },
            availableEndpoints: [
              'POST /api/thread',
              'GET /api/thread',
              'GET /api/thread/list', 
              'GET /api/thread/{threadId}',
              'PUT /api/thread/{threadId}',
              'GET /api/thread/connection/test'
            ]
          });
      }
    }
    
    // Ensure response has CORS headers even if handler didn't include them
    if (!response.headers) {
      response.headers = {};
    }
    
    // Merge CORS headers with any existing headers
    response.headers = {
      ...corsHeaders,
      ...response.headers
    };
    
    return response;
    
  } catch (error) {
    console.error('Lambda error:', error);
    console.error('Stack trace:', error.stack);
    
    return createResponse(500, {
      error: 'Internal server error',
      message: error.message,
      requestId: event.requestContext?.requestId
    });
  }
}; 