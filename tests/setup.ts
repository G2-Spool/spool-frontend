import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables for testing
process.env.VITE_API_BASE_URL = 'http://localhost:3000';
process.env.VITE_PINECONE_API_KEY = 'test-api-key';
process.env.VITE_PINECONE_INDEX_NAME = 'test-index';
process.env.VITE_PINECONE_NAMESPACE = 'test';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock window.location
delete (window as any).location;
window.location = {
  href: '',
  pathname: '',
  search: '',
  hash: '',
  origin: 'http://localhost',
} as any;

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});