import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { Badge } from '../components/atoms/Badge';
import { CreateThreadModal } from '../components/organisms/CreateThreadModal';
import { InterestsDisplay } from '../components/organisms/InterestsDisplay';
import { InterestsDiscovery } from '../components/organisms/InterestsDiscovery';
import { StreakDisplay } from '../components/molecules/StreakDisplay';
import { 
  Plus,
  Sparkles,
  BookOpen,
  Trophy,
  Target,
  Clock,
  Search,
  Heart,
  TrendingUp,
} from 'lucide-react';
import type { Interest } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { studentProfile, user } = useAuth();
  const [showCreateThreadModal, setShowCreateThreadModal] = useState(false);
  const [showInterestsDiscovery, setShowInterestsDiscovery] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);

  if (!studentProfile || !user) {
    return null;
  }

  const handleInterestClick = (interest: Interest) => {
    setSelectedInterest(interest);
    // Create a thread based on this interest
    setShowCreateThreadModal(true);
  };

  const handleDiscoverInterests = () => {
    setShowInterestsDiscovery(true);
  };

  const recentInterests = studentProfile.interests
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 6);

  const interestsByCategory = studentProfile.interests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-obsidian dark:text-gray-100 mb-2">
              Welcome Home, {studentProfile.firstName}! 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover, explore, and dive deep into what sparks your curiosity
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowCreateThreadModal(true)}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-personal to-social hover:from-personal/90 hover:to-social/90"
          >
            <Plus className="h-5 w-5" />
            Start Learning
          </Button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-personal/10 to-personal/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-personal/20 rounded-lg">
                <Heart className="h-5 w-5 text-personal" />
              </div>
              <div>
                <p className="text-2xl font-bold text-obsidian dark:text-gray-100">
                  {studentProfile.interests.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Interests</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-social/10 to-social/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-social/20 rounded-lg">
                <Trophy className="h-5 w-5 text-social" />
              </div>
              <div>
                <p className="text-2xl font-bold text-obsidian dark:text-gray-100">
                  {studentProfile.totalPoints.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-career/10 to-career/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-career/20 rounded-lg">
                <Target className="h-5 w-5 text-career" />
              </div>
              <div>
                <p className="text-2xl font-bold text-obsidian dark:text-gray-100">
                  {studentProfile.currentStreakDays}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-philanthropic/10 to-philanthropic/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-philanthropic/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-philanthropic" />
              </div>
              <div>
                <p className="text-2xl font-bold text-obsidian dark:text-gray-100">
                  Level {studentProfile.level}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Interests Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Your Top Interests */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100">
              Your Current Interests
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscoverInterests}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Discover More
            </Button>
          </div>

          <InterestsDisplay
            interests={studentProfile.interests}
            onInterestClick={handleInterestClick}
            showCategories={true}
            showStrength={true}
          />
        </div>

        {/* Interest Discovery */}
        <div>
          <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100 mb-4">
            Explore New Topics
          </h2>
          
          <Card className="mb-4 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-700">
            <div className="text-center">
              <div className="p-3 bg-teal-100 dark:bg-teal-800/30 rounded-full w-fit mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold text-obsidian dark:text-gray-100 mb-2">
                What's sparking your curiosity today?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ask any question or explore suggested topics based on your interests
              </p>
              <Button
                variant="primary"
                onClick={() => setShowCreateThreadModal(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Anything
              </Button>
            </div>
          </Card>

          {/* Trending Topics */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-obsidian dark:text-gray-100">
                Trending This Week
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { topic: 'Artificial Intelligence', category: 'career' },
                { topic: 'Climate Science', category: 'philanthropic' },
                { topic: 'Philosophy of Mind', category: 'personal' },
                { topic: 'Social Psychology', category: 'social' },
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setSelectedInterest({
                      interest: item.topic,
                      category: item.category as any,
                      strength: 1,
                    });
                    setShowCreateThreadModal(true);
                  }}
                >
                  <Badge
                    variant="outline"
                    className={`mr-2 text-xs ${
                      item.category === 'career' ? 'border-career text-career' :
                      item.category === 'philanthropic' ? 'border-philanthropic text-philanthropic' :
                      item.category === 'personal' ? 'border-personal text-personal' :
                      'border-social text-social'
                    }`}
                  >
                    {item.category}
                  </Badge>
                  {item.topic}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Interest Categories Overview */}
      {Object.keys(interestsByCategory).length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100 mb-4">
            Your Interest Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(interestsByCategory).map(([category, interests]) => (
              <Card key={category} className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className={`mb-3 ${
                      category === 'career' ? 'border-career text-career bg-career/10' :
                      category === 'philanthropic' ? 'border-philanthropic text-philanthropic bg-philanthropic/10' :
                      category === 'personal' ? 'border-personal text-personal bg-personal/10' :
                      'border-social text-social bg-social/10'
                    }`}
                  >
                    {category}
                  </Badge>
                  <p className="text-2xl font-bold text-obsidian dark:text-gray-100 mb-1">
                    {interests.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {interests.length === 1 ? 'Interest' : 'Interests'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1 justify-center">
                    {interests.slice(0, 3).map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                      >
                        {interest.interest}
                      </span>
                    ))}
                    {interests.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{interests.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Thread Modal */}
      <CreateThreadModal
        isOpen={showCreateThreadModal}
        onClose={() => {
          setShowCreateThreadModal(false);
          setSelectedInterest(null);
        }}
        onThreadCreated={(threadId) => {
          console.log('Thread created from home:', threadId);
        }}
        initialQuestion={selectedInterest ? `I want to learn about ${selectedInterest.interest}` : undefined}
      />

      {/* Interests Discovery Modal */}
      {showInterestsDiscovery && (
        <InterestsDiscovery
          isOpen={showInterestsDiscovery}
          onClose={() => setShowInterestsDiscovery(false)}
          currentInterests={studentProfile.interests}
          onInterestSelected={(interest) => {
            setSelectedInterest(interest);
            setShowInterestsDiscovery(false);
            setShowCreateThreadModal(true);
          }}
        />
      )}
    </div>
  );
};