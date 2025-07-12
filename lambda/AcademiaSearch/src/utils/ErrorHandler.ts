import { APIGatewayProxyResult } from 'aws-lambda';
import { logger, LogContext } from './Logger';

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  OPENAI_ERROR = 'OPENAI_ERROR',
  PINECONE_ERROR = 'PINECONE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  PARAMETER_STORE_ERROR = 'PARAMETER_STORE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR'
}

export interface AppError extends Error {
  code: ErrorCode;
  statusCode: number;
  context?: LogContext;
  originalError?: Error;
}

export class AcademiaSearchError extends Error implements AppError {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly context?: LogContext;
  public readonly originalError?: Error;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    context?: LogContext,
    originalError?: Error
  ) {
    super(message);
    this.name = 'AcademiaSearchError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AcademiaSearchError);
    }
  }
}

export class ErrorHandler {
  static createValidationError(message: string, context?: LogContext): AcademiaSearchError {
    return new AcademiaSearchError(message, ErrorCode.VALIDATION_ERROR, 400, context);
  }

  static createOpenAIError(originalError: Error, context?: LogContext): AcademiaSearchError {
    return new AcademiaSearchError(
      'Failed to analyze academic topics with OpenAI',
      ErrorCode.OPENAI_ERROR,
      502,
      context,
      originalError
    );
  }

  static createPineconeError(originalError: Error, context?: LogContext): AcademiaSearchError {
    return new AcademiaSearchError(
      'Failed to search Pinecone vector database',
      ErrorCode.PINECONE_ERROR,
      502,
      context,
      originalError
    );
  }

  static createDatabaseError(originalError: Error, context?: LogContext): AcademiaSearchError {
    return new AcademiaSearchError(
      'Database operation failed',
      ErrorCode.DATABASE_ERROR,
      500,
      context,
      originalError
    );
  }

  static createParameterStoreError(originalError: Error, context?: LogContext): AcademiaSearchError {
    return new AcademiaSearchError(
      'Failed to retrieve configuration from Parameter Store',
      ErrorCode.PARAMETER_STORE_ERROR,
      500,
      context,
      originalError
    );
  }

  static createTimeoutError(operation: string, context?: LogContext): AcademiaSearchError {
    return new AcademiaSearchError(
      `Operation timeout: ${operation}`,
      ErrorCode.TIMEOUT_ERROR,
      504,
      context
    );
  }

  static createRateLimitError(service: string, context?: LogContext): AcademiaSearchError {
    return new AcademiaSearchError(
      `Rate limit exceeded for ${service}`,
      ErrorCode.RATE_LIMIT_ERROR,
      429,
      context
    );
  }

  static handleError(error: Error | AcademiaSearchError, context?: LogContext): APIGatewayProxyResult {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // If it's already an AcademiaSearchError, use its properties
    if (error instanceof AcademiaSearchError) {
      logger.error('Academia Search Error', {
        ...context,
        ...error.context,
        errorCode: error.code,
        statusCode: error.statusCode
      }, error.originalError || error);

      return {
        statusCode: error.statusCode,
        headers,
        body: JSON.stringify({
          error: error.message,
          code: error.code,
          requestId: context?.requestId,
          timestamp: new Date().toISOString()
        }),
      };
    }

    // Handle OpenAI specific errors
    if (error.message.includes('OpenAI') || error.message.includes('openai')) {
      const openaiError = this.createOpenAIError(error, context);
      return this.handleError(openaiError, context);
    }

    // Handle Pinecone specific errors
    if (error.message.includes('Pinecone') || error.message.includes('pinecone')) {
      const pineconeError = this.createPineconeError(error, context);
      return this.handleError(pineconeError, context);
    }

    // Handle database specific errors
    if (error.message.includes('database') || error.message.includes('PostgreSQL') || error.message.includes('pg')) {
      const dbError = this.createDatabaseError(error, context);
      return this.handleError(dbError, context);
    }

    // Handle Parameter Store errors
    if (error.message.includes('Parameter') || error.message.includes('SSM')) {
      const paramError = this.createParameterStoreError(error, context);
      return this.handleError(paramError, context);
    }

    // Handle timeout errors
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      const timeoutError = this.createTimeoutError('Unknown operation', context);
      return this.handleError(timeoutError, context);
    }

    // Handle rate limit errors
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      const rateLimitError = this.createRateLimitError('Unknown service', context);
      return this.handleError(rateLimitError, context);
    }

    // Default to internal error
    logger.error('Unhandled Error', context, error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        code: ErrorCode.INTERNAL_ERROR,
        requestId: context?.requestId,
        timestamp: new Date().toISOString()
      }),
    };
  }
}

// Utility function to add timeout to promises
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(ErrorHandler.createTimeoutError(operation));
      }, timeoutMs);
    })
  ]);
}