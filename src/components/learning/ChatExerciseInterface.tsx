/**
 * ChatExerciseInterface Component
 * 
 * Interactive chat-based learning interface for educational exercises.
 * This is a simplified version of the original complex component with
 * placeholders for advanced functionality that can be gradually enhanced.
 * 
 * Features:
 * - Interactive chat interface with typing animations
 * - Exercise management and state tracking
 * - Vocabulary parsing and highlighting (placeholder)
 * - Response highlighting and feedback (placeholder)
 * - Sub-exercise handling (placeholder)
 * - Vocabulary drawer (placeholder)
 * 
 * Note: This is a simplified version - the original component is 1785 lines
 * with complex state management, advanced interactions, and real-time features.
 */

import React, { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { TypingMessage } from './TypingMessage'
import { cn } from '@/utils/cn'
import { 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Loader2, 
  Lightbulb, 
  BookOpen,
  Brain,
  Sigma
} from 'lucide-react'
import { useStudyStreak } from '@/hooks/useStudyStreak'

// Types
interface ChatMessage {
  id: string
  type: 'system' | 'student' | 'thinking'
  content: string
  timestamp: Date
  isTyping?: boolean
  hasBeenTyped?: boolean
  isCurrentlyTyping?: boolean
  exerciseId?: string
  isSubExercise?: boolean
}

interface Exercise {
  id: string
  title: string
  status: 'active' | 'completed' | 'collapsed'
  messages: ChatMessage[]
  currentInput?: string
  isLoading?: boolean
  isTyping?: boolean
  isExpanded?: boolean
}

interface ChatExerciseInterfaceProps {
  conceptId: string
  conceptTitle?: string
  topicId?: string
  className?: string
}

// Mock data for demonstration
const mockExercises: Exercise[] = [
  {
    id: 'exercise-1',
    title: 'Solving Two-Step Linear Equations',
    status: 'active',
    isExpanded: true,
    messages: [
      {
        id: 'msg-1',
        type: 'system',
        content: 'Let\'s practice solving two-step linear equations. I\'ll give you a problem and guide you through the process.\n\nSolve for x: **2x + 5 = 15**\n\nTake your time and explain your approach step by step.',
        timestamp: new Date(),
        exerciseId: 'exercise-1',
        hasBeenTyped: false,
        isCurrentlyTyping: false
      }
    ]
  }
]

// Simple typing indicator
const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
)

// Simplified vocabulary drawer placeholder
const VocabularyDrawer: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Vocabulary Terms</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm">Variable</h4>
            <p className="text-sm text-muted-foreground">The letter representing the unknown value you're looking for (like x).</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm">Coefficient</h4>
            <p className="text-sm text-muted-foreground">The number attached to the variable (the 2 in 2x).</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm">Constant</h4>
            <p className="text-sm text-muted-foreground">A number without a variable (the 5 and 15 in 2x + 5 = 15).</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ChatExerciseInterface({ 
  conceptId, 
  conceptTitle, 
  topicId, 
  className 
}: ChatExerciseInterfaceProps) {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showHintTooltip, setShowHintTooltip] = useState(false)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})
  const { recordCompletion } = useStudyStreak()

  // Mock term counts for demonstration
  const vocabularyCount = 3
  const equationCount = 2
  const conceptCount = 1

  // Manage typing queue - ensure only one message types at a time
  useEffect(() => {
    const activeExercise = exercises.find(ex => ex.status === 'active')
    if (!activeExercise) return

    // Find the first system message that needs typing
    const messageNeedingTyping = activeExercise.messages.find(msg => 
      msg.type === 'system' && !msg.hasBeenTyped && !msg.isCurrentlyTyping
    )

    // Check if any message is currently typing
    const isAnyMessageTyping = activeExercise.messages.some(msg => msg.isCurrentlyTyping)

    // Start typing the next message if nothing is currently typing
    if (messageNeedingTyping && !isAnyMessageTyping) {
      setExercises(prev => prev.map(ex => 
        ex.id === activeExercise.id 
          ? {
              ...ex,
              messages: ex.messages.map(msg => 
                msg.id === messageNeedingTyping.id 
                  ? { ...msg, isCurrentlyTyping: true }
                  : msg
              )
            }
          : ex
      ))
    }
  }, [exercises])

  // Handle sending student response
  const handleSendMessage = async (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId)
    if (!exercise || !exercise.currentInput?.trim()) return

    if (exercise.isLoading) return

    // Set loading state
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, isLoading: true } : ex
    ))
    
    // Add student message
    const studentMessage: ChatMessage = {
      id: `student-${Date.now()}`,
      type: 'student',
      content: exercise.currentInput,
      timestamp: new Date(),
      exerciseId: exerciseId
    }

    // Update state with student message
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, messages: [...ex.messages, studentMessage], currentInput: '' }
        : ex
    ))

    // Show typing indicator
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, isTyping: true } : ex
    ))

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'system',
        content: 'Great work! You\'re on the right track. Let me help you with the next step...',
        timestamp: new Date(),
        exerciseId: exerciseId,
        hasBeenTyped: false,
        isCurrentlyTyping: false
      }

      setExercises(prev => prev.map(ex => 
        ex.id === exerciseId 
          ? { 
              ...ex, 
              messages: [...ex.messages, aiResponse], 
              isTyping: false, 
              isLoading: false 
            }
          : ex
      ))
    }, 2000)
  }

  // Handle input change
  const handleInputChange = (exerciseId: string, value: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, currentInput: value } : ex
    ))
  }

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent, exerciseId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(exerciseId)
    }
  }

  // Toggle exercise expansion
  const toggleExerciseExpansion = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, isExpanded: !ex.isExpanded } : ex
    ))
  }

  // Handle hint
  const handleHint = (exerciseId: string) => {
    // Placeholder for hint functionality
    console.log('Hint requested for exercise:', exerciseId)
  }

  return (
    <div className={cn("w-full mt-8 space-y-4 relative", className)}>
      {/* Vocabulary Drawer */}
      <VocabularyDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Render exercises */}
      {exercises.map((exercise) => (
        <div key={exercise.id} className="relative">
          <Card className="bg-card border-border">
            <div className="p-0">
              {/* Header */}
              <div 
                className={cn(
                  "flex items-center justify-between p-6 cursor-pointer",
                  "bg-gradient-to-r from-card to-card/95 hover:from-card/95 hover:to-card/90 transition-all duration-200",
                  "border-l-4 border-l-primary",
                  exercise.isExpanded ? "rounded-t-lg border-b border-border" : "rounded-lg"
                )}
                onClick={() => toggleExerciseExpansion(exercise.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-xl font-semibold text-foreground">{exercise.title}</h2>
                  <div className="flex items-center gap-1">
                    {/* Vocabulary Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDrawerOpen(true)
                      }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm font-medium text-primary">
                        {vocabularyCount}
                      </span>
                      <BookOpen className="w-4 h-4" />
                    </Button>
                    
                    {/* Equations Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDrawerOpen(true)
                      }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm font-medium text-primary">
                        {equationCount}
                      </span>
                      <Sigma className="w-4 h-4" />
                    </Button>
                    
                    {/* Concepts Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDrawerOpen(true)
                      }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-sm font-medium text-primary">
                        {conceptCount}
                      </span>
                      <Brain className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Chevron Icon */}
                <div className="ml-4">
                  {exercise.isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Content */}
              {exercise.isExpanded && (
                <div className="border-t border-border">
                  {/* Chat Container */}
                  <div 
                    ref={exercise.status === 'active' ? chatContainerRef : null}
                    className="p-6 space-y-4"
                  >
                    {exercise.messages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div className={cn(
                          "flex",
                          message.type === 'student' ? "justify-end" : "justify-start"
                        )}>
                          {(message.type === 'student' || message.isCurrentlyTyping || message.hasBeenTyped) && (
                            <div className={cn(
                              "rounded-lg px-4 py-3 relative max-w-[85%]",
                              message.type === 'student' 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted text-foreground"
                            )}>
                              <div className="leading-relaxed">
                                {message.type === 'system' && message.isCurrentlyTyping ? (
                                  <TypingMessage
                                    content={message.content.trim()}
                                    speed={100}
                                    onComplete={() => {
                                      setExercises(prev => prev.map(ex => 
                                        ex.id === exercise.id 
                                          ? {
                                              ...ex,
                                              messages: ex.messages.map(msg => 
                                                msg.id === message.id 
                                                  ? { ...msg, hasBeenTyped: true, isCurrentlyTyping: false }
                                                  : msg
                                              )
                                            }
                                          : ex
                                      ))
                                    }}
                                  />
                                ) : message.type === 'system' && !message.hasBeenTyped ? (
                                  null
                                ) : (
                                  <div className="whitespace-pre-wrap">{message.content}</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {exercise.isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-3">
                          <TypingIndicator />
                        </div>
                      </div>
                    )}

                    {/* Input Area */}
                    {exercise.status === 'active' && (
                      <div className="mt-4 pt-4">
                        <div className="relative">
                          <Textarea
                            ref={(el) => { inputRefs.current[exercise.id] = el }}
                            value={exercise.currentInput || ''}
                            onChange={(e) => handleInputChange(exercise.id, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, exercise.id)}
                            placeholder="Explain your step-by-step approach..."
                            className="min-h-[100px] resize-none pr-20"
                            disabled={exercise.isLoading}
                          />
                          
                          {/* Hint Button */}
                          <div className="absolute top-2 right-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleHint(exercise.id)}
                              onMouseEnter={() => setShowHintTooltip(true)}
                              onMouseLeave={() => setShowHintTooltip(false)}
                            >
                              <Lightbulb className="w-4 h-4" />
                            </Button>
                            
                            {showHintTooltip && (
                              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-popover border border-border rounded text-sm whitespace-nowrap">
                                Need help?
                              </div>
                            )}
                          </div>
                          
                          {/* Send Button */}
                          <Button
                            onClick={() => handleSendMessage(exercise.id)}
                            disabled={exercise.isLoading || !exercise.currentInput?.trim()}
                            className="absolute right-2 bottom-2"
                            size="sm"
                          >
                            {exercise.isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          Press Enter to send, Shift+Enter for new line
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
} 