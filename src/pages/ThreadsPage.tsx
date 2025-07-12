import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import { ProgressBar } from '../components/molecules/ProgressBar';
import { Button } from '../components/atoms/Button';
import { 
  Clock, 
  Trophy, 
  ArrowRight,
  Search,
  RefreshCw,
  AlertCircle,
  Plus,
  MessageSquare,
} from 'lucide-react';
import type { LifeCategory } from '../types';
import { useCourses, useCourseSearch } from '../hooks/useCourses';
import { useUserThreads } from '../hooks/useThread';
import { ThreadCard } from '../components/molecules/ThreadCard';
import { InterviewModal } from '../components/organisms/InterviewModal';
import { SubjectCarousel } from '../components/organisms/SubjectCarousel';
import type { FilterMetadata } from '../services/pinecone/types';
import { useAuth } from '../contexts/AuthContext';

// Create custom hook for debouncing
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

const categoryColors: Record<LifeCategory, string> = {
  personal: 'border-personal',
  social: 'border-social',
  career: 'border-career',
  philanthropic: 'border-philanthropic',
};

export const ThreadsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterMetadata>({});
  const [page, setPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  
  // Get current user
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  const navigate = useNavigate();
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Fetch courses with React Query
  const { 
    data: coursesData, 
    isLoading, 
    error, 
    refetch 
  } = useCourses(page, 20, filters);
  
  // Search courses
  const { 
    data: searchResults, 
    isLoading: isSearching 
  } = useCourseSearch(
    debouncedSearchQuery, 
    filters, 
    debouncedSearchQuery.length > 2
  );
  

  
  // Fetch user threads
  const { 
    data: threads, 
    isLoading: isLoadingThreads 
  } = useUserThreads(userId, 5);
  
  // Filter courses based on enrollment status
  const courses = searchResults || coursesData?.items || [];
  const enrolledCourses = courses.filter(course => course.enrolled);
  
  // Loading skeleton component
  const CourseCardSkeleton = () => (
    <Card className="h-full animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </Card>
  );

  // Subjects data for core subjects section
  const subjectsData = [
    {
      title: "Mathematics",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      topics: [
        {
          id: "college-algebra",
          title: "College Algebra",
          description: "Master algebraic concepts and problem-solving techniques",
          sections: 9,
          concepts: 57,
          progress: 12
        },
        {
          id: "statistics",
          title: "Introductory Statistics",
          description: "Learn statistical analysis and data interpretation",
          sections: 13,
          concepts: 80,
          progress: 0
        }
      ]
    },
    {
      title: "Humanities",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      topics: [
        {
          id: "writing",
          title: "Writing Guide",
          description: "Develop your writing skills and communication abilities",
          sections: 20,
          concepts: 163,
          progress: 0
        },
        {
          id: "philosophy",
          title: "Introduction to Philosophy",
          description: "Explore fundamental questions about existence and knowledge",
          sections: 12,
          concepts: 53,
          progress: 0
        },
        {
          id: "world-history",
          title: "World History, Volume 2: from 1400",
          description: "Journey through major events and civilizations",
          sections: 15,
          concepts: 60,
          progress: 0
        }
      ]
    },
    {
      title: "Science",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      topics: [
        {
          id: "biology",
          title: "Biology",
          description: "Study living organisms and their interactions with the environment",
          sections: 10,
          concepts: 45,
          progress: 0
        },
        {
          id: "anatomy",
          title: "Anatomy and Physiology",
          description: "Learn about the structure and organization of the human body",
          sections: 12,
          concepts: 58,
          progress: 0
        }
      ]
    }
  ];

  // Handlers for topic interactions
  const handleTopicClick = (topicId: string) => {
    console.log('Topic clicked:', topicId);
    // Navigate to topic overview
    navigate(`/topic/${topicId}`);
  };

  const handlePlayClick = (topicId: string) => {
    console.log('Play clicked:', topicId);
    // Navigate to learning page for the topic
    navigate(`/learn/${topicId}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-obsidian dark:text-gray-100 mb-2">Threads</h1>
            <p className="text-gray-600 dark:text-gray-400">Continue learning or explore new subjects</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        {showSearch && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by topic, skill, or interest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Filter Options */}
            <div className="flex gap-2 mt-2">
              <Badge
                variant={filters.category?.includes('personal') ? 'primary' : 'default'}
                className="cursor-pointer"
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    category: prev.category?.includes('personal') 
                      ? prev.category.filter(c => c !== 'personal')
                      : [...(prev.category || []), 'personal']
                  }));
                }}
              >
                Personal
              </Badge>
              <Badge
                variant={filters.category?.includes('social') ? 'primary' : 'default'}
                className="cursor-pointer"
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    category: prev.category?.includes('social') 
                      ? prev.category.filter(c => c !== 'social')
                      : [...(prev.category || []), 'social']
                  }));
                }}
              >
                Social
              </Badge>
              <Badge
                variant={filters.category?.includes('career') ? 'primary' : 'default'}
                className="cursor-pointer"
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    category: prev.category?.includes('career') 
                      ? prev.category.filter(c => c !== 'career')
                      : [...(prev.category || []), 'career']
                  }));
                }}
              >
                Career
              </Badge>
              <Badge
                variant={filters.category?.includes('philanthropic') ? 'primary' : 'default'}
                className="cursor-pointer"
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    category: prev.category?.includes('philanthropic') 
                      ? prev.category.filter(c => c !== 'philanthropic')
                      : [...(prev.category || []), 'philanthropic']
                  }));
                }}
              >
                Philanthropic
              </Badge>
            </div>
          </div>
        )}
      </div>
      
      {/* Error State */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">Failed to load courses. Please try again.</p>
        </div>
      )}

      {/* Current Threads (User's Learning Threads) */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-obsidian">Your Learning Threads</h2>
          <Button
            size="sm"
            onClick={() => {
              console.log('🎯 CREATE THREAD BUTTON CLICKED - Opening interview modal');
              setShowInterviewModal(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Thread
          </Button>
        </div>
        
        {threads && threads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingThreads ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))
            ) : (
              threads.map((thread) => (
                <ThreadCard
                  key={thread.threadId}
                  threadId={thread.threadId}
                  userInput={thread.userInput}
                  analysis={thread.analysis}
                  sectionCount={thread.sections.length}
                  createdAt={thread.createdAt}
                  estimatedReadTime={thread.sections.reduce((sum, s) => sum + (s.estimatedMinutes || 0), 0)}
                />
              ))
            )}
          </div>
        ) : (
          <Card className="p-8 text-center bg-purple-50 border-purple-200">
            <MessageSquare className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <p className="text-gray-700 mb-2">No learning threads yet</p>
            <p className="text-sm text-gray-600 mb-4">
              Create your first thread by asking any academic question
            </p>
            <Button
              size="sm"
              onClick={() => {
              console.log('🎯 CREATE THREAD BUTTON CLICKED - Opening interview modal');
              setShowInterviewModal(true);
            }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Thread
            </Button>
          </Card>
        )}
      </section>

      {/* Enrolled Courses */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-obsidian mb-6">Current Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          ) : enrolledCourses.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
              <p className="text-gray-400 text-sm mt-1">Explore available courses below to get started!</p>
            </div>
          ) : (
            // Course cards
            enrolledCourses.map((course) => (
              <Link
                key={course.id}
                to={`/learning-path/${course.id}`}
                className="block hover:scale-[1.02] transition-transform"
              >
                <Card className={`h-full border-t-4 ${categoryColors[course.category]} hover:shadow-md transition-shadow`}>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-obsidian line-clamp-2">
                          {course.title}
                        </h3>
                        <Badge variant="primary" size="sm">
                          {course.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-700 font-medium">
                          {course.completedConcepts || 0}/{course.totalConcepts} concepts
                        </span>
                      </div>
                      <ProgressBar
                        value={course.totalConcepts > 0 ? ((course.completedConcepts || 0) / course.totalConcepts) * 100 : 0}
                        variant="default"
                        size="sm"
                      />
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.estimatedHours}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{course.points}pts</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-teal-500" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Core Subjects (My Classes) */}
      <section className="space-y-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-obsidian dark:text-gray-100">Explore Core Subjects</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Browse subjects and track your learning progress</p>
          </div>
        </div>
        
        {/* Subject Carousels */}
        <div className="space-y-16">
          {subjectsData.map((subject) => (
            <SubjectCarousel
              key={subject.title}
              title={subject.title}
              topics={subject.topics}
              color={subject.color}
              onTopicClick={handleTopicClick}
              onPlayClick={handlePlayClick}
            />
          ))}
        </div>
        
        {/* Pagination */}
        {coursesData && coursesData.total > 20 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {page} of {Math.ceil(coursesData.total / 20)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={!coursesData.hasMore}
            >
              Next
            </Button>
          </div>
        )}
      </section>
      
      {/* Interview Modal */}
      <InterviewModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        mode="thread" // Use thread mode for creating learning threads
        onThreadCreated={(threadId) => {
          console.log('Thread created from courses page:', threadId);
          // The modal will automatically navigate to the thread page
        }}
        onInterestsExtracted={(interests) => {
          console.log('Interests extracted from courses page:', interests);
        }}
      />
    </div>
  );
};