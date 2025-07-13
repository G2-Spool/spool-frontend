/**
 * TopicCard Component
 * 
 * Displays a topic/class card with colored header, sections count, concepts count,
 * and completion progress. Includes a play button for starting the topic.
 */

import React from 'react'
import { Card } from '../atoms/Card'
import { cn } from '../../utils/cn'

interface TopicCardProps {
  title: string
  description?: string
  sections: number
  concepts: number
  progress: number
  color: string
  onCardClick?: () => void
  className?: string
}

export function TopicCard({
  title,
  description,
  sections,
  concepts,
  progress,
  color,
  onCardClick,
  className
}: TopicCardProps) {
  const handleCardClick = () => {
    onCardClick?.()
  }

  return (
    <div
      className={cn(
        "w-80 flex-shrink-0 cursor-pointer hover:shadow-lg transition-all duration-200 rounded-2xl overflow-hidden",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="p-0">
        <div 
          className="h-40 p-5 text-white relative overflow-hidden" 
          style={{ background: color }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
          <div className="relative z-10">
            <h3 className="font-semibold text-xl leading-tight mb-2">{title}</h3>
            {description && <p className="text-base opacity-90 line-clamp-2">{description}</p>}
          </div>
        </div>
        <div className="p-5 space-y-3 relative bg-card">
          <div className="flex justify-between items-center text-base pt-2">
            <div className="text-center">
              <div className="font-bold text-foreground text-lg">{sections}</div>
              <div className="text-muted-foreground text-sm">Sections</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-foreground text-lg">{concepts}</div>
              <div className="text-muted-foreground text-sm">Concepts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-foreground">{progress}%</div>
              <div className="text-muted-foreground text-sm">Complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 