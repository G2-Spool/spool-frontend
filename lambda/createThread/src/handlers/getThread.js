const { LearningPathService } = require('../services/learningPathService');
const { extractUserFromEvent, getStudentProfileId } = require('../utils/auth');

const learningPathService = new LearningPathService();

exports.getThreadHandler = async (event) => {
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

    const learningPathId = event.pathParameters?.id;
    if (!learningPathId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Learning path ID is required' })
      };
    }

    // Get learning path from PostgreSQL
    const learningPath = await learningPathService.getLearningPath(learningPathId);
    
    if (!learningPath) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Learning path not found' })
      };
    }

    // Get student profile ID
    const studentProfileId = await getStudentProfileId(user.sub);
    
    // Check if user has access to this learning path
    const isAdmin = user['cognito:groups']?.includes('admins');
    const isEducator = user['cognito:groups']?.includes('educators');
    const isOwner = learningPath.studentProfileId === studentProfileId;
    
    if (!isOwner && !isAdmin && !isEducator) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Access denied' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ learningPath })
    };
  } catch (error) {
    console.error('Error getting thread:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to get learning path', message: error.message })
    };
  }
};