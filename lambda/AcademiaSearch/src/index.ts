import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OpenAIService } from './services/OpenAIService';
import { PineconeService } from './services/PineconeService';
import { DatabaseService } from './services/DatabaseService';
import { ParameterStoreService } from './services/ParameterStoreService';
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
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

    const request: CreateThreadRequest = JSON.parse(event.body);
    
    // Validate required fields
    if (!request.question || !request.studentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: question, studentId' }),
      };
    }

    console.log('🚀 AcademiaSearch Lambda invoked:', {
      studentId: request.studentId,
      questionLength: request.question.length,
      interestCount: request.studentProfile?.interests?.length || 0
    });

    // Initialize services
    const parameterStore = new ParameterStoreService();
    const [openaiApiKey, pineconeApiKey, dbConfig] = await Promise.all([
      parameterStore.getParameter('/spool/openai-api-key'),
      parameterStore.getParameter('/spool/pinecone-api-key'),
      parameterStore.getDatabaseConfig()
    ]);

    const openaiService = new OpenAIService(openaiApiKey);
    const pineconeService = new PineconeService(pineconeApiKey);
    const databaseService = new DatabaseService(dbConfig);

    // Generate unique thread ID
    const threadId = uuidv4();

    // Step 1: Analyze user input with OpenAI to get 5 academic topic descriptions
    console.log('📝 Analyzing academic topics with OpenAI...');
    const academicAnalysis = await openaiService.analyzeAcademicTopics(
      request.question,
      request.studentProfile
    );

    // Step 2: Generate embeddings for the 5 descriptions and search Pinecone
    console.log('🔍 Searching Pinecone for relevant content...');
    const relevantChunks = await pineconeService.searchRelevantChunks(
      academicAnalysis.descriptions
    );

    // Step 3: Store results in RDS database
    console.log('💾 Storing results in database...');
    await databaseService.storeThreadData({
      threadId,
      studentId: request.studentId,
      originalQuestion: request.question,
      academicTopics: academicAnalysis.descriptions,
      relevantChunks,
      studentProfile: request.studentProfile
    });

    const response: CreateThreadResponse = {
      threadId,
      message: 'Learning thread created successfully with academic analysis and relevant content',
      topic: academicAnalysis.primaryTopic,
      category: academicAnalysis.primaryCategory
    };

    console.log('✅ AcademiaSearch completed successfully:', {
      threadId,
      topicCount: academicAnalysis.descriptions.length,
      chunkCount: relevantChunks.length
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('❌ AcademiaSearch Lambda error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};