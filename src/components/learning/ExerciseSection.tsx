/**
 * ExerciseSection Component
 * 
 * A wrapper component that renders the ChatExerciseInterface for interactive
 * learning exercises. This component serves as the entry point for exercise
 * functionality within the learning system.
 * 
 * Features:
 * - Integrates with ChatExerciseInterface for interactive exercises
 * - Passes through concept and topic information
 * - Provides exercise container styling
 * 
 * Note: This is currently a placeholder wrapper until ChatExerciseInterface 
 * is migrated to spool-frontend.
 */

import React from 'react'
import { cn } from '@/utils/cn'
import { ChatExerciseInterface } from './ChatExerciseInterface'

interface ExerciseSectionProps {
  conceptId: string
  conceptTitle?: string
  topicId?: string
  className?: string
}

export function ExerciseSection({ conceptId, conceptTitle, topicId, className }: ExerciseSectionProps) {
  return (
    <div className={cn("chat-exercise-container", className)}>
      <ChatExerciseInterface 
        conceptId={conceptId}
        conceptTitle={conceptTitle}
        topicId={topicId}
      />
    </div>
  )
} 