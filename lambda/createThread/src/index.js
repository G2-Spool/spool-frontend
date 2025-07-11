const { createThreadHandler } = require('./handlers/createThread');
const { getThreadHandler } = require('./handlers/getThread');
const { listThreadsHandler } = require('./handlers/listThreads');
const { updateThreadHandler } = require('./handlers/updateThread');

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const { httpMethod, path, pathParameters } = event;
    
    // Extract path after /api/thread/
    const threadPath = path.replace('/api/thread/', '');
    
    // Route to appropriate handler
    if (httpMethod === 'POST' && threadPath === 'create') {
      return await createThreadHandler(event);
    } else if (httpMethod === 'GET' && pathParameters?.id) {
      return await getThreadHandler(event);
    } else if (httpMethod === 'GET' && threadPath.startsWith('list/')) {
      return await listThreadsHandler(event);
    } else if (httpMethod === 'PUT' && pathParameters?.id) {
      return await updateThreadHandler(event);
    } else {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Invalid request',
          message: `Unsupported method ${httpMethod} for path ${path}`
        })
      };
    }
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};