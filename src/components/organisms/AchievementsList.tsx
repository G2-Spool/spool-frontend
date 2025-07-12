/**
 * AchievementsList Component
 * 
 * Displays a list of user achievements with icons and descriptions.
 * Used in the dashboard to show learning milestones and progress.
 */

import React from 'react'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { cn } from '@/utils/cn'
import { Trophy, Star, Target, BookOpen } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  type: 'streak' | 'completion' | 'mastery' | 'exploration'
  earnedAt: Date
  isNew?: boolean
}

interface AchievementsListProps {
  achievements?: Achievement[]
  className?: string
}

// Mock achievements for demonstration
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Completed your first learning session',
    type: 'completion',
    earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isNew: false
  },
  {
    id: '2',
    title: 'Consistent Learner',
    description: 'Maintained a 3-day study streak',
    type: 'streak',
    earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isNew: true
  }
]

const getAchievementIcon = (type: Achievement['type']) => {
  switch (type) {
    case 'streak':
      return <Target className="w-5 h-5 text-primary" />
    case 'completion':
      return <BookOpen className="w-5 h-5 text-success" />
    case 'mastery':
      return <Star className="w-5 h-5 text-warning" />
    case 'exploration':
      return <Trophy className="w-5 h-5 text-info" />
    default:
      return <Trophy className="w-5 h-5 text-primary" />
  }
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  return date.toLocaleDateString()
}

export function AchievementsList({ achievements = mockAchievements, className }: AchievementsListProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Achievements</h3>
          <p className="text-sm text-muted-foreground">
            Your learning milestones and progress
          </p>
        </div>
        
        <div className="space-y-3">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getAchievementIcon(achievement.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {achievement.title}
                    </h4>
                    {achievement.isNew && (
                      <Badge variant="primary" size="sm">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Earned {formatDate(achievement.earnedAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No achievements yet. Start learning to earn your first achievement!
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 