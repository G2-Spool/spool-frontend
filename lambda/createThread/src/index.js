const { createThreadHandler } = require('./handlers/createThread');
const { getThreadHandler } = require('./handlers/getThread');
const { listThreadsHandler } = require('./handlers/listThreads');
const { updateThreadHandler } = require('./handlers/updateThread');

// Complete CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const { httpMethod, path, pathParameters } = event;
    
    // Extract path after /api/thread
    const basePath = path.replace(/^\/api\/thread\/?/, '');
    
    let response;
    
    // Route to appropriate handler
    if (httpMethod === 'POST' && (basePath === '' || basePath === 'create')) {
      response = await createThreadHandler(event);
    } else if (httpMethod === 'GET' && basePath === 'list') {
      response = await listThreadsHandler(event);
    } else if (httpMethod === 'GET' && pathParameters?.threadId) {
      response = await getThreadHandler(event);
    } else if (httpMethod === 'PUT' && pathParameters?.threadId) {
      response = await updateThreadHandler(event);
    } else if (httpMethod === 'GET' && basePath === 'connection/test') {
      // Connection test endpoint
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Thread API connection successful',
          timestamp: new Date().toISOString()
        })
      };
    } else {
      response = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid request',
          message: `Unsupported method ${httpMethod} for path ${path}`,
          availableEndpoints: [
            'POST /api/thread',
            'GET /api/thread/list',
            'GET /api/thread/{threadId}',
            'PUT /api/thread/{threadId}',
            'GET /api/thread/connection/test'
          ]
        })
      };
    }
    
    // Ensure all responses have CORS headers
    return {
      ...response,
      headers: {
        ...corsHeaders,
        ...(response.headers || {})
      }
    };
    
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}; 