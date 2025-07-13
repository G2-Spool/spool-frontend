import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/atoms/Card';
import { ProgressBar } from '../components/molecules/ProgressBar';
import { Button } from '../components/atoms/Button';
import { 
  Clock, 
  Trophy, 
  ArrowRight,
  Search,
  Plus,
  MessageSquare,
} from 'lucide-react';
import { useUserThreads } from '../hooks/useThread';
import { ThreadCard } from '../components/molecules/ThreadCard';
import { InterviewModal } from '../components/organisms/InterviewModal';
import { SubjectCarousel } from '../components/organisms/SubjectCarousel';
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

export const ThreadsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  
  // Get current user
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  const navigate = useNavigate();
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Fetch user threads
  const { 
    data: threads, 
    isLoading: isLoadingThreads 
  } = useUserThreads(userId, 5);
  
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
            </div>
            

          </div>
        )}
      </div>
      


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