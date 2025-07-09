import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import { LearningPathCard } from '../components/molecules/LearningPathCard';
import { StatsCard } from '../components/molecules/StatsCard';
import { StreakDisplay } from '../components/molecules/StreakDisplay';
import { InterestBubble } from '../components/molecules/InterestBubble';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock, 
  Zap,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { LifeCategory } from '../types';

// Mock data for learning paths
const mockLearningPaths = [
  {
    id: '1',
    title: 'Game Development Fundamentals',
    category: 'career' as LifeCategory,
    description: 'Learn the basics of game development, from concept to implementation',
    progress: 65,
    totalExercises: 12,
    completedExercises: 8,
    estimatedMinutes: 45,
    points: 150,
    isActive: true,
  },
  {
    id: '2',
    title: 'Environmental Science & Action',
    category: 'philanthropic' as LifeCategory,
    description: 'Understand climate change and learn how to make a positive impact',
    progress: 40,
    totalExercises: 10,
    completedExercises: 4,
    estimatedMinutes: 30,
    points: 120,
    isActive: false,
  },
  {
    id: '3',
    title: 'Team Leadership Skills',
    category: 'social' as LifeCategory,
    description: 'Develop leadership abilities for sports teams and group projects',
    progress: 25,
    totalExercises: 8,
    completedExercises: 2,
    estimatedMinutes: 35,
    points: 100,
    isActive: false,
  },
  {
    id: '4',
    title: 'Advanced Gaming Strategies',
    category: 'personal' as LifeCategory,
    description: 'Master advanced techniques in your favorite games',
    progress: 80,
    totalExercises: 15,
    completedExercises: 12,
    estimatedMinutes: 50,
    points: 200,
    isActive: false,
  },
];

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { studentProfile, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<LifeCategory | 'all'>('all');

  if (!studentProfile || !user) {
    return null;
  }

  const filteredPaths = selectedCategory === 'all' 
    ? mockLearningPaths 
    : mockLearningPaths.filter(path => path.category === selectedCategory);

  const activePath = mockLearningPaths.find(path => path.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-obsidian dark:text-gray-100 mb-2">
          Welcome back, {studentProfile.firstName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to continue your learning journey?
        </p>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Points"
          value={studentProfile.totalPoints}
          subtitle="All time"
          icon={Trophy}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Exercises Done"
          value="47"
          subtitle="This month"
          icon={BookOpen}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Learning Time"
          value="12.5h"
          subtitle="This week"
          icon={Clock}
          variant="warning"
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Daily Goal"
          value={`${studentProfile.dailyGoalMinutes}m`}
          subtitle="Per day"
          icon={Target}
          variant="default"
        />
      </div>

      {/* Active Learning Path */}
      {activePath && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100">Continue Learning</h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/learning-path/${activePath.id}`)}
            >
              Resume
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <LearningPathCard {...activePath} />
        </div>
      )}

      {/* Interests Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100 mb-4">Your Interests</h2>
        <Card>
          <div className="flex flex-wrap gap-3">
            {studentProfile.interests.map((interest, index) => (
              <InterestBubble
                key={index}
                interest={interest.interest}
                category={interest.category}
                strength={interest.strength}
                onClick={() => setSelectedCategory(interest.category)}
              />
            ))}
            <button
              onClick={() => navigate('/voice-interview')}
              className="rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-normal flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Discover More
            </button>
          </div>
        </Card>
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
              onClick={() => navigate('/voice-interview')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Take Voice Interview
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};