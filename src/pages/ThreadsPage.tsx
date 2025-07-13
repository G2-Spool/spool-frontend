import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { 
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUserThreads } from '../hooks/useThread';
import { ThreadCard } from '../components/molecules/ThreadCard';
import { CreateThreadModal } from '../components/organisms/CreateThreadModal';
import { SubjectCarousel } from '../components/organisms/SubjectCarousel';
import { useAuth } from '../contexts/AuthContext';

// Create custom hook for debouncing
// const useDebounce = <T,>(value: T, delay: number): T => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);
//   
//   return debouncedValue;
// };

export const ThreadsPage: React.FC = () => {
  const [showCreateThreadModal, setShowCreateThreadModal] = useState(false);
  
  // Get current user
  const { user, studentProfile } = useAuth();
  const userId = user?.id || 'anonymous';
  const navigate = useNavigate();
  
  // Carousel functionality for thread cards
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch user threads
  const { 
    data: threads, 
    isLoading: isLoadingThreads 
  } = useUserThreads(userId, 5);

  // Update scroll state
  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(0, scrollPosition - 320);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const newPosition = scrollPosition + 320;
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  // Update scroll state on mount and when threads change
  useEffect(() => {
    updateScrollState();
    const handleScroll = () => updateScrollState();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [threads]);
  
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
          sections: 47,
          concepts: 208,
          progress: 0
        },
        {
          id: "anatomy",
          title: "Anatomy and Physiology",
          description: "Learn about the structure and organization of the human body",
          sections: 28,
          concepts: 169,
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-obsidian dark:text-gray-100 mb-2">Threads</h1>
            <p className="text-gray-600 dark:text-gray-400">Continue learning or explore new subjects</p>
          </div>

        </div>

      </div>
      


      {/* Current Threads (User's Learning Threads) */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-obsidian">Your Learning Threads</h2>
          <div className="flex items-center gap-2">
            {threads && threads.length > 3 && (
              <div className="flex space-x-2 mr-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className="h-8 w-8 p-0 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className="h-8 w-8 p-0 bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button
              size="sm"
              onClick={() => {
                console.log('🎯 CREATE THREAD BUTTON CLICKED - Opening thread creation modal');
                setShowCreateThreadModal(true);
              }}
              className="rounded-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Thread
            </Button>
          </div>
        </div>
        
        {threads && threads.length > 0 ? (
          <div className="relative overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex space-x-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
            >
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
                    estimatedReadTime={thread.sections.reduce((sum, s) => sum + (s.estimatedMinutes || 0), 0)}
                    completionPercentage={Math.floor(Math.random() * 100)}
                  />
                ))
              )}
            </div>
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
              console.log('🎯 CREATE THREAD BUTTON CLICKED - Opening thread creation modal');
              setShowCreateThreadModal(true);
            }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Thread
            </Button>
          </Card>
        )}
      </section>



      {/* Core Subjects (My Classes) */}
      <section className="space-y-12">
        {/* Subject Carousels */}
        <div className="space-y-16">
          {subjectsData.map((subject) => (
            <SubjectCarousel
              key={subject.title}
              title={subject.title}
              topics={subject.topics}
              color={subject.color}
              onTopicClick={handleTopicClick}
            />
          ))}
        </div>
        

      </section>
      
      {/* Create Thread Modal */}
      <CreateThreadModal
        isOpen={showCreateThreadModal}
        onClose={() => setShowCreateThreadModal(false)}
        studentId={studentProfile?.id || user?.id || 'anonymous'}
      />
    </div>
  );
};