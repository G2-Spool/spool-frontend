const { ThreadService } = require('../services/threadService');
const { validateUpdateThreadRequest } = require('../utils/validation');
const { extractUserFromEvent } = require('../utils/auth');

const threadService = new ThreadService();

exports.updateThreadHandler = async (event) => {
  try {
    // Extract user information
    const user = extractUserFromEvent(event);
    if (!user) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const threadId = event.pathParameters?.id;
    if (!threadId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Thread ID is required' })
      };
    }

    // Parse and validate request body
    const body = JSON.parse(event.body || '{}');
    const validation = validateUpdateThreadRequest(body);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Validation error', details: validation.errors })
      };
    }

    // Get existing thread to check permissions
    const existingThread = await threadService.getThread(threadId);
    if (!existingThread) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Thread not found' })
      };
    }

    // Check if user has permission to update
    const isAdmin = user['cognito:groups']?.includes('admins');
    const isOwner = existingThread.studentId === user.sub;
    
    if (!isOwner && !isAdmin) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Access denied' })
      };
    }

    // Update thread
    const updatedThread = await threadService.updateThread(threadId, body);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        message: 'Thread updated successfully',
        thread: updatedThread
      })
    };
  } catch (error) {
    console.error('Error updating thread:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to update thread', message: error.message })
    };
  }
};