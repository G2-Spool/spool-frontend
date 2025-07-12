export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogContext {
  requestId?: string;
  studentId?: string;
  threadId?: string;
  functionName?: string;
  timestamp?: string;
  [key: string]: any;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    this.logLevel = this.parseLogLevel(process.env.LOG_LEVEL || 'INFO');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level.toUpperCase()) {
      case 'DEBUG': return LogLevel.DEBUG;
      case 'INFO': return LogLevel.INFO;
      case 'WARN': return LogLevel.WARN;
      case 'ERROR': return LogLevel.ERROR;
      default: return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): any {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return logEntry;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(JSON.stringify(this.formatLog(LogLevel.DEBUG, message, context)));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(JSON.stringify(this.formatLog(LogLevel.INFO, message, context)));
    }
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(JSON.stringify(this.formatLog(LogLevel.WARN, message, context, error)));
    }
  }

  error(message: string, context?: LogContext, error?: Error): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(JSON.stringify(this.formatLog(LogLevel.ERROR, message, context, error)));
    }
  }

  // Helper methods for common logging patterns
  apiRequest(method: string, path: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${path}`, {
      ...context,
      type: 'api_request',
      method,
      path
    });
  }

  apiResponse(method: string, path: string, statusCode: number, duration: number, context?: LogContext): void {
    this.info(`API Response: ${method} ${path} - ${statusCode}`, {
      ...context,
      type: 'api_response',
      method,
      path,
      statusCode,
      duration
    });
  }

  serviceCall(service: string, operation: string, context?: LogContext): void {
    this.info(`Service Call: ${service}.${operation}`, {
      ...context,
      type: 'service_call',
      service,
      operation
    });
  }

  serviceResponse(service: string, operation: string, success: boolean, duration: number, context?: LogContext, error?: Error): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    const message = `Service Response: ${service}.${operation} - ${success ? 'SUCCESS' : 'FAILED'}`;
    
    if (success) {
      this.info(message, {
        ...context,
        type: 'service_response',
        service,
        operation,
        success,
        duration
      });
    } else {
      this.error(message, {
        ...context,
        type: 'service_response',
        service,
        operation,
        success,
        duration
      }, error);
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();