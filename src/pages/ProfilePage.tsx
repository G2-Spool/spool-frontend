import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import { ProgressBar } from '../components/molecules/ProgressBar';
import { StatsCard } from '../components/molecules/StatsCard';
import { StreakDisplay } from '../components/molecules/StreakDisplay';
import { InterestBubble } from '../components/molecules/InterestBubble';
import { 
  User, 
  Trophy, 
  Target, 
  BookOpen, 
  Star,
  Heart,
  Users,
  Briefcase,
  Globe,
  Award,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import type { LifeCategory } from '../types';

const lifeCategories: { key: LifeCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'personal', label: 'Personal', icon: <Heart className="h-5 w-5" />, color: 'text-personal' },
  { key: 'social', label: 'Social', icon: <Users className="h-5 w-5" />, color: 'text-social' },
  { key: 'career', label: 'Career', icon: <Briefcase className="h-5 w-5" />, color: 'text-career' },
  { key: 'philanthropic', label: 'Philanthropic', icon: <Globe className="h-5 w-5" />, color: 'text-philanthropic' },
];

export const ProfilePage: React.FC = () => {
  const { studentProfile } = useAuth();

  if (!studentProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading profile...</div>
      </div>
    );
  }

  // Group interests by category
  const interestsByCategory = studentProfile.interests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<LifeCategory, typeof studentProfile.interests>);

  // Calculate level progress (assuming 1000 XP per level)
  const currentLevelXP = studentProfile.experiencePoints % 1000;
  const levelProgress = (currentLevelXP / 1000) * 100;

  // Mock data for achievements (in real app, this would come from studentProfile.badgesEarned)
  const achievements = [
    { id: '1', name: 'First Steps', description: 'Complete your first concept', icon: <Award className="h-8 w-8" />, rarity: 'common' as const },
    { id: '2', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: <Trophy className="h-8 w-8" />, rarity: 'rare' as const },
    { id: '3', name: 'Quick Learner', description: 'Master 10 concepts', icon: <Zap className="h-8 w-8" />, rarity: 'epic' as const },
  ];

  const rarityColors = {
    common: 'bg-gray-100 text-gray-600',
    rare: 'bg-blue-100 text-blue-600',
    epic: 'bg-purple-100 text-purple-600',
    legendary: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32" />
        <div className="relative flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-teal-500 flex items-center justify-center text-white text-2xl font-bold">
              {studentProfile.firstName[0]}{studentProfile.lastName[0]}
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-obsidian dark:text-gray-100">
              {studentProfile.firstName} {studentProfile.lastName}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="primary" size="md">
                Level {studentProfile.level}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {studentProfile.experiencePoints} XP Total
              </span>
            </div>
            <ProgressBar
              value={currentLevelXP}
              max={1000}
              label="Level Progress"
              showPercentage
              variant="default"
              className="mt-4 max-w-xs"
            />
          </div>

          {/* Streak Display */}
          <div className="flex-shrink-0">
            <StreakDisplay
              currentStreak={studentProfile.currentStreakDays}
              longestStreak={studentProfile.longestStreakDays}
            />
          </div>
        </div>
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
          subtitle="Across all subjects"
          icon={BookOpen}
          variant="success"
        />
        <StatsCard
          title="Learning Time"
          value="24h 30m"
          subtitle="This month"
          icon={Clock}
          variant="default"
        />
        <StatsCard
          title="Achievement Score"
          value="850"
          icon={Trophy}
          variant="warning"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Interests Section */}
      <Card>
        <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100 mb-6">
          My Interests
        </h2>
        <div className="space-y-6">
          {lifeCategories.map(({ key, label, icon, color }) => {
            const categoryInterests = interestsByCategory[key] || [];
            if (categoryInterests.length === 0) return null;

            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={color}>{icon}</span>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryInterests.map((interest, idx) => (
                    <InterestBubble
                      key={idx}
                      interest={interest.interest}
                      category={interest.category}
                      strength={interest.strength}
                      size="md"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievements Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100">
            Achievements
          </h2>
          <Badge variant="teal">
            {achievements.length} Unlocked
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${rarityColors[achievement.rarity]}`}>
                  {achievement.icon}
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                  <Badge variant="default" size="sm" className="mt-2">
                    {achievement.rarity}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Learning Paths */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100">
            Active Learning Paths
          </h2>
          <Badge variant="success">
            3 Active
          </Badge>
        </div>
        <div className="space-y-4">
          {/* Mock learning paths - in real app, these would come from API */}
          {[
            { subject: 'Mathematics', progress: 65, topic: 'Algebra II', color: 'bg-blue-500' },
            { subject: 'Biology', progress: 42, topic: 'Cell Structure', color: 'bg-green-500' },
            { subject: 'History', progress: 78, topic: 'World War II', color: 'bg-purple-500' },
          ].map((path, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {path.subject}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {path.topic}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {path.progress}%
                  </span>
                </div>
              </div>
              <ProgressBar
                value={path.progress}
                variant={path.progress >= 75 ? 'success' : 'default'}
                className="mt-2"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Learning Goals */}
      <Card>
        <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100 mb-6">
          Learning Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-teal-500" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                Daily Goal
              </h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-obsidian dark:text-gray-100">
                {studentProfile.dailyGoalMinutes}
              </span>
              <span className="text-gray-600 dark:text-gray-400">minutes/day</span>
            </div>
            <ProgressBar
              value={25}
              max={studentProfile.dailyGoalMinutes}
              label="Today's Progress"
              showPercentage
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
              <span className="text-3xl font-bold text-obsidian dark:text-gray-100">
                5
              </span>
              <span className="text-gray-600 dark:text-gray-400">concepts/week</span>
            </div>
            <ProgressBar
              value={3}
              max={5}
              label="This Week"
              showPercentage
              variant="success"
              className="mt-3"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};