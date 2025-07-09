import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import { ProgressBar } from '../components/molecules/ProgressBar';
import { Button } from '../components/atoms/Button';
import { 
  Clock, 
  Trophy, 
  ArrowRight,
  Users,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import type { LifeCategory, Course } from '../types';
import { useCourses, useCourseSearch, useEnrollCourse } from '../hooks/useCourses';
import type { FilterMetadata } from '../services/pinecone/types';

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

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

export const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterMetadata>({});
  const [page, setPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  
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
  
  // Enroll mutation
  const enrollMutation = useEnrollCourse();
  
  // Filter courses based on enrollment status
  const courses = searchResults || coursesData?.items || [];
  const enrolledCourses = courses.filter(course => course.enrolled);
  const availableCourses = courses.filter(course => !course.enrolled);
  
  // Handle enrollment
  const handleEnroll = useCallback(async (courseId: string) => {
    try {
      await enrollMutation.mutateAsync(courseId);
      // Optionally show success message
    } catch (error) {
      console.error('Failed to enroll:', error);
      // Optionally show error message
    }
  }, [enrollMutation]);
  
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-obsidian mb-2">My Courses</h1>
            <p className="text-gray-600">Continue learning or explore new subjects</p>
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
                variant={filters.category?.includes('personal') ? 'primary' : 'secondary'}
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
                variant={filters.category?.includes('social') ? 'primary' : 'secondary'}
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
                variant={filters.category?.includes('career') ? 'primary' : 'secondary'}
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
                variant={filters.category?.includes('philanthropic') ? 'primary' : 'secondary'}
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

      {/* Enrolled Courses */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-obsidian mb-6">Currently Learning</h2>
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

      {/* Available Courses */}
      <section>
        <h2 className="text-xl font-semibold text-obsidian mb-6">Explore New Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          ) : availableCourses.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No courses found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            // Course cards
            availableCourses.map((course) => (
              <Card key={course.id} className={`h-full border-t-4 ${categoryColors[course.category]}`}>
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

                  {/* Course Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Difficulty</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty]}`}>
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sections</span>
                      <span className="font-medium">{course.totalSections}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Concepts</span>
                      <span className="font-medium">{course.totalConcepts}</span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.estimatedHours}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{course.points}pts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollMutation.isPending}
                      className="w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
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
    </div>
  );
};