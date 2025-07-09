import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { SearchBar } from '../../src/components/molecules/SearchBar';
import { LearningPathCard } from '../../src/components/molecules/LearningPathCard';
import { CoursesPage } from '../../src/pages/CoursesPage';
import { AuthContext } from '../../src/contexts/AuthContext';
import { PineconeService } from '../../src/services/pinecone/pinecone.service';
import { CoursesService } from '../../src/services/courses.service';
import { 
  mockCourses, 
  mockLearningPaths, 
  mockStudentProfile,
  mockSearchResults
} from '../fixtures/mockData';

// Mock the services
vi.mock('../../src/services/pinecone/pinecone.service');
vi.mock('../../src/services/courses.service');

const mockedPineconeService = vi.mocked(PineconeService);
const mockedCoursesService = vi.mocked(CoursesService);

describe('Pinecone Integration E2E Tests', () => {
  let queryClient: QueryClient;

  const mockAuthContext = {
    user: mockStudentProfile,
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  };

  const createWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthContext}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Setup service mocks
    const mockPineconeInstance = {
      searchCourses: vi.fn(),
      searchPaths: vi.fn(),
      searchConcepts: vi.fn(),
      getPersonalizedRecommendations: vi.fn(),
      getRelatedCourses: vi.fn(),
    };

    mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

    mockedCoursesService.getCourses.mockResolvedValue({
      data: mockCourses,
      pagination: { page: 1, pageSize: 20, total: 3, totalPages: 1 },
    });

    mockedCoursesService.searchCourses.mockResolvedValue(mockCourses);
    mockedCoursesService.getPersonalizedCourses.mockResolvedValue(mockCourses);

    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('Search Flow Integration', () => {
    it('should complete full search flow from input to results', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const onSearch = vi.fn();
      const onResults = vi.fn();

      render(
        <SearchBar 
          onSearch={onSearch}
          onResults={onResults}
          placeholder="Search courses..."
        />,
        { wrapper: createWrapper }
      );

      // User types search query
      const searchInput = screen.getByPlaceholderText('Search courses...');
      fireEvent.change(searchInput, { target: { value: 'JavaScript' } });

      // User submits search
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith('JavaScript');
      });

      // Verify search results are processed
      await waitFor(() => {
        expect(mockPineconeInstance.searchCourses).toHaveBeenCalledWith('JavaScript');
      });
    });

    it('should handle search with filters', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const onSearch = vi.fn();
      const filters = {
        category: ['Programming'],
        difficulty: ['Beginner'],
      };

      render(
        <SearchBar 
          onSearch={onSearch}
          filters={filters}
          placeholder="Search courses..."
        />,
        { wrapper: createWrapper }
      );

      const searchInput = screen.getByPlaceholderText('Search courses...');
      fireEvent.change(searchInput, { target: { value: 'React' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(mockPineconeInstance.searchCourses).toHaveBeenCalledWith('React', filters);
      });
    });

    it('should show loading state during search', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockImplementation(() => 
          new Promise(resolve => setTimeout(() => resolve(mockSearchResults.courses), 100))
        ),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const onSearch = vi.fn();

      render(
        <SearchBar 
          onSearch={onSearch}
          placeholder="Search courses..."
        />,
        { wrapper: createWrapper }
      );

      const searchInput = screen.getByPlaceholderText('Search courses...');
      fireEvent.change(searchInput, { target: { value: 'JavaScript' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      // Should show loading indicator
      expect(screen.getByText(/searching/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/searching/i)).not.toBeInTheDocument();
      });
    });

    it('should handle search errors gracefully', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockRejectedValue(new Error('Search failed')),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const onSearch = vi.fn();
      const onError = vi.fn();

      render(
        <SearchBar 
          onSearch={onSearch}
          onError={onError}
          placeholder="Search courses..."
        />,
        { wrapper: createWrapper }
      );

      const searchInput = screen.getByPlaceholderText('Search courses...');
      fireEvent.change(searchInput, { target: { value: 'JavaScript' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('Recommendation Flow Integration', () => {
    it('should load personalized recommendations on component mount', async () => {
      const mockPineconeInstance = {
        getPersonalizedRecommendations: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      render(<CoursesPage />, { wrapper: createWrapper });

      await waitFor(() => {
        expect(mockPineconeInstance.getPersonalizedRecommendations).toHaveBeenCalledWith(
          mockStudentProfile
        );
      });

      // Should display recommended courses
      expect(screen.getByText(/recommended for you/i)).toBeInTheDocument();
    });

    it('should show related courses when viewing a course', async () => {
      const mockPineconeInstance = {
        getRelatedCourses: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const courseId = 'course-1';
      
      render(<CoursesPage courseId={courseId} />, { wrapper: createWrapper });

      await waitFor(() => {
        expect(mockPineconeInstance.getRelatedCourses).toHaveBeenCalledWith(courseId);
      });

      // Should display related courses section
      expect(screen.getByText(/related courses/i)).toBeInTheDocument();
    });
  });

  describe('Learning Path Integration', () => {
    it('should search learning paths with Pinecone', async () => {
      const mockPineconeInstance = {
        searchPaths: vi.fn().mockResolvedValue(mockSearchResults.paths),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const learningPath = mockLearningPaths[0];

      render(
        <LearningPathCard 
          path={learningPath}
          onEnroll={vi.fn()}
          onViewDetails={vi.fn()}
        />,
        { wrapper: createWrapper }
      );

      // Should display learning path information
      expect(screen.getByText(learningPath.title)).toBeInTheDocument();
      expect(screen.getByText(learningPath.description)).toBeInTheDocument();
    });

    it('should handle learning path enrollment', async () => {
      const mockPineconeInstance = {
        searchPaths: vi.fn().mockResolvedValue(mockSearchResults.paths),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const learningPath = mockLearningPaths[0];
      const onEnroll = vi.fn();

      render(
        <LearningPathCard 
          path={learningPath}
          onEnroll={onEnroll}
          onViewDetails={vi.fn()}
        />,
        { wrapper: createWrapper }
      );

      // Click enroll button
      const enrollButton = screen.getByRole('button', { name: /enroll/i });
      fireEvent.click(enrollButton);

      expect(onEnroll).toHaveBeenCalledWith(learningPath.id);
    });
  });

  describe('Error Handling Integration', () => {
    it('should display error message when Pinecone is unavailable', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockRejectedValue(new Error('Pinecone unavailable')),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      render(<CoursesPage />, { wrapper: createWrapper });

      await waitFor(() => {
        expect(screen.getByText(/search unavailable/i)).toBeInTheDocument();
      });
    });

    it('should fallback to regular API when Pinecone fails', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockRejectedValue(new Error('Pinecone failed')),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      render(<CoursesPage />, { wrapper: createWrapper });

      await waitFor(() => {
        expect(mockedCoursesService.getCourses).toHaveBeenCalled();
      });

      // Should still display courses from regular API
      expect(screen.getByText(mockCourses[0].title)).toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    it('should cache search results to avoid redundant calls', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const onSearch = vi.fn();

      render(
        <SearchBar 
          onSearch={onSearch}
          placeholder="Search courses..."
        />,
        { wrapper: createWrapper }
      );

      const searchInput = screen.getByPlaceholderText('Search courses...');

      // First search
      fireEvent.change(searchInput, { target: { value: 'JavaScript' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(mockPineconeInstance.searchCourses).toHaveBeenCalledTimes(1);
      });

      // Second identical search should use cache
      fireEvent.change(searchInput, { target: { value: 'JavaScript' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      // Should not make another API call
      expect(mockPineconeInstance.searchCourses).toHaveBeenCalledTimes(1);
    });

    it('should debounce search input to avoid excessive API calls', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const onSearch = vi.fn();

      render(
        <SearchBar 
          onSearch={onSearch}
          placeholder="Search courses..."
          debounceMs={300}
        />,
        { wrapper: createWrapper }
      );

      const searchInput = screen.getByPlaceholderText('Search courses...');

      // Rapid typing
      fireEvent.change(searchInput, { target: { value: 'J' } });
      fireEvent.change(searchInput, { target: { value: 'Ja' } });
      fireEvent.change(searchInput, { target: { value: 'Jav' } });
      fireEvent.change(searchInput, { target: { value: 'Java' } });
      fireEvent.change(searchInput, { target: { value: 'JavaScript' } });

      // Should not trigger search until debounce period passes
      expect(onSearch).not.toHaveBeenCalled();

      // Wait for debounce
      await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith('JavaScript');
      }, { timeout: 500 });

      // Should only trigger once
      expect(onSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Authentication Integration', () => {
    it('should use user profile for personalized recommendations', async () => {
      const mockPineconeInstance = {
        getPersonalizedRecommendations: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      render(<CoursesPage />, { wrapper: createWrapper });

      await waitFor(() => {
        expect(mockPineconeInstance.getPersonalizedRecommendations).toHaveBeenCalledWith(
          mockStudentProfile
        );
      });
    });

    it('should handle unauthenticated users gracefully', async () => {
      const unauthenticatedContext = {
        ...mockAuthContext,
        isAuthenticated: false,
        user: null,
      };

      const mockPineconeInstance = {
        searchCourses: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      const UnauthenticatedWrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={unauthenticatedContext}>
            {children}
          </AuthContext.Provider>
        </QueryClientProvider>
      );

      render(<CoursesPage />, { wrapper: UnauthenticatedWrapper });

      // Should still show courses but without personalization
      await waitFor(() => {
        expect(mockedCoursesService.getCourses).toHaveBeenCalled();
      });

      expect(screen.getByText(/explore courses/i)).toBeInTheDocument();
    });
  });

  describe('Data Consistency Integration', () => {
    it('should sync data between Pinecone and API responses', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockResolvedValue(mockSearchResults.courses),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      // Mock API returning updated course data
      const updatedCourse = { ...mockCourses[0], title: 'Updated JavaScript Course' };
      mockedCoursesService.getCourseById.mockResolvedValue(updatedCourse);

      render(<CoursesPage />, { wrapper: createWrapper });

      // Should display both search results and detailed course info
      await waitFor(() => {
        expect(screen.getByText(updatedCourse.title)).toBeInTheDocument();
      });
    });

    it('should handle data mismatches gracefully', async () => {
      const mockPineconeInstance = {
        searchCourses: vi.fn().mockResolvedValue([
          {
            ...mockSearchResults.courses[0],
            id: 'nonexistent-course',
          },
        ]),
      };

      mockedPineconeService.mockImplementation(() => mockPineconeInstance as any);

      // Mock API returning 404 for nonexistent course
      mockedCoursesService.getCourseById.mockRejectedValue(new Error('Course not found'));

      render(<CoursesPage />, { wrapper: createWrapper });

      await waitFor(() => {
        expect(screen.getByText(/course not available/i)).toBeInTheDocument();
      });
    });
  });
});