import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useActiveLearningPath, useStudentStats } from '../hooks/useLearningPaths';
import { useInterests } from '../hooks/useInterests';
import { useUserThreads } from '../hooks/useThread';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { ExpandableStatsCard } from '../components/molecules/ExpandableStatsCard';
import { StreakDisplay } from '../components/molecules/StreakDisplay';
import { InterestDetailCard } from '../components/molecules/InterestDetailCard';
import { InterestDiscoveryModal } from '../components/InterestDiscoveryModal';
import { CreateThreadModal } from '../components/organisms/CreateThreadModal';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock, 
  Sparkles,
  Plus,
  Lightbulb,
  MessageCircle,
} from 'lucide-react';
import type { LifeCategory } from '../types';


export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { studentProfile, user } = useAuth();

  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showCreateThreadModal, setShowCreateThreadModal] = useState(false);
  const [stretchAmount, setStretchAmount] = useState(0);
  const [isStretching, setIsStretching] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Fetch real data from API
  const { data: activePath, isLoading: activePathLoading } = useActiveLearningPath();
  const { data: stats, isLoading: statsLoading } = useStudentStats();
  const { interests, isLoading: interestsLoading } = useInterests(studentProfile?.id);
  const { data: threads, isLoading: threadsLoading } = useUserThreads(user?.id || 'anonymous', 10);

  // Sample threads for demonstration
  const sampleThreads = [
    {
      threadId: 'blackjack-probability-guide',
      userInput: 'What are the probabilities of winning at blackjack?',
      analysis: 'Statistical analysis of blackjack outcomes and strategies',
      concepts: [
        { id: '1', title: 'Basic Probability Theory', estimatedMinutes: 18 },
        { id: '2', title: 'Card Counting Fundamentals', estimatedMinutes: 22 },
        { id: '3', title: 'House Edge Analysis', estimatedMinutes: 16 },
        { id: '4', title: 'Optimal Strategy Tables', estimatedMinutes: 20 }
      ],
      createdAt: new Date().toISOString(),
      estimatedReadTime: 76,
      progress: 0
    },
    {
      threadId: 'example-thread-001',
      userInput: 'How do neural networks learn and make predictions?',
      analysis: 'A comprehensive study of neural network fundamentals',
      concepts: [
        { id: '1', title: 'Neural Network Architecture', estimatedMinutes: 20 },
        { id: '2', title: 'Backpropagation', estimatedMinutes: 25 },
        { id: '3', title: 'Training Process', estimatedMinutes: 18 },
        { id: '4', title: 'Activation Functions', estimatedMinutes: 15 }
      ],
      createdAt: new Date().toISOString(),
      estimatedReadTime: 78,
      progress: 42
    },
    {
      threadId: 'sample-2',
      userInput: 'How does photosynthesis work in plants?',
      analysis: 'A comprehensive study of photosynthesis mechanisms',
      concepts: [
        { id: '1', title: 'Light Reactions', estimatedMinutes: 15 },
        { id: '2', title: 'Calvin Cycle', estimatedMinutes: 20 },
        { id: '3', title: 'Chloroplast Structure', estimatedMinutes: 12 }
      ],
      createdAt: new Date().toISOString(),
      estimatedReadTime: 47,
      progress: 67
    }
  ];

  // Show all 3 sample threads for demonstration
  const displayThreads = sampleThreads;

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    setIsDragging(true);
    setStartX(e.pageX - carousel.offsetLeft);
    setScrollLeft(carousel.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    carousel.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carousel.offsetLeft);
    setScrollLeft(carousel.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle elastic scroll effect
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      
      // If scrolled beyond the left boundary (negative scroll)
      if (scrollLeft <= 0) {
        const overscroll = Math.abs(scrollLeft);
        const maxStretch = 100; // Maximum stretch in pixels
        const stretch = Math.min(overscroll * 0.3, maxStretch); // Reduce stretch factor for subtlety
        
        setStretchAmount(stretch);
        setIsStretching(true);
      } else {
        setStretchAmount(0);
        setIsStretching(false);
      }
    };

    const handleScrollEnd = () => {
      // Spring back animation
      if (isStretching) {
        setIsStretching(false);
        setStretchAmount(0);
        
        // Smooth scroll back to 0
        setTimeout(() => {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        }, 100);
      }
    };

    carousel.addEventListener('scroll', handleScroll);
    carousel.addEventListener('scrollend', handleScrollEnd);
    
    // Fallback for browsers without scrollend
    let scrollTimeout: NodeJS.Timeout;
    carousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    });

    return () => {
      carousel.removeEventListener('scroll', handleScroll);
      carousel.removeEventListener('scrollend', handleScrollEnd);
      clearTimeout(scrollTimeout);
    };
  }, [isStretching]);

  if (!studentProfile || !user) {
    return null;
  }



  return (
    <div className="max-w-7xl mx-auto w-full overflow-x-hidden">
      {/* Header with New Thread Button */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-obsidian dark:text-gray-100 mb-2">
            Home
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Ready to continue your learning journey?
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowCreateThreadModal(true)}
          className="group flex items-center px-6 py-3 rounded-lg !text-white hover:!translate-y-0"
          style={{ color: 'white !important' }}
        >
          <Lightbulb className="h-5 w-5 text-white group-hover:text-gray-200 mr-4 transition-colors" />
          <span className="text-white group-hover:text-gray-200 transition-colors">New Thread</span>
        </Button>
      </div>

      {/* Streak Display */}
      <Card className="mb-8 bg-white dark:bg-[#1a202c]">
        <div className="flex items-center justify-between">
          <StreakDisplay
            currentStreak={studentProfile.currentStreakDays}
            longestStreak={studentProfile.longestStreakDays}
          />
          <div className="text-right">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">Level {studentProfile.level}</p>
            <p className="text-2xl font-bold text-obsidian dark:text-gray-100">{studentProfile.totalPoints} pts</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats - More subtle and expandable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 items-stretch">
        <ExpandableStatsCard
          title="Points"
          value={statsLoading ? '—' : (stats?.totalPoints || studentProfile.totalPoints).toLocaleString()}
          subtitle="all time"
          icon={Trophy}
          iconColor="text-yellow-500 dark:text-yellow-400"
          variant="default"
          trend={{ value: 12, isPositive: true }}
        />
        <ExpandableStatsCard
          title="Exercises"
          value={statsLoading ? '—' : stats?.exercisesThisMonth || 0}
          subtitle="this month"
          icon={BookOpen}
          iconColor="text-blue-500 dark:text-blue-400"
          variant="default"
          trend={{ value: 8, isPositive: true }}
        />
        <ExpandableStatsCard
          title="Time"
          value={statsLoading ? '—' : `${(stats?.learningTimeThisWeek || 0) / 60}h`}
          subtitle="this week"
          icon={Clock}
          iconColor="text-green-500 dark:text-green-400"
          variant="default"
          trend={{ value: 5, isPositive: false }}
        />
        <ExpandableStatsCard
          title="Goal"
          value={`${stats?.dailyGoalMinutes || studentProfile.dailyGoalMinutes}m`}
          subtitle="daily target"
          icon={Target}
          iconColor="text-purple-500 dark:text-purple-400"
          variant="default"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Continue Thread - Half width */}
      {activePathLoading ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100 mb-4">Continue Thread</h2>
          <div className="max-w-xl">
            <Card className="h-32 animate-pulse bg-gray-100 dark:bg-gray-800">
              <div className="w-full h-full" />
            </Card>
          </div>
        </div>
      ) : activePath ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100 mb-4">Continue Thread</h2>
          <div className="max-w-xl">
            <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-obsidian dark:text-gray-100 mb-1">
                    {activePath.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activePath.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activePath.progress}% complete
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {/* Your Threads */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100">Your Threads</h2>
        </div>

        <Card className="pl-4 pr-6 py-4 overflow-hidden">
          {threadsLoading ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-64 h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-2 transition-transform duration-300 ease-out scrollbar-hide cursor-grab active:cursor-grabbing select-none"
              style={{
                transform: `translateX(${stretchAmount}px) scaleX(${1 + stretchAmount * 0.002})`,
                transformOrigin: 'left center',
                overscrollBehaviorX: 'contain',
                WebkitOverflowScrolling: 'touch',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {displayThreads.map((thread, index) => {
                const colors = [
                  'from-blue-400 via-blue-600 to-purple-700 hover:from-blue-300 hover:via-blue-500 hover:to-purple-600',
                  'from-purple-400 via-pink-500 to-red-600 hover:from-purple-300 hover:via-pink-400 hover:to-red-500',
                  'from-green-400 via-teal-500 to-blue-600 hover:from-green-300 hover:via-teal-400 hover:to-blue-500',
                  'from-orange-400 via-red-500 to-pink-600 hover:from-orange-300 hover:via-red-400 hover:to-pink-500',
                  'from-pink-400 via-purple-500 to-indigo-600 hover:from-pink-300 hover:via-purple-400 hover:to-indigo-500',
                  'from-indigo-400 via-blue-500 to-cyan-600 hover:from-indigo-300 hover:via-blue-400 hover:to-cyan-500'
                ];
                
                const colorClass = colors[index % colors.length];
                
                return (
                  <div
                    key={thread.threadId}
                    onClick={(e) => {
                      if (!isDragging) {
                        navigate(`/thread/${thread.threadId}`);
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`flex-shrink-0 w-64 h-48 rounded-lg cursor-pointer transition-all duration-200 select-none relative overflow-hidden`}
                  >
                    {/* Background with opacity */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-80`}></div>
                    
                    {/* Content at full opacity */}
                    <div className="relative z-10 h-full p-6 flex flex-col justify-between pointer-events-none">
                      <div>
                        <h3 className="text-white font-semibold text-base line-clamp-3 mb-2 select-none">
                          {thread.userInput || 'Untitled Thread'}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-xs select-none">
                          {thread.concepts.length} Concepts
                        </span>
                        <span className="text-white/80 text-xs font-semibold select-none">
                          {(thread as any).progress || 0}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Add Thread Button Card */}
              <div
                onClick={(e) => {
                  if (!isDragging) {
                    setShowCreateThreadModal(true);
                  }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex-shrink-0 w-64 h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 cursor-pointer hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 border-2 border-dashed border-gray-300 dark:border-gray-600 select-none"
              >
                <div className="h-full flex flex-col items-center justify-center pointer-events-none">
                  <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium select-none">
                    Add Thread
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {!threadsLoading && displayThreads.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No threads yet</p>
              <Button
                variant="primary"
                onClick={() => setShowCreateThreadModal(true)}
                className="text-white"
              >
                <Plus className="h-4 w-4 mr-2 text-white" />
                Create Your First Thread
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Interests Section - Now shows detailed interest cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100">Your Interests</h2>
        </div>
        
        {interestsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-48 animate-pulse bg-gray-100 dark:bg-gray-800">
                <div className="w-full h-full" />
              </Card>
            ))}
          </div>
        ) : interests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interests.map((interest, index) => (
              <InterestDetailCard
                key={index}
                interest={interest}
                onExplore={(interestName) => {
                  // Navigate to a search or filtered view based on the interest
                  navigate(`/threads?interest=${encodeURIComponent(interestName)}`);
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Let's discover what interests you!
            </p>
            <Button
              variant="primary"
              onClick={() => setShowInterestModal(true)}
              className="text-white !text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-white" />
              Add Interests
            </Button>
          </Card>
        )}
      </div>

      {/* Interest Discovery Modal */}
      <InterestDiscoveryModal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        studentId={studentProfile.id}
        onInterestsUpdated={(interests) => {
          console.log('Interests updated:', interests);
          // The interests will be automatically refetched by the useInterests hook
        }}
      />

      {/* Create Thread Modal */}
      <CreateThreadModal
        isOpen={showCreateThreadModal}
        onClose={() => setShowCreateThreadModal(false)}
        studentId={studentProfile.id}
      />
    </div>
  );
};