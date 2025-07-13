import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearningPaths, useActiveLearningPath, useStudentStats } from '../hooks/useLearningPaths';
import { useInterests } from '../hooks/useInterests';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import { LearningPathCard } from '../components/molecules/LearningPathCard';
import { ExpandableStatsCard } from '../components/molecules/ExpandableStatsCard';
import { StreakDisplay } from '../components/molecules/StreakDisplay';
import { InterestDetailCard } from '../components/molecules/InterestDetailCard';
import { LearningPathSkeleton } from '../components/LoadingStates/LearningPathSkeleton';
import { InterestDiscoveryModal } from '../components/InterestDiscoveryModal';
import { CreateThreadModal } from '../components/organisms/CreateThreadModal';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock, 
  Sparkles,
  Plus,
  Spool,
  MessageCircle,
} from 'lucide-react';
import type { LifeCategory } from '../types';


export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { studentProfile, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<LifeCategory | 'all'>('all');
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showCreateThreadModal, setShowCreateThreadModal] = useState(false);
  
  // Fetch real data from API
  const { data: learningPaths, isLoading: pathsLoading } = useLearningPaths();
  const { data: activePath, isLoading: activePathLoading } = useActiveLearningPath();
  const { data: stats, isLoading: statsLoading } = useStudentStats();
  const { interests, isLoading: interestsLoading } = useInterests(studentProfile?.id);

  if (!studentProfile || !user) {
    return null;
  }

  const filteredPaths = selectedCategory === 'all' 
    ? (learningPaths || [])
    : (learningPaths || []).filter(path => path.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with New Thread Button */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-obsidian dark:text-gray-100 mb-2">
            Home
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {studentProfile.firstName}! Ready to continue your learning journey?
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowCreateThreadModal(true)}
          className="flex items-center gap-3 px-6 py-3"
        >
          <Plus className="h-5 w-5" />
          New Thread
        </Button>
      </div>

      {/* Streak Display */}
      <Card className="mb-8 bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/10">
        <div className="flex items-center justify-between">
          <StreakDisplay
            currentStreak={studentProfile.currentStreakDays}
            longestStreak={studentProfile.longestStreakDays}
          />
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Level {studentProfile.level}</p>
            <p className="text-2xl font-bold text-obsidian dark:text-gray-100">{studentProfile.totalPoints} pts</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats - More subtle and expandable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <ExpandableStatsCard
          title="Points"
          value={statsLoading ? '—' : (stats?.totalPoints || studentProfile.totalPoints).toLocaleString()}
          subtitle="all time"
          icon={Trophy}
          variant="default"
          trend={{ value: 12, isPositive: true }}
          expandedContent={{
            weeklyData: stats?.weeklyData?.points || [0, 0, 0, 0, 0, 0, 0],
            monthlyGoal: 5000,
            bestRecord: 850,
            insights: [
              "You're 12% above average this week",
              "Complete 3 more exercises to reach next level"
            ]
          }}
        />
        <ExpandableStatsCard
          title="Exercises"
          value={statsLoading ? '—' : stats?.exercisesThisMonth || 0}
          subtitle="this month"
          icon={BookOpen}
          variant="default"
          trend={{ value: 8, isPositive: true }}
          expandedContent={{
            weeklyData: stats?.weeklyData?.exercises || [0, 0, 0, 0, 0, 0, 0],
            monthlyGoal: 60,
            bestRecord: 15,
            insights: [
              "On track to exceed monthly goal",
              "Most productive on Wednesdays"
            ]
          }}
        />
        <ExpandableStatsCard
          title="Time"
          value={statsLoading ? '—' : `${(stats?.learningTimeThisWeek || 0) / 60}h`}
          subtitle="this week"
          icon={Clock}
          variant="default"
          trend={{ value: 5, isPositive: false }}
          expandedContent={{
            weeklyData: stats?.weeklyData?.timeMinutes?.map(m => m / 60) || [0, 0, 0, 0, 0, 0, 0],
            monthlyGoal: 50,
            bestRecord: 3.5,
            insights: [
              "5% below last week",
              "Try morning sessions for better focus"
            ]
          }}
        />
        <ExpandableStatsCard
          title="Goal"
          value={`${stats?.dailyGoalMinutes || studentProfile.dailyGoalMinutes}m`}
          subtitle="daily target"
          icon={Target}
          variant="default"
          expandedContent={{
            weeklyData: stats?.weeklyData?.goalMinutes || [30, 30, 30, 30, 30, 30, 30],
            monthlyGoal: (stats?.dailyGoalMinutes || studentProfile.dailyGoalMinutes) * 30,
            bestRecord: 60,
            insights: [
              "Met goal 5 out of 7 days",
              "Consider adjusting to 35 minutes"
            ]
          }}
        />
      </div>

      {/* Continue Thread - Half width */}
      {activePathLoading ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100 mb-4">Continue Thread</h2>
          <div className="max-w-xl">
            <LearningPathSkeleton />
          </div>
        </div>
      ) : activePath ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100 mb-4">Continue Thread</h2>
          <div className="max-w-xl">
            <LearningPathCard {...activePath} />
          </div>
        </div>
      ) : null}

      {/* Interests Section - Now shows detailed interest cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100">Your Interests</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInterestModal(true)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Discover More
          </Button>
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
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Add Interests
            </Button>
          </Card>
        )}
      </div>

      {/* Learning Paths */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100">Learning Paths</h2>
          <div className="flex items-center gap-2">
              <Badge
                variant={selectedCategory === 'all' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('all')}
                className="cursor-pointer"
              >
                All
              </Badge>
              <Badge
                variant={selectedCategory === 'personal' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('personal')}
                className="cursor-pointer"
              >
                Personal
              </Badge>
              <Badge
                variant={selectedCategory === 'social' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('social')}
                className="cursor-pointer"
              >
                Social
              </Badge>
              <Badge
                variant={selectedCategory === 'career' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('career')}
                className="cursor-pointer"
              >
                Career
              </Badge>
              <Badge
                variant={selectedCategory === 'philanthropic' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('philanthropic')}
                className="cursor-pointer"
              >
                Philanthropic
              </Badge>
            </div>
          </div>

        {pathsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <LearningPathSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPaths.map((path) => (
                <LearningPathCard
                  key={path.id}
                  {...path}
                  onClick={() => navigate(`/learning-path/${path.id}`)}
                />
              ))}
            </div>

            {filteredPaths.length === 0 && (
              <Card className="text-center py-12">
                <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No learning paths in this category yet.</p>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateThreadModal(true)}
                >
                  <Spool className="h-4 w-4 mr-2" />
                  Create Thread
                </Button>
              </Card>
            )}
          </>
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