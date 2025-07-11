const { v4: uuidv4 } = require('uuid');
const { LearningPathService } = require('../services/learningPathService');
const { validateCreateLearningPathRequest } = require('../utils/validation');
const { extractUserFromEvent, getStudentProfileId } = require('../utils/auth');

const learningPathService = new LearningPathService();

exports.createThreadHandler = async (event) => {
  try {
    // Extract user information from Cognito authorizer
    const user = extractUserFromEvent(event);
    if (!user) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // Parse and validate request body
    const body = JSON.parse(event.body || '{}');
    const validation = validateCreateLearningPathRequest(body);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Validation error', details: validation.errors })
      };
    }

    // Get student profile ID (might be different from user ID)
    const studentProfileId = await getStudentProfileId(user.sub);
    if (!studentProfileId) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Student profile not found' })
      };
    }

    // Check if learning path already exists for this subject
    const existingPath = await learningPathService.getLearningPathByStudentAndSubject(
      studentProfileId, 
      body.subject
    );
    
    if (existingPath) {
      return {
        statusCode: 409,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          error: 'Learning path already exists', 
          learningPath: existingPath 
        })
      };
    }

    // Create learning path object based on ERD schema
    const learningPath = {
      id: uuidv4(),
      studentProfileId,
      textbookId: body.textbookId || null,
      subject: body.subject,
      currentTopicId: body.currentTopicId || null,
      currentSectionId: body.currentSectionId || null,
      currentConceptId: body.currentConceptId || null,
      nextConceptId: body.nextConceptId || null,
      availableConcepts: body.availableConcepts || [],
      conceptsCompleted: 0,
      conceptsTotal: body.conceptsTotal || 0,
      conceptsMastered: 0,
      averageMasteryScore: 0,
      estimatedCompletionDate: body.estimatedCompletionDate || null,
      dailyTargetMinutes: body.dailyTargetMinutes || 30,
      status: 'active'
    };

    // Save to PostgreSQL
    await learningPathService.createLearningPath(learningPath);

    // Return success response
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Location': `/api/thread/${learningPath.id}`
      },
      body: JSON.stringify({
        message: 'Learning path created successfully',
        learningPath
      })
    };
  } catch (error) {
    console.error('Error creating thread:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to create learning path', message: error.message })
    };
  }
};