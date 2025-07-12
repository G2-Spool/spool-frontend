/**
 * TopicCard Component
 * 
 * Displays a topic card with gradient background, topic information, and progress.
 * Features a play button overlay and statistics for sections, concepts, and completion.
 */

import React from "react"
import { Card, CardContent } from "../ui/card"
import { ProgressCircle } from "../atoms/ProgressCircle"

interface TopicCardProps {
  title: string
  description?: string
  sections: number
  concepts: number
  progress: number
  color: string
  onCardClick?: () => void
  onPlayClick?: () => void
}

export function TopicCard({
  title,
  description,
  sections,
  concepts,
  progress,
  color,
  onCardClick,
  onPlayClick,
}: TopicCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Check if the click is on the play button or its children
    const target = e.target as HTMLElement
    if (target.closest('[data-play-button]')) {
      return // Don't handle card click if play button was clicked
    }
    
    onCardClick?.()
  }

  const handlePlayClick = () => {
    onPlayClick?.()
  }

  return (
    <Card
      className="w-80 flex-shrink-0 cursor-pointer hover:shadow-lg transition-all duration-200 rounded-2xl overflow-hidden"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="h-40 p-5 text-white relative overflow-hidden" style={{ background: color }}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
          <div className="relative z-10">
            <h3 className="font-semibold text-xl leading-tight mb-2">{title}</h3>
            {description && <p className="text-base opacity-90 line-clamp-2">{description}</p>}
          </div>
        </div>
        <div className="p-5 space-y-3 relative">
          <div 
            className="absolute left-[calc(85%-4px)] top-0 z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-auto" 
            data-play-button
          >
            <ProgressCircle progress={progress} onClick={handlePlayClick} size={60} />
          </div>
          <div className="flex justify-between items-center text-base pt-2">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{sections}</div>
              <div className="text-gray-600 text-sm">Sections</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{concepts}</div>
              <div className="text-gray-600 text-sm">Concepts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">{progress}%</div>
              <div className="text-gray-600 text-sm">Complete</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 