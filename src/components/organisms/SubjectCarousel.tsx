/**
 * SubjectCarousel Component
 * 
 * Displays a horizontally scrollable carousel of topic cards for a specific subject.
 * Includes navigation buttons and smooth scrolling behavior.
 */

import { Button } from '../atoms/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TopicCard } from '../molecules/TopicCard'
import { cn } from '../../utils/cn'
import { useState } from 'react'

interface Topic {
  id: string
  title: string
  description?: string
  sections: number
  concepts: number
  progress: number
}

interface SubjectCarouselProps {
  title: string
  topics: Topic[]
  color: string
  onTopicClick?: (topicId: string) => void
  className?: string
}

export function SubjectCarousel({ 
  title, 
  topics, 
  color, 
  onTopicClick, 
  className 
}: SubjectCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const cardWidth = 336 // 320px + 16px gap
  const maxScroll = Math.max(0, topics.length * cardWidth - 4 * cardWidth)

  const scrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - cardWidth * 2)
    setScrollPosition(newPosition)
  }

  const scrollRight = () => {
    const newPosition = Math.min(maxScroll, scrollPosition + cardWidth * 2)
    setScrollPosition(newPosition)
  }

  const canScrollLeft = scrollPosition > 0
  const canScrollRight = scrollPosition < maxScroll

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        {topics.length > 4 && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="h-8 w-8 p-0 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="h-8 w-8 p-0 bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex space-x-4 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              title={topic.title}
              description={topic.description}
              sections={topic.sections}
              concepts={topic.concepts}
              progress={topic.progress}
              color={color}
              onCardClick={() => onTopicClick?.(topic.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 