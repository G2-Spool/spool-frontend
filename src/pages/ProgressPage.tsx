/**
 * ProgressPage Component
 * 
 * Displays detailed progress tracking including stats, achievements, and course progress.
 * Uses shadcn/ui components for consistent styling.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Trophy, 
  Target, 
  Calendar,
  BookOpen,
  Award,
  CheckCircle,
  Spool,
  TrendingUp,
  Clock
} from 'lucide-react';
import type { LifeCategory } from '../types';

// Mock components for missing elements
const StreakDisplay = ({ currentStreak, longestStreak }: { currentStreak: number; longestStreak: number }) => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-500 mb-2">{currentStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-400 mb-2">{longestStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatsCard = ({ title, value, icon: Icon, variant, trend, subtitle }: any) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {subtitle && (
            <div className="text-sm text-gray-500">{subtitle}</div>
          )}
          {trend && (
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
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

// Mock progress data
const mockProgress = {
  overallProgress: 45,
  totalPoints: 1250,
  currentStreak: 7,
  longestStreak: 14,
  totalTimeSpent: 24.5, // hours
  completedConcepts: 15,
  totalConcepts: 33,
  completedExercises: 28,
  totalExercises: 66,
  averageAccuracy: 87,
  coursesInProgress: 2,
  coursesCompleted: 0,
  achievements: [
    { id: '1', name: 'First Steps', description: 'Complete your first concept', earned: true, icon: Award },
    { id: '2', name: 'Week Warrior', description: 'Maintain a 7-day streak', earned: true, icon: Calendar },
    { id: '3', name: 'Quick Learner', description: 'Complete 10 concepts', earned: true, icon: BookOpen },
    { id: '4', name: 'Point Master', description: 'Earn 1000 points', earned: true, icon: Trophy },
    { id: '5', name: 'Perfect Score', description: 'Get 100% on 5 exercises', earned: false, icon: Target },
    { id: '6', name: 'Course Champion', description: 'Complete your first course', earned: false, icon: CheckCircle },
  ],
  recentActivity: [
    { date: '2024-01-08', concepts: 2, exercises: 4, points: 150, timeSpent: 1.5 },
    { date: '2024-01-07', concepts: 1, exercises: 2, points: 75, timeSpent: 0.8 },
    { date: '2024-01-06', concepts: 3, exercises: 5, points: 200, timeSpent: 2.1 },
    { date: '2024-01-05', concepts: 0, exercises: 1, points: 25, timeSpent: 0.3 },
    { date: '2024-01-04', concepts: 2, exercises: 3, points: 125, timeSpent: 1.2 },
    { date: '2024-01-03', concepts: 1, exercises: 2, points: 100, timeSpent: 1.0 },
    { date: '2024-01-02', concepts: 2, exercises: 4, points: 175, timeSpent: 1.8 },
  ],
  courseProgress: [
    {
      id: '1',
      title: 'Game Development Fundamentals',
      category: 'career' as LifeCategory,
      sectionsCompleted: 1,
      totalSections: 4,
      conceptsCompleted: 3,
      totalConcepts: 12,
      lastActivity: '2 hours ago',
    },
    {
      id: '2',
      title: 'Creative Writing for Teens',
      category: 'personal' as LifeCategory,
      sectionsCompleted: 0,
      totalSections: 5,
      conceptsCompleted: 0,
      totalConcepts: 15,
      lastActivity: '3 days ago',
    },
  ],
};

export const ProgressPage: React.FC = () => {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Progress</h1>
          <p className="text-gray-600">Track your learning journey and achievements</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Points"
            value={mockProgress.totalPoints.toLocaleString()}
            icon={Trophy}
            trend={{ value: 15, isPositive: true }}
            variant="warning"
          />
          <StatsCard
            title="Current Streak"
            value={`${mockProgress.currentStreak} days`}
            icon={Calendar}
            subtitle={`Best: ${mockProgress.longestStreak} days`}
            variant="warning"
          />
          <StatsCard
            title="Threads Pulled"
            value={mockProgress.completedConcepts}
            icon={Spool}
            subtitle={`of ${mockProgress.totalConcepts} total`}
            variant="primary"
          />
          <StatsCard
            title="Average Accuracy"
            value={`${mockProgress.averageAccuracy}%`}
            icon={Target}
            trend={{ value: 3, isPositive: true }}
            variant="success"
          />
        </div>

        {/* Streak Display */}
        <StreakDisplay
          currentStreak={mockProgress.currentStreak}
          longestStreak={mockProgress.longestStreak}
        />

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overall Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Progress</span>
                  <span className="font-medium">{mockProgress.overallProgress}%</span>
                </div>
                <Progress value={mockProgress.overallProgress} className="h-3" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time Invested</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockProgress.totalTimeSpent}
                    <span className="text-sm font-normal text-gray-600 ml-1">hours</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Exercises Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockProgress.completedExercises}
                    <span className="text-sm font-normal text-gray-600 ml-1">
                      / {mockProgress.totalExercises}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockProgress.coursesInProgress}
                    <span className="text-sm font-normal text-gray-600 ml-1">
                      in progress
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProgress.courseProgress.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <Badge variant="default">{course.category}</Badge>
                        <span>Last activity: {course.lastActivity}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Sections Progress</p>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={(course.sectionsCompleted / course.totalSections) * 100}
                              className="flex-1"
                            />
                            <span className="text-xs text-gray-600">
                              {course.sectionsCompleted}/{course.totalSections}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Threads Pulled</p>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={(course.conceptsCompleted / course.totalConcepts) * 100}
                              className="flex-1"
                            />
                            <span className="text-xs text-gray-600">
                              {course.conceptsCompleted}/{course.totalConcepts}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockProgress.achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-teal-50 border-teal-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.earned 
                          ? 'bg-teal-100 text-teal-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        {achievement.earned && (
                          <Badge variant="default" className="mt-2">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProgress.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600 w-20">
                      {new Date(activity.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-teal-600" />
                        {activity.concepts} concepts
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-blue-600" />
                        {activity.exercises} exercises
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-purple-600" />
                        {activity.timeSpent}h
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">{activity.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};