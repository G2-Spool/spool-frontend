/**
 * LearningPage Component
 * 
 * A comprehensive learning interface that displays educational content with
 * sidebar navigation between concepts. This is a simplified version of the
 * original Spool-GitHub learning page with placeholder data.
 * 
 * Features:
 * - Concept sidebar navigation
 * - Educational content presentation
 * - Interactive exercises
 * - Progress tracking
 * - Back navigation
 */

import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { ConceptSidebar } from '@/components/molecules/ConceptSidebar'
import { ConceptPresentation } from '@/components/learning/ConceptPresentation'
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation'
import { useAuth } from '@/contexts/AuthContext'
import { ChevronLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useThreadConcepts, useHardcodedThread, HARDCODED_THREAD_ID } from '@/hooks/useThreadData'

interface ConceptItem {
  id: string
  title: string
  description: string
  completed: boolean
  locked: boolean
  progress: number
}

interface LearningPageProps {
  conceptId?: string
  conceptTitle?: string
  topicId?: string
  onBack?: () => void
  className?: string
}



export function LearningPage({ 
  conceptId = 'probability', 
  conceptTitle, 
  topicId = 'college-algebra', 
  onBack 
}: LearningPageProps) {
  const [currentConceptId, setCurrentConceptId] = useState(conceptId)
  const [startTime, setStartTime] = useState<number>(Date.now())
  
  useAuth()
  const { navigateToUrl } = useUnifiedNavigation()
  
  // Fetch thread and concept data from Supabase
  const { data: thread, isLoading: threadLoading, error: threadError } = useHardcodedThread()
  const { data: conceptsData, isLoading: conceptsLoading, error: conceptsError } = useThreadConcepts(HARDCODED_THREAD_ID)
  
  const loading = threadLoading || conceptsLoading
  const error = threadError?.message || conceptsError?.message || null

  // Update current concept when prop changes
  useEffect(() => {
    if (conceptId !== currentConceptId) {
      setCurrentConceptId(conceptId)
      setStartTime(Date.now())
    }
  }, [conceptId, currentConceptId])

  // Transform concept data into ConceptItem format
  const concepts: ConceptItem[] = (conceptsData || []).map((concept, index) => ({
    id: concept.concept_id,
    title: concept.concept_name,
    description: concept.hook_title,
    completed: index === 0, // First concept is completed
    locked: false,
    progress: index === 0 ? 100 : index === 1 ? 60 : 0 // Mock progress for demonstration
  }))

  // Create topic data from thread
  const topic = thread ? {
    id: thread.id,
    title: thread.title,
    description: thread.situation_description,
    category: (thread.primary_skill_focus as any)?.[0] || 'Mathematics',
    difficulty_level: 'intermediate'
  } : null

  // Get current concept details
  const currentConcept = concepts.find(c => c.id === currentConceptId)

  // Handle concept selection from sidebar
  const handleConceptSelect = async (id: string) => {
    // Track time spent on previous concept (placeholder)
    const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60)
    console.log(`Time spent on ${currentConceptId}: ${timeSpent} minutes`)

    // Set new concept and reset timer
    setCurrentConceptId(id)
    setStartTime(Date.now())
    
    // Update URL if using routing
    if (topicId) {
      navigateToUrl(`/topic/${topicId}/learn/${id}`)
    }
  }

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      // Default back behavior - go to topic overview
      navigateToUrl(`/topic/${topicId}`)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your personalized learning content...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto p-6">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-xl">⚠️</div>
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header with topic info and back button */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{topic?.category || 'Mathematics'}</span>
            <span>•</span>
            <span className="capitalize">{topic?.difficulty_level || 'intermediate'}</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold">{topic?.title || 'Learning Thread'}</h1>
        <p className="text-muted-foreground mt-1">{topic?.description || ''}</p>
        </div>

        {/* Main content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Concept navigation */}
          <div className="lg:col-span-1">
            <ConceptSidebar
              concepts={concepts}
              currentConceptId={currentConceptId}
              onConceptSelect={handleConceptSelect}
              onBack={handleBack}
            />
          </div>

          {/* Main content - Concept presentation */}
          <div className="lg:col-span-3">
            <ConceptPresentation
              conceptId={currentConceptId}
              conceptTitle={currentConcept?.title || conceptTitle}
              topicId={topicId}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 