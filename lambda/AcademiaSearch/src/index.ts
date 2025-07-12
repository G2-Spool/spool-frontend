import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OpenAIService } from './services/OpenAIService';
import { PineconeService } from './services/PineconeService';
import { DatabaseService } from './services/DatabaseService';
import { ParameterStoreService } from './services/ParameterStoreService';
import { logger } from './utils/Logger';
import { ErrorHandler, withTimeout } from './utils/ErrorHandler';
import { v4 as uuidv4 } from 'uuid';

interface CreateThreadRequest {
  question: string;
  studentId: string;
  studentProfile: {
    interests: Array<{
      interest: string;
      category: string;
      strength: number;
    }>;
    firstName?: string;
    grade?: string;
  };
}

interface CreateThreadResponse {
  threadId: string;
  message: string;
  topic?: string;
  category?: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const requestId = event.requestContext?.requestId || 'unknown';
  const startTime = Date.now();

  const context = {
    requestId,
    functionName: 'AcademiaSearch'
  };

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    logger.apiRequest(event.httpMethod, event.path || '/api/academia-search/create-thread', context);

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    if (event.httpMethod !== 'POST') {
      throw ErrorHandler.createValidationError('Method not allowed', context);
    }

    if (!event.body) {
      throw ErrorHandler.createValidationError('Missing request body', context);
    }

    const request: CreateThreadRequest = JSON.parse(event.body);
    
    // Validate required fields
    if (!request.question || !request.studentId) {
      throw ErrorHandler.createValidationError('Missing required fields: question, studentId', context);
    }

    const requestContext = {
      ...context,
      studentId: request.studentId,
      questionLength: request.question.length,
      interestCount: request.studentProfile?.interests?.length || 0
    };

    logger.info('AcademiaSearch Lambda invoked', requestContext);

    // Initialize services with timeout
    logger.serviceCall('ParameterStore', 'getCredentials', requestContext);
    const parameterStore = new ParameterStoreService();
    const [openaiApiKey, pineconeApiKey, dbConfig] = await withTimeout(
      Promise.all([
        parameterStore.getParameter('/spool/openai-api-key'),
        parameterStore.getParameter('/spool/pinecone-api-key'),
        parameterStore.getDatabaseConfig()
      ]),
      10000,
      'Parameter Store credential retrieval'
    );

    const openaiService = new OpenAIService(openaiApiKey);
    const pineconeService = new PineconeService(pineconeApiKey);
    const databaseService = new DatabaseService(dbConfig);

    // Generate unique thread ID
    const threadId = uuidv4();
    const threadContext = { ...requestContext, threadId };

    // Step 1: Analyze user input with OpenAI to get 5 academic topic descriptions
    logger.serviceCall('OpenAI', 'analyzeAcademicTopics', threadContext);
    const analysisStart = Date.now();
    const academicAnalysis = await withTimeout(
      openaiService.analyzeAcademicTopics(request.question, request.studentProfile),
      20000,
      'OpenAI academic analysis'
    );
    logger.serviceResponse('OpenAI', 'analyzeAcademicTopics', true, Date.now() - analysisStart, {
      ...threadContext,
      descriptionsCount: academicAnalysis.descriptions.length,
      primaryTopic: academicAnalysis.primaryTopic
    });

    // Step 2: Generate embeddings for the 5 descriptions and search Pinecone
    logger.serviceCall('Pinecone', 'searchRelevantChunks', threadContext);
    const searchStart = Date.now();
    const relevantChunks = await withTimeout(
      pineconeService.searchRelevantChunks(academicAnalysis.descriptions),
      15000,
      'Pinecone vector search'
    );
    logger.serviceResponse('Pinecone', 'searchRelevantChunks', true, Date.now() - searchStart, {
      ...threadContext,
      chunksFound: relevantChunks.length,
      averageScore: relevantChunks.reduce((sum, chunk) => sum + chunk.score, 0) / relevantChunks.length
    });

    // Step 3: Store results in RDS database
    logger.serviceCall('Database', 'storeThreadData', threadContext);
    const storeStart = Date.now();
    await withTimeout(
      databaseService.storeThreadData({
        threadId,
        studentId: request.studentId,
        originalQuestion: request.question,
        academicTopics: academicAnalysis.descriptions,
        relevantChunks,
        studentProfile: request.studentProfile
      }),
      10000,
      'Database storage'
    );
    logger.serviceResponse('Database', 'storeThreadData', true, Date.now() - storeStart, threadContext);

    const response: CreateThreadResponse = {
      threadId,
      message: 'Learning thread created successfully with academic analysis and relevant content',
      topic: academicAnalysis.primaryTopic,
      category: academicAnalysis.primaryCategory
    };

    const totalDuration = Date.now() - startTime;
    logger.apiResponse(event.httpMethod, event.path || '/api/academia-search/create-thread', 200, totalDuration, {
      ...threadContext,
      topicCount: academicAnalysis.descriptions.length,
      chunkCount: relevantChunks.length
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    logger.apiResponse(event.httpMethod, event.path || '/api/academia-search/create-thread', 500, totalDuration, context);
    
    return ErrorHandler.handleError(error as Error, context);
  }
};