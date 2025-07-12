/**
 * ProfilePage Component
 * 
 * Displays user profile information including stats, achievements, and learning goals.
 * Uses shadcn/ui components with proper JSX structure.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  BookOpen, 
  Clock, 
  Star, 
  Trophy,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

// Import hooks
import { useAuth } from '../contexts/AuthContext';

// Mock components for missing elements
const StreakDisplay = ({ currentStreak, longestStreak }: { currentStreak: number; longestStreak: number }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-teal-500">{currentStreak}</div>
    <div className="text-sm text-gray-600">Current Streak</div>
    <div className="text-xs text-gray-500">Best: {longestStreak} days</div>
  </div>
);

const StatsCard = ({ title, value, icon: Icon, variant, trend }: any) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {trend && (
            <div className="text-sm text-green-600">
              +{trend.value}% from last week
            </div>
          )}
        </div>
        <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-teal-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const InterestBubble = ({ interest }: { interest: string }) => (
  <Badge variant="secondary" className="mr-2 mb-2">
    {interest}
  </Badge>
);

export const ProfilePage: React.FC = () => {
  const { studentProfile } = useAuth();

  if (!studentProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading profile...</div>
      </div>
    );
  }

  // Calculate level progress
  const currentLevelXP = studentProfile.experiencePoints % 1000;
  const levelProgress = (currentLevelXP / 1000) * 100;

  // Mock achievements
  const achievements = [
    { id: '1', name: 'First Steps', description: 'Complete your first concept', icon: <Award className="h-8 w-8" />, rarity: 'common' },
    { id: '2', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: <Trophy className="h-8 w-8" />, rarity: 'rare' },
    { id: '3', name: 'Quick Learner', description: 'Master 10 concepts', icon: <Zap className="h-8 w-8" />, rarity: 'epic' },
  ];

  const rarityColors = {
    common: 'bg-gray-100 text-gray-600',
    rare: 'bg-blue-100 text-blue-600',
    epic: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Profile Header */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32" />
            <div className="relative flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                  {studentProfile.firstName[0]}{studentProfile.lastName[0]}
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {studentProfile.firstName} {studentProfile.lastName}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="default">
                    Level {studentProfile.level}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {studentProfile.experiencePoints} XP Total
                  </span>
                </div>
                <div className="mt-4 max-w-xs">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level Progress</span>
                    <span>{Math.round(levelProgress)}%</span>
                  </div>
                  <Progress value={levelProgress} className="h-2" />
                </div>
              </div>

              {/* Streak Display */}
              <div className="flex-shrink-0">
                <StreakDisplay
                  currentStreak={studentProfile.currentStreakDays}
                  longestStreak={studentProfile.longestStreakDays}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Points"
            value={studentProfile.totalPoints.toLocaleString()}
            icon={Star}
            variant="primary"
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Concepts Mastered"
            value="42"
            icon={BookOpen}
            variant="default"
          />
          <StatsCard
            title="Learning Time"
            value="24h 30m"
            icon={Clock}
            variant="default"
          />
          <StatsCard
            title="Achievement Score"
            value="850"
            icon={Trophy}
            variant="default"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Interests Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">My Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentProfile.interests && studentProfile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {studentProfile.interests.map((interest: any, idx: number) => (
                    <InterestBubble key={idx} interest={interest.interest} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No interests added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">Achievements</CardTitle>
              <Badge variant="default">
                {achievements.length} Unlocked
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                      <Badge variant="default" className="mt-2">
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Learning Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-teal-500" />
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    Daily Goal
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {studentProfile.dailyGoalMinutes}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">minutes/day</span>
                </div>
                <Progress
                  value={25}
                  className="mt-3"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-teal-500" />
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    Weekly Target
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    5
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">concepts/week</span>
                </div>
                <Progress
                  value={60}
                  className="mt-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};