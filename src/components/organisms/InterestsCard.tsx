/**
 * InterestsCard Component
 * 
 * Displays user interests in a card format with badges.
 * Used in the dashboard to show personalized learning interests.
 */

import React from 'react'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { cn } from '@/utils/cn'

interface InterestsCardProps {
  interests: string[]
  className?: string
}

export function InterestsCard({ interests, className }: InterestsCardProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Your Interests</h3>
          <p className="text-sm text-muted-foreground">
            Learning connections based on your passions
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <Badge
              key={index}
              variant="default"
              className="px-3 py-1"
            >
              {interest}
            </Badge>
          ))}
        </div>
        
        {interests.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              No interests set yet. Add some to personalize your learning experience!
            </p>
          </div>
        )}
      </div>
    </Card>
  )
} 