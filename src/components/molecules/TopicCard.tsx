/**
 * TopicCard Component
 * 
 * Displays a topic/class card with colored header, sections count, concepts count,
 * and completion progress. Includes hover animations and enhanced styling.
 */

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
        "w-80 flex-shrink-0 cursor-pointer group relative",
        "transition-all duration-200 ease-out",
        "hover:shadow-lg hover:shadow-black/5",
        "active:scale-98",
        "rounded-2xl overflow-hidden",
        "border border-gray-300 dark:border-gray-700",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                {/* Colored header section */}
        <div 
          className="h-40 p-5 text-white relative overflow-hidden" 
          style={{ background: color }}
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-white/15 transition-colors duration-200" />
          
          <div className="relative z-10">
            <h3 className="font-semibold text-2xl leading-tight mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-base opacity-90 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
        
                         {/* Stats section with enhanced background */}
        <div className="relative transition-colors duration-200" style={{ backgroundColor: '#1a202c' }}>
          <div className="absolute inset-0 bg-transparent group-hover:bg-white/[0.075] transition-colors duration-200" />
          <div className="relative z-10 px-3 py-2 pb-4">
            <div className="flex justify-around items-center text-base pt-2">
              <div className="text-center">
                <div className="font-bold text-white text-2xl">
                  {sections}
                </div>
                <div className="text-gray-300 text-sm">
                  Sections
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-white text-2xl">
                  {concepts}
                </div>
                <div className="text-gray-300 text-sm">
                  Concepts
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-white text-2xl">
                  {progress}%
                </div>
                <div className="text-gray-300 text-sm">
                  Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 