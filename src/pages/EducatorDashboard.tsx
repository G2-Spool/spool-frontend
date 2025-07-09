import React from 'react';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { StatsCard } from '../components/molecules/StatsCard';
import { ProgressBar } from '../components/molecules/ProgressBar';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  FileText,
  Download,
  Filter,
  Search,
} from 'lucide-react';

export const EducatorDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-obsidian mb-2">
          Educator Dashboard
        </h1>
        <p className="text-gray-600">
          Track class performance and learning outcomes
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Active Students"
          value="28"
          subtitle="In 2 classes"
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Avg. Progress"
          value="72%"
          subtitle="This semester"
          icon={TrendingUp}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Lessons Completed"
          value="142"
          subtitle="This month"
          icon={BookOpen}
          variant="warning"
        />
        <StatsCard
          title="Achievement Rate"
          value="89%"
          subtitle="Students on track"
          icon={Award}
          variant="default"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Class Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-obsidian">Class Overview</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class 1 */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-obsidian">Grade 8A - Science</h3>
                  <p className="text-sm text-gray-600">15 students • Environmental Science Path</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Class Average</span>
                  <span className="font-medium">78%</span>
                </div>
                <ProgressBar value={78} variant="success" />

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Completion</p>
                    <p className="text-sm font-semibold">12/15</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Avg. Time</p>
                    <p className="text-sm font-semibold">3.2h/wk</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Engagement</p>
                    <p className="text-sm font-semibold">High</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Class 2 */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-obsidian">Grade 7B - Technology</h3>
                  <p className="text-sm text-gray-600">13 students • Coding Fundamentals Path</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Class Average</span>
                  <span className="font-medium">65%</span>
                </div>
                <ProgressBar value={65} variant="warning" />

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Completion</p>
                    <p className="text-sm font-semibold">8/13</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Avg. Time</p>
                    <p className="text-sm font-semibold">2.8h/wk</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Engagement</p>
                    <p className="text-sm font-semibold">Medium</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Top Performers */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-obsidian mb-4">Top Performers This Week</h2>
        <Card>
          <div className="space-y-4">
            {[
              { name: 'Sarah Chen', points: 340, progress: 95, streak: 12 },
              { name: 'Michael Brown', points: 285, progress: 88, streak: 8 },
              { name: 'Emily Davis', points: 270, progress: 82, streak: 6 },
              { name: 'James Wilson', points: 255, progress: 78, streak: 5 },
            ].map((student, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-teal-700">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-obsidian">{student.name}</p>
                    <p className="text-xs text-gray-600">{student.points} points • {student.streak} day streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <ProgressBar value={student.progress} size="sm" />
                  </div>
                  <Badge variant={student.progress >= 90 ? 'success' : 'default'} size="sm">
                    {student.progress}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Learning Insights */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-obsidian mb-4">Learning Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-900">Most Popular Topic</p>
              <p className="text-2xl font-bold text-blue-900">Game Development</p>
              <p className="text-xs text-blue-700">18 students enrolled</p>
            </div>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-900">Highest Completion</p>
              <p className="text-2xl font-bold text-green-900">Environmental Science</p>
              <p className="text-xs text-green-700">92% completion rate</p>
            </div>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-900">Needs Attention</p>
              <p className="text-2xl font-bold text-amber-900">Math Foundations</p>
              <p className="text-xs text-amber-700">5 students struggling</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="primary">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};