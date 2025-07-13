/**
 * ConceptSidebar Component
 * 
 * A sidebar component for navigating between different concepts in a learning session.
 * Displays concept list with completion status, progress indicators, and navigation.
 */

import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { cn } from '@/utils/cn'
import { CheckCircle, Clock, Lock, ChevronLeft } from 'lucide-react'

interface ConceptItem {
  id: string
  title: string
  description: string
  completed: boolean
  locked: boolean
  progress: number
}

interface ConceptSidebarProps {
  concepts: ConceptItem[]
  currentConceptId: string
  onConceptSelect: (conceptId: string) => void
  onBack?: () => void
  className?: string
}

export function ConceptSidebar({ 
  concepts, 
  currentConceptId, 
  onConceptSelect, 
  onBack, 
  className 
}: ConceptSidebarProps) {
  return (
    <Card className={cn('p-4 h-fit', className)}>
      <div className="space-y-4">
        {/* Header with back button */}
        {onBack && (
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">Back to Overview</span>
          </div>
        )}

        {/* Concepts List */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Concepts</h3>
          <div className="space-y-2">
            {concepts.map((concept) => {
              const isActive = concept.id === currentConceptId
              const isAvailable = !concept.locked

              return (
                <button
                  key={concept.id}
                  onClick={() => isAvailable && onConceptSelect(concept.id)}
                  disabled={!isAvailable}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all duration-200',
                    isActive
                      ? 'border-primary bg-primary/10 text-foreground'
                      : isAvailable
                      ? 'border-border hover:border-primary/50 hover:bg-muted/50 text-foreground'
                      : 'border-border bg-muted/30 text-muted-foreground cursor-not-allowed',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {concept.completed ? (
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        ) : concept.locked ? (
                          <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <h4 className={cn(
                          'text-sm font-medium truncate',
                          isActive ? 'text-foreground' : 'text-foreground'
                        )}>
                          {concept.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {concept.description}
                      </p>
                      
                      {/* Progress bar for non-completed concepts */}
                      {!concept.completed && concept.progress > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{concept.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${concept.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Completed:</span>
              <span>{concepts.filter(c => c.completed).length}/{concepts.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Overall Progress:</span>
              <span>
                {Math.round(
                  concepts.reduce((acc, c) => acc + (c.completed ? 100 : c.progress), 0) / concepts.length
                )}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 