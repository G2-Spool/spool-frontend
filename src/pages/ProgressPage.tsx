import React from 'react';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import { ProgressBar } from '../components/molecules/ProgressBar';
import { StreakDisplay } from '../components/molecules/StreakDisplay';
import { StatsCard } from '../components/molecules/StatsCard';
import { 
  Trophy, 
  Target, 
  Calendar,
  BookOpen,
  Award,
  CheckCircle,
} from 'lucide-react';
import type { LifeCategory } from '../types';

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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-obsidian mb-2">My Progress</h1>
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
          title="Concepts Mastered"
          value={mockProgress.completedConcepts}
          icon={BookOpen}
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
        <h2 className="text-lg font-semibold text-obsidian mb-4">Overall Learning Progress</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Total Progress</span>
              <span className="font-medium">{mockProgress.overallProgress}%</span>
            </div>
            <ProgressBar
              value={mockProgress.overallProgress}
              variant="default"
              size="lg"
              showPercentage
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Time Invested</p>
              <p className="text-2xl font-bold text-obsidian">
                {mockProgress.totalTimeSpent}
                <span className="text-sm font-normal text-gray-600 ml-1">hours</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Exercises Completed</p>
              <p className="text-2xl font-bold text-obsidian">
                {mockProgress.completedExercises}
                <span className="text-sm font-normal text-gray-600 ml-1">
                  / {mockProgress.totalExercises}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Courses</p>
              <p className="text-2xl font-bold text-obsidian">
                {mockProgress.coursesInProgress}
                <span className="text-sm font-normal text-gray-600 ml-1">
                  in progress
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Course Progress */}
      <div>
        <h2 className="text-lg font-semibold text-obsidian mb-4">Course Progress</h2>
        <div className="space-y-4">
          {mockProgress.courseProgress.map((course) => (
            <Card key={course.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-obsidian mb-1">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <Badge variant="primary" size="sm">{course.category}</Badge>
                    <span>Last activity: {course.lastActivity}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Sections Progress</p>
                      <ProgressBar
                        value={(course.sectionsCompleted / course.totalSections) * 100}
                        label={`${course.sectionsCompleted}/${course.totalSections}`}
                        size="sm"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Concepts Mastered</p>
                      <ProgressBar
                        value={(course.conceptsCompleted / course.totalConcepts) * 100}
                        label={`${course.conceptsCompleted}/${course.totalConcepts}`}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold text-obsidian mb-4">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockProgress.achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`text-center p-4 rounded-lg transition-all ${
                  achievement.earned 
                    ? 'bg-white border border-teal-200 shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 opacity-50'
                }`}
              >
                <div className={`inline-flex p-3 rounded-full mb-2 ${
                  achievement.earned ? 'bg-teal-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    achievement.earned ? 'text-teal-600' : 'text-gray-400'
                  }`} />
                </div>
                <h4 className={`text-sm font-semibold mb-1 ${
                  achievement.earned ? 'text-obsidian' : 'text-gray-500'
                }`}>
                  {achievement.name}
                </h4>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Chart */}
      <Card>
        <h2 className="text-lg font-semibold text-obsidian mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {mockProgress.recentActivity.map((day) => (
            <div key={day.date} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-sm text-obsidian">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-gray-600">
                  {day.concepts} concepts • {day.exercises} exercises • {day.timeSpent}h
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-teal-600">+{day.points} pts</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};