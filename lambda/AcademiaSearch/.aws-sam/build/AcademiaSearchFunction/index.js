"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const OpenAIService_1 = require("./services/OpenAIService");
const PineconeService_1 = require("./services/PineconeService");
const DatabaseService_1 = require("./services/DatabaseService");
const ParameterStoreService_1 = require("./services/ParameterStoreService");
const Logger_1 = require("./utils/Logger");
const ErrorHandler_1 = require("./utils/ErrorHandler");
const uuid_1 = require("uuid");
const handler = async (event) => {
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
        Logger_1.logger.apiRequest(event.httpMethod, event.path || '/api/academia-search/create-thread', context);
        // Handle CORS preflight
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: '',
            };
        }
        if (event.httpMethod !== 'POST') {
            throw ErrorHandler_1.ErrorHandler.createValidationError('Method not allowed', context);
        }
        if (!event.body) {
            throw ErrorHandler_1.ErrorHandler.createValidationError('Missing request body', context);
        }
        const request = JSON.parse(event.body);
        // Validate required fields
        if (!request.question || !request.studentId) {
            throw ErrorHandler_1.ErrorHandler.createValidationError('Missing required fields: question, studentId', context);
        }
        const requestContext = {
            ...context,
            studentId: request.studentId,
            questionLength: request.question.length,
            interestCount: request.studentProfile?.interests?.length || 0
        };
        Logger_1.logger.info('AcademiaSearch Lambda invoked', requestContext);
        // Initialize services with timeout
        Logger_1.logger.serviceCall('ParameterStore', 'getCredentials', requestContext);
        const parameterStore = new ParameterStoreService_1.ParameterStoreService();
        const [openaiApiKey, pineconeApiKey, dbConfig] = await (0, ErrorHandler_1.withTimeout)(Promise.all([
            parameterStore.getParameter('/spool/openai-api-key'),
            parameterStore.getParameter('/spool/pinecone-api-key'),
            parameterStore.getDatabaseConfig()
        ]), 10000, 'Parameter Store credential retrieval');
        const openaiService = new OpenAIService_1.OpenAIService(openaiApiKey);
        const pineconeService = new PineconeService_1.PineconeService(pineconeApiKey);
        const databaseService = new DatabaseService_1.DatabaseService(dbConfig);
        // Generate unique thread ID
        const threadId = (0, uuid_1.v4)();
        const threadContext = { ...requestContext, threadId };
        // Step 1: Analyze user input with OpenAI to get 5 academic topic descriptions
        Logger_1.logger.serviceCall('OpenAI', 'analyzeAcademicTopics', threadContext);
        const analysisStart = Date.now();
        const academicAnalysis = await (0, ErrorHandler_1.withTimeout)(openaiService.analyzeAcademicTopics(request.question, request.studentProfile), 20000, 'OpenAI academic analysis');
        Logger_1.logger.serviceResponse('OpenAI', 'analyzeAcademicTopics', true, Date.now() - analysisStart, {
            ...threadContext,
            descriptionsCount: academicAnalysis.descriptions.length,
            primaryTopic: academicAnalysis.primaryTopic
        });
        // Step 2: Generate embeddings for the 5 descriptions and search Pinecone
        Logger_1.logger.serviceCall('Pinecone', 'searchRelevantChunks', threadContext);
        const searchStart = Date.now();
        const relevantChunks = await (0, ErrorHandler_1.withTimeout)(pineconeService.searchRelevantChunks(academicAnalysis.descriptions), 15000, 'Pinecone vector search');
        Logger_1.logger.serviceResponse('Pinecone', 'searchRelevantChunks', true, Date.now() - searchStart, {
            ...threadContext,
            chunksFound: relevantChunks.length,
            averageScore: relevantChunks.reduce((sum, chunk) => sum + chunk.score, 0) / relevantChunks.length
        });
        // Step 3: Store results in RDS database
        Logger_1.logger.serviceCall('Database', 'storeThreadData', threadContext);
        const storeStart = Date.now();
        await (0, ErrorHandler_1.withTimeout)(databaseService.storeThreadData({
            threadId,
            studentId: request.studentId,
            originalQuestion: request.question,
            academicTopics: academicAnalysis.descriptions,
            relevantChunks,
            studentProfile: request.studentProfile
        }), 10000, 'Database storage');
        Logger_1.logger.serviceResponse('Database', 'storeThreadData', true, Date.now() - storeStart, threadContext);
        const response = {
            threadId,
            message: 'Learning thread created successfully with academic analysis and relevant content',
            topic: academicAnalysis.primaryTopic,
            category: academicAnalysis.primaryCategory
        };
        const totalDuration = Date.now() - startTime;
        Logger_1.logger.apiResponse(event.httpMethod, event.path || '/api/academia-search/create-thread', 200, totalDuration, {
            ...threadContext,
            topicCount: academicAnalysis.descriptions.length,
            chunkCount: relevantChunks.length
        });
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response),
        };
    }
    catch (error) {
        const totalDuration = Date.now() - startTime;
        Logger_1.logger.apiResponse(event.httpMethod, event.path || '/api/academia-search/create-thread', 500, totalDuration, context);
        return ErrorHandler_1.ErrorHandler.handleError(error, context);
    }
};
exports.handler = handler;
