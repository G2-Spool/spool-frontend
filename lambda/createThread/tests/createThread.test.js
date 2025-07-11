const { createThreadHandler } = require('../src/handlers/createThread');
const { ThreadService } = require('../src/services/threadService');

// Mock the ThreadService
jest.mock('../src/services/threadService');

describe('CreateThread Handler', () => {
  let mockThreadService;

  beforeEach(() => {
    mockThreadService = {
      createThread: jest.fn()
    };
    ThreadService.mockImplementation(() => mockThreadService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a thread successfully', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/api/thread/create',
      headers: {
        'Content-Type': 'application/json'
      },
      requestContext: {
        authorizer: {
          claims: {
            sub: 'user-123',
            email: 'test@example.com',
            'cognito:groups': ['students']
          }
        }
      },
      body: JSON.stringify({
        title: 'Test Thread',
        description: 'Test Description',
        interests: ['AI', 'ML'],
        concepts: ['neural-networks']
      })
    };

    mockThreadService.createThread.mockResolvedValue({
      id: 'thread-123',
      studentId: 'user-123',
      title: 'Test Thread'
    });

    const response = await createThreadHandler(event);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).message).toBe('Thread created successfully');
    expect(mockThreadService.createThread).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Thread',
        studentId: 'user-123'
      })
    );
  });

  test('should return 401 for unauthorized user', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/api/thread/create',
      headers: {
        'Content-Type': 'application/json'
      },
      requestContext: {},
      body: JSON.stringify({
        title: 'Test Thread'
      })
    };

    const response = await createThreadHandler(event);

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body).error).toBe('Unauthorized');
  });

  test('should return 400 for invalid request', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/api/thread/create',
      headers: {
        'Content-Type': 'application/json'
      },
      requestContext: {
        authorizer: {
          claims: {
            sub: 'user-123'
          }
        }
      },
      body: JSON.stringify({
        // Missing required title
        description: 'Test Description'
      })
    };

    const response = await createThreadHandler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).error).toBe('Validation error');
  });
});