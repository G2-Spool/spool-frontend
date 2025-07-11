const { ThreadService } = require('../services/threadService');
const { extractUserFromEvent } = require('../utils/auth');

const threadService = new ThreadService();

exports.listThreadsHandler = async (event) => {
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

    // Extract studentId from path
    const pathMatch = event.path.match(/\/list\/([^/]+)$/);
    const studentId = pathMatch ? pathMatch[1] : null;

    if (!studentId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Student ID is required' })
      };
    }

    // Check if user has access to these threads
    const isAdmin = user['cognito:groups']?.includes('admins');
    const isEducator = user['cognito:groups']?.includes('educators');
    const isOwnThreads = studentId === user.sub;

    if (!isOwnThreads && !isAdmin && !isEducator) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Access denied' })
      };
    }

    // Parse query parameters
    const limit = parseInt(event.queryStringParameters?.limit || '20', 10);
    const offset = parseInt(event.queryStringParameters?.offset || '0', 10);

    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Limit must be between 1 and 100' })
      };
    }

    // Get threads from PostgreSQL
    const result = await threadService.listThreadsByStudent(studentId, limit, offset);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        threads: result.threads,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
        nextOffset: result.nextOffset,
        limit,
        offset
      })
    };
  } catch (error) {
    console.error('Error listing threads:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to list threads', message: error.message })
    };
  }
};