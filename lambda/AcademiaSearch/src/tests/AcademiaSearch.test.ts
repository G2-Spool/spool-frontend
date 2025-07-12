import { handler } from '../index';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

// Mock the services
jest.mock('../services/OpenAIService');
jest.mock('../services/PineconeService');
jest.mock('../services/DatabaseService');
jest.mock('../services/ParameterStoreService');

describe('AcademiaSearch Lambda Handler', () => {
  const mockContext: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'AcademiaSearch',
    functionVersion: '1',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:AcademiaSearch',
    memoryLimitInMB: '512',
    awsRequestId: 'test-request-id',
    logGroupName: '/aws/lambda/AcademiaSearch',
    logStreamName: '2023/01/01/[$LATEST]abcdef123456',
    getRemainingTimeInMillis: () => 30000,
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.LOG_LEVEL = 'ERROR'; // Reduce noise in tests
  });

  describe('CORS handling', () => {
    it('should handle OPTIONS request for CORS preflight', async () => {
      const event: Partial<APIGatewayProxyEvent> = {
        httpMethod: 'OPTIONS',
        headers: {},
        body: null,
      };

      const result = await handler(event as APIGatewayProxyEvent, mockContext);

      expect(result.statusCode).toBe(200);
      expect(result.headers).toEqual(
        expect.objectContaining({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        })
      );
      expect(result.body).toBe('');
    });
  });

  describe('Request validation', () => {
    it('should reject non-POST requests', async () => {
      const event: Partial<APIGatewayProxyEvent> = {
        httpMethod: 'GET',
        headers: {},
        body: null,
      };

      const result = await handler(event as APIGatewayProxyEvent, mockContext);

      expect(result.statusCode).toBe(405);
      expect(JSON.parse(result.body)).toEqual({ error: 'Method not allowed' });
    });

    it('should reject requests without body', async () => {
      const event: Partial<APIGatewayProxyEvent> = {
        httpMethod: 'POST',
        headers: {},
        body: null,
      };

      const result = await handler(event as APIGatewayProxyEvent, mockContext);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ error: 'Missing request body' });
    });

    it('should reject requests missing required fields', async () => {
      const event: Partial<APIGatewayProxyEvent> = {
        httpMethod: 'POST',
        headers: {},
        body: JSON.stringify({
          // Missing question and studentId
          studentProfile: { interests: [] }
        }),
      };

      const result = await handler(event as APIGatewayProxyEvent, mockContext);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ 
        error: 'Missing required fields: question, studentId' 
      });
    });
  });

  describe('Successful request processing', () => {
    it('should process valid request successfully', async () => {
      // Mock the services to return successful responses
      const mockOpenAIService = require('../services/OpenAIService').OpenAIService;
      const mockPineconeService = require('../services/PineconeService').PineconeService;
      const mockDatabaseService = require('../services/DatabaseService').DatabaseService;
      const mockParameterStoreService = require('../services/ParameterStoreService').ParameterStoreService;

      mockParameterStoreService.prototype.getParameter = jest.fn()
        .mockResolvedValueOnce('test-openai-key')
        .mockResolvedValueOnce('test-pinecone-key');
      
      mockParameterStoreService.prototype.getDatabaseConfig = jest.fn()
        .mockResolvedValue({
          host: 'test-host',
          port: 5432,
          database: 'test-db',
          username: 'test-user',
          password: 'test-pass'
        });

      mockOpenAIService.prototype.analyzeAcademicTopics = jest.fn()
        .mockResolvedValue({
          descriptions: [
            'Machine learning fundamentals and neural networks',
            'Computer science algorithms and data structures',
            'Artificial intelligence and cognitive computing',
            'Mathematics and statistical analysis',
            'Software engineering and system design'
          ],
          primaryTopic: 'Computer Science',
          primaryCategory: 'STEM'
        });

      mockPineconeService.prototype.searchRelevantChunks = jest.fn()
        .mockResolvedValue([
          {
            id: 'chunk-1',
            content: 'Neural networks are computational models...',
            metadata: { source: 'textbook', subject: 'AI' },
            score: 0.95
          },
          {
            id: 'chunk-2',
            content: 'Machine learning algorithms learn patterns...',
            metadata: { source: 'research', subject: 'ML' },
            score: 0.92
          }
        ]);

      mockDatabaseService.prototype.storeThreadData = jest.fn()
        .mockResolvedValue(undefined);

      const event: Partial<APIGatewayProxyEvent> = {
        httpMethod: 'POST',
        headers: {},
        body: JSON.stringify({
          question: 'How do neural networks learn?',
          studentId: 'test-student-123',
          studentProfile: {
            interests: [
              { interest: 'Machine Learning', category: 'career', strength: 8 }
            ],
            firstName: 'Test',
            grade: '12'
          }
        }),
      };

      const result = await handler(event as APIGatewayProxyEvent, mockContext);

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody).toEqual(
        expect.objectContaining({
          threadId: expect.any(String),
          message: 'Learning thread created successfully with academic analysis and relevant content',
          topic: 'Computer Science',
          category: 'STEM'
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle OpenAI service errors', async () => {
      const mockParameterStoreService = require('../services/ParameterStoreService').ParameterStoreService;
      const mockOpenAIService = require('../services/OpenAIService').OpenAIService;

      mockParameterStoreService.prototype.getParameter = jest.fn()
        .mockResolvedValue('test-key');
      mockParameterStoreService.prototype.getDatabaseConfig = jest.fn()
        .mockResolvedValue({});

      mockOpenAIService.prototype.analyzeAcademicTopics = jest.fn()
        .mockRejectedValue(new Error('OpenAI API error'));

      const event: Partial<APIGatewayProxyEvent> = {
        httpMethod: 'POST',
        headers: {},
        body: JSON.stringify({
          question: 'Test question',
          studentId: 'test-student',
          studentProfile: { interests: [] }
        }),
      };

      const result = await handler(event as APIGatewayProxyEvent, mockContext);

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual(
        expect.objectContaining({
          error: 'Internal server error'
        })
      );
    });
  });
});