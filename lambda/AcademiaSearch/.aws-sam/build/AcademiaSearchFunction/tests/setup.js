"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Mock console methods to reduce noise during tests
global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
// Set test environment
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'ERROR';
// Mock AWS SDK
jest.mock('aws-sdk', () => ({
    SSM: jest.fn(() => ({
        getParameter: jest.fn(),
        getParameters: jest.fn(),
    })),
}));
