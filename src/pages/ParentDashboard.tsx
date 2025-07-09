import React from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { StatsCard } from '../components/molecules/StatsCard';
import { ProgressBar } from '../components/molecules/ProgressBar';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Clock,
  ChevronRight,
  Activity,
  Calendar,
  Target,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-obsidian mb-2">
          Parent Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor your children's learning progress
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Active Students"
          value="2"
          subtitle="Alex & Emma"
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Weekly Progress"
          value="85%"
          subtitle="Goals achieved"
          icon={Target}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Study Time"
          value="14.5h"
          subtitle="This week"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Points Earned"
          value="450"
          subtitle="This week"
          icon={Trophy}
          variant="default"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Children Overview */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-obsidian">Children Overview</h2>
        
        {/* Child 1 */}
        <Card className="hover:shadow-lg transition-shadow duration-normal">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-teal-700">AJ</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-obsidian">Alex Johnson</h3>
                  <p className="text-sm text-gray-600">Level 3 • 7 day streak 🔥</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Week</p>
                  <p className="text-lg font-semibold text-obsidian">5.2 hours</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Points Earned</p>
                  <p className="text-lg font-semibold text-obsidian">280 pts</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Path</p>
                  <p className="text-lg font-semibold text-obsidian">Game Dev</p>
                </div>
              </div>

              <ProgressBar
                value={65}
                label="Weekly Goal Progress"
                showPercentage
                variant="default"
              />
            </div>

            <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
          </div>
        </Card>

        {/* Child 2 */}
        <Card className="hover:shadow-lg transition-shadow duration-normal">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-purple-700">EJ</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-obsidian">Emma Johnson</h3>
                  <p className="text-sm text-gray-600">Level 2 • 3 day streak</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Week</p>
                  <p className="text-lg font-semibold text-obsidian">3.8 hours</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Points Earned</p>
                  <p className="text-lg font-semibold text-obsidian">170 pts</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Path</p>
                  <p className="text-lg font-semibold text-obsidian">Art & Design</p>
                </div>
              </div>

              <ProgressBar
                value={45}
                label="Weekly Goal Progress"
                showPercentage
                variant="default"
              />
            </div>

            <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-obsidian mb-4">Recent Activity</h2>
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="p-2 rounded-lg bg-green-50">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-obsidian">Alex earned "Problem Solver" badge</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="p-2 rounded-lg bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-obsidian">Emma completed "Introduction to Digital Art"</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="p-2 rounded-lg bg-orange-50">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-obsidian">Alex started a new learning path</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <Button variant="primary">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Review
        </Button>
        <Button variant="outline">
          View Detailed Reports
        </Button>
      </div>
    </div>
  );
};