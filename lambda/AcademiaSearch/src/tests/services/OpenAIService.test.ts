import { OpenAIService } from '../../services/OpenAIService';

// Mock OpenAI
jest.mock('openai');

describe('OpenAIService', () => {
  let service: OpenAIService;
  let mockOpenAI: Record<string, unknown>;

  beforeEach(() => {
    import('openai');
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    };
    OpenAI.mockImplementation(() => mockOpenAI);
    
    service = new OpenAIService('test-api-key');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeAcademicTopics', () => {
    const mockStudentProfile = {
      interests: [
        { interest: 'Machine Learning', category: 'career', strength: 8 },
        { interest: 'Mathematics', category: 'personal', strength: 7 }
      ],
      firstName: 'John',
      grade: '12'
    };

    it('should successfully analyze academic topics', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: `PRIMARY_TOPIC: Computer Science
PRIMARY_CATEGORY: STEM

DESCRIPTION_1: Machine learning is a subset of artificial intelligence that focuses on algorithms and statistical models that computer systems use to perform tasks without explicit instructions. In the context of neural networks, machine learning involves training algorithms to recognize patterns in data through iterative learning processes.

DESCRIPTION_2: Neural network architecture comprises interconnected nodes or neurons that process information through weighted connections. The fundamental concepts include forward propagation, backpropagation, activation functions, and gradient descent optimization that enable networks to learn complex patterns.

DESCRIPTION_3: Deep learning represents advanced neural network architectures with multiple hidden layers that can learn hierarchical representations of data. This field encompasses convolutional neural networks for image processing, recurrent networks for sequential data, and transformer architectures for natural language processing.

DESCRIPTION_4: Mathematical foundations underlying neural networks include linear algebra, calculus, probability theory, and statistics. These mathematical concepts are essential for understanding weight initialization, loss functions, optimization algorithms, and regularization techniques.

DESCRIPTION_5: Computational neuroscience bridges biological neural systems and artificial neural networks, exploring how the brain processes information and how these principles can be applied to artificial intelligence systems. This interdisciplinary field combines neurobiology, psychology, and computer science.`
          }
        }]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await service.analyzeAcademicTopics('How do neural networks learn?', mockStudentProfile);

      expect(result).toEqual({
        descriptions: expect.arrayContaining([
          expect.stringContaining('Machine learning'),
          expect.stringContaining('Neural network architecture'),
          expect.stringContaining('Deep learning'),
          expect.stringContaining('Mathematical foundations'),
          expect.stringContaining('Computational neuroscience')
        ]),
        primaryTopic: 'Computer Science',
        primaryCategory: 'STEM'
      });

      expect(result.descriptions).toHaveLength(5);
    });

    it('should handle OpenAI API errors', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API rate limit exceeded'));

      await expect(
        service.analyzeAcademicTopics('Test question', mockStudentProfile)
      ).rejects.toThrow('Failed to analyze academic topics');
    });

    it('should handle empty OpenAI response', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: null
          }
        }]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      await expect(
        service.analyzeAcademicTopics('Test question', mockStudentProfile)
      ).rejects.toThrow('No response from OpenAI');
    });

    it('should parse malformed response gracefully', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'This is not a properly formatted response'
          }
        }]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await service.analyzeAcademicTopics('Test question', mockStudentProfile);

      expect(result.primaryTopic).toBe('General Academic Inquiry');
      expect(result.primaryCategory).toBe('Interdisciplinary');
      expect(result.descriptions).toHaveLength(0);
    });
  });
});