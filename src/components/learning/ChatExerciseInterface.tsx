"use client"

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

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
  X,
  BookOpen,
  Sigma,
  Brain
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

// Custom styles for subtle term highlighting
const termHighlightStyles = `
  @keyframes subtleHighlight {
    0% { 
      border-color: transparent; 
      background-color: transparent;
    }
    11% { 
      border-color: rgba(156, 163, 175, 0.4);
      background-color: rgba(156, 163, 175, 0.05);
    }
    22% { 
      border-color: transparent; 
      background-color: transparent;
    }
    33% { 
      border-color: rgba(156, 163, 175, 0.4);
      background-color: rgba(156, 163, 175, 0.05);
    }
    44% { 
      border-color: transparent; 
      background-color: transparent;
    }
    56% { 
      border-color: rgba(156, 163, 175, 0.4);
      background-color: rgba(156, 163, 175, 0.05);
    }
    100% { 
      border-color: transparent; 
      background-color: transparent;
    }
  }
  
  .term-highlight {
    border: 1px solid transparent;
    border-radius: 6px;
  }
  
  .term-highlight-active {
    animation: subtleHighlight 3.6s ease-in-out;
    border: 1px solid transparent;
    border-radius: 6px;
  }
  
  /* Gradient glow effects */
  .vocab-glow:hover {
    filter: drop-shadow(0 0 8px rgba(79, 209, 197, 0.5));
  }
  
  .equation-glow:hover {
    filter: drop-shadow(0 0 8px rgba(128, 90, 213, 0.5));
  }
  
  .concept-glow:hover {
    filter: drop-shadow(0 0 8px rgba(237, 100, 166, 0.5));
  }
  
  /* Tooltip animations */
  @keyframes animate-in {
    from {
      opacity: 0;
      transform: translate(-50%, 0.25rem);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
  .animate-in {
    animation: animate-in 0.2s ease-out;
  }
`

// Response highlight styles
const responseHighlightStyles = `
  .response-highlight-vague {
    background-color: rgba(252, 211, 77, 0.1);
    border: 1px solid rgba(252, 211, 77, 0.4);
    border-radius: 4px;
    padding: 2px 4px;
    transition: all 0.2s ease;
  }
  
  .response-highlight-vague:hover {
    background-color: rgba(252, 211, 77, 0.15);
    border-color: rgba(252, 211, 77, 0.6);
  }
  
  .response-highlight-incorrect {
    background-color: rgba(248, 113, 113, 0.1);
    border: 1px solid rgba(248, 113, 113, 0.4);
    border-radius: 4px;
    padding: 2px 4px;
    transition: all 0.2s ease;
  }
  
  .response-highlight-incorrect:hover {
    background-color: rgba(248, 113, 113, 0.15);
    border-color: rgba(248, 113, 113, 0.6);
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = termHighlightStyles + '\n' + responseHighlightStyles
  if (!document.head.querySelector('style[data-term-highlight]')) {
    styleSheet.setAttribute('data-term-highlight', 'true')
    document.head.appendChild(styleSheet)
  }
}

// Types
interface VocabularyTerm {
  term: string
  definition: string
  type: 'vocabulary' | 'equation' | 'concept'
}

interface ResponseHighlight {
  type: 'vague' | 'incorrect'
  text: string
  tooltip: string
}

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
  subExerciseLevel?: number
  highlights?: ResponseHighlight[]
}

interface Exercise {
  id: string
  title: string
  status: 'active' | 'completed' | 'collapsed'
  messages: ChatMessage[]
  isSubExercise?: boolean
  parentId?: string
  level?: number
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

// Response Highlight Component
const ResponseHighlight: React.FC<{
  text: string
  type: 'vague' | 'incorrect'
  tooltip: string
}> = ({ text, type, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isPositionSet, setIsPositionSet] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)

  const updateTooltipPosition = () => {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8
      })
      setIsPositionSet(true)
    }
  }

  const handleMouseEnter = () => {
    if (tooltipTimer) clearTimeout(tooltipTimer)
    setIsPositionSet(false)
    
    const timer = setTimeout(() => {
      updateTooltipPosition()
      requestAnimationFrame(() => setShowTooltip(true))
    }, 300)
    setTooltipTimer(timer)
  }

  const handleMouseLeave = () => {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer)
      setTooltipTimer(null)
    }
    setShowTooltip(false)
  }

  useEffect(() => {
    return () => {
      if (tooltipTimer) clearTimeout(tooltipTimer)
    }
  }, [tooltipTimer])

  return (
    <>
      <span
        ref={spanRef}
        className={cn(
          "cursor-pointer",
          type === 'vague' ? "response-highlight-vague" : "response-highlight-incorrect"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </span>
      
      {showTooltip && isPositionSet && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed z-50 pointer-events-none transition-opacity duration-200"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            opacity: showTooltip ? 1 : 0
          }}
        >
          <div className="px-3 py-2 rounded-lg shadow-lg whitespace-nowrap" style={{ backgroundColor: '#5a6478', border: '1px solid #374151' }}>
            <p className="text-sm text-white">{tooltip}</p>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: '#5a6478', borderRight: '1px solid #374151', borderBottom: '1px solid #374151' }}></div>
              </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

// Parse highlighted sections from AI response
const parseHighlights = (content: string): ResponseHighlight[] => {
  const highlights: ResponseHighlight[] = []
  
  // Parse vague highlights: [[vague:text]]
  const vagueRegex = /\[\[vague:(.*?)\]\]/g
  let match
  while ((match = vagueRegex.exec(content)) !== null) {
    highlights.push({
      type: 'vague',
      text: match[1],
      tooltip: 'Try elaborating'
    })
  }
  
  // Parse incorrect highlights: [[incorrect:text]]
  const incorrectRegex = /\[\[incorrect:(.*?)\]\]/g
  while ((match = incorrectRegex.exec(content)) !== null) {
    highlights.push({
      type: 'incorrect',
      text: match[1],
      tooltip: "Let's correct this"
    })
  }
  
  return highlights
}

// Apply highlights to student message
const applyHighlightsToText = (text: string, highlights: ResponseHighlight[]): React.ReactNode => {
  if (!highlights || highlights.length === 0) return text

  const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length)
  const elements: React.ReactNode[] = []
  const highlightedRanges: Array<{start: number, end: number}> = []
  
  sortedHighlights.forEach(highlight => {
    const regex = new RegExp(highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    let match
    
    while ((match = regex.exec(text)) !== null) {
      const start = match.index
      const end = start + highlight.text.length
      
      const overlaps = highlightedRanges.some(range => 
        (start >= range.start && start < range.end) || 
        (end > range.start && end <= range.end)
      )
      
      if (!overlaps) {
        highlightedRanges.push({ start, end })
      }
    }
  })
  
  highlightedRanges.sort((a, b) => a.start - b.start)
  
  let lastEnd = 0
  highlightedRanges.forEach(range => {
    if (range.start > lastEnd) {
      elements.push(text.slice(lastEnd, range.start))
    }
    
    const highlightText = text.slice(range.start, range.end)
    const highlight = highlights.find(h => h.text === highlightText)
    
    if (highlight) {
      elements.push(
        <ResponseHighlight
          key={`${highlight.type}-${range.start}`}
          text={highlight.text}
          type={highlight.type}
          tooltip={highlight.tooltip}
        />
      )
    }
    
    lastEnd = range.end
  })
  
  if (lastEnd < text.length) {
    elements.push(text.slice(lastEnd))
  }
  
  return elements.length > 0 ? elements : text
}

// Vocabulary terms for the concept
const vocabularyTerms: VocabularyTerm[] = [
  { term: 'Variable', definition: 'The letter representing the unknown value you\'re looking for (like x).', type: 'vocabulary' },
  { term: 'Coefficient', definition: 'The number attached to the variable (the 2 in 2x).', type: 'vocabulary' },
  { term: 'Constant', definition: 'A number without a variable (the 5 and 15 in 2x + 5 = 15).', type: 'vocabulary' },
  { term: 'PEMDAS', definition: 'Parentheses, Exponents, Multiplication/Division, Addition/Subtraction - the order of operations.', type: 'concept' },
  { term: '2x + 5 = 15', definition: 'A two-step linear equation where x is multiplied by 2, then 5 is added, equaling 15.', type: 'equation' },
  { term: '15m + 20 = 80', definition: 'A two-step linear equation representing the gym membership problem.', type: 'equation' },
  { term: '10x + 4 = 24', definition: 'A practice two-step linear equation for the sub-exercise.', type: 'equation' }
]

// Mock exercise data
const mockExercises: Exercise[] = [
  {
    id: 'exercise-1',
    title: 'Two-Step Linear Equations Practice',
    status: 'active',
    currentInput: '',
    isLoading: false,
    isTyping: false,
    messages: [
      {
        id: 'msg-1',
        type: 'system',
        content: 'Let\'s practice solving two-step equations! In these problems, we\'ll work with a Variable (the unknown value we\'re solving for) and use PEMDAS to guide our solution steps.',
        timestamp: new Date(),
        exerciseId: 'exercise-1',
        hasBeenTyped: false,
        isCurrentlyTyping: false
      },
      {
        id: 'msg-2',
        type: 'system',
        content: 'Problem: You want to join a gym. The gym charges a one-time \\$20 sign-up fee and then \\$15 per month. You have a total budget of \\$80 to spend. Write and solve an equation to find out how many months (m) you can be a member.\n\nThis gives us the equation: 15m + 20 = 80\n\nExplain each step of your thought process.',
        timestamp: new Date(),
        exerciseId: 'exercise-1',
        hasBeenTyped: false,
        isCurrentlyTyping: false
      }
    ]
  }
]

// Mock feedback responses
const mockFeedbackResponses = [
  {
    id: 'feedback-1',
    content: 'Evaluation Complete.\n\n**Step 1:** ✅ Correctly formulated equation with the Variable m representing months.\n\n**Step 2:** ❌ Incorrect order of operations. [[incorrect:get rid of the 15 first]]\n\nLet me help you with Step 2 - this is a common mistake when working with the Coefficient that we can fix together.\n\nSending articulated Step 2 to remediation AI...'
  },
  {
    id: 'remediation-1',
    content: 'I see your logic in Step 2 was to "get rid of the 15 first." Let\'s look at the **Workflow** section again.\n\n*Workflow Step 2* is "Undo Addition/Subtraction" and *Step 3* is "Undo Multiplication/Division." You tried to do multiplication/division first. Remember the "getting dressed" mental model and PEMDAS: you have to undo things in the reverse order.',
    isSubExercise: true
  },
  {
    id: 'sub-exercise-1',
    content: 'Sub-Exercise: Let\'s practice that specific step. If you have the equation 10x + 4 = 24, what is the very first thing you must do to both sides to isolate the Variable and follow the correct workflow?',
    isSubExercise: true
  },
  {
    id: 'sub-exercise-response',
    content: 'Exactly! [[vague:Now, apply that same logic]] to your original problem: 15m + 20 = 80.\n\nNotice how we need to deal with the Constant (20) before we can work with the Coefficient (15).\n\nWhat should be the very first step?'
  },
  {
    id: 'completion-response',
    content: 'Perfect! You correctly identified that we need to subtract 20 from both sides first. This gives us 15m = 60, and then dividing by 15 (the Coefficient) gives us m = 4.\n\n**Solution:** You can be a member for 4 months! 🎉\n\n<EXERCISE_COMPLETE>Two-Step Linear Equations Practice</EXERCISE_COMPLETE>\n\nExcellent work mastering this concept! You\'ve demonstrated solid understanding of the correct order of operations in solving two-step equations using PEMDAS.'
  }
]

// Vocabulary parsing function
const parseVocabularyTermsGeneric = (
  text: string, 
  onTermClick?: (term: string, type: string) => void
): React.ReactNode => {
  const elements: React.ReactNode[] = []
  const sortedTerms = [...vocabularyTerms].sort((a, b) => b.term.length - a.term.length)
  const matches: Array<{vocab: VocabularyTerm, start: number, end: number, matchedText: string}> = []

  sortedTerms.forEach(vocab => {
    const escapedTerm = vocab.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = vocab.type === 'equation' 
      ? escapedTerm 
      : `\\b${escapedTerm}\\b`
    
    const regex = new RegExp(pattern, 'gi')
    let match
    
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        vocab,
        start: match.index,
        end: match.index + match[0].length,
        matchedText: match[0]
      })
    }
  })

  matches.sort((a, b) => a.start - b.start)

  // Remove overlapping matches
  const filteredMatches = matches.filter((match, index) => {
    if (index === 0) return true
    const prevMatch = matches[index - 1]
    return match.start >= prevMatch.end
  })

  let lastEnd = 0
  filteredMatches.forEach(match => {
    if (match.start > lastEnd) {
      elements.push(text.slice(lastEnd, match.start))
    }
    
    elements.push(
      <VocabularyHighlight 
        key={`${match.vocab.term}-${match.start}`}
        term={match.matchedText}
        definition={match.vocab.definition}
        type={match.vocab.type}
        onTermClick={() => onTermClick?.(match.matchedText, match.vocab.type)}
      />
    )
    
    lastEnd = match.end
  })

  if (lastEnd < text.length) {
    elements.push(text.slice(lastEnd))
  }

  return elements.length > 0 ? <>{elements}</> : text
}

// Vocabulary highlight component
const VocabularyHighlight: React.FC<{
  term: string
  definition: string
  type: 'vocabulary' | 'equation' | 'concept'
  onTermClick?: (term: string) => void
}> = ({ term, definition, type, onTermClick }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isPositionSet, setIsPositionSet] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)

  const updateTooltipPosition = () => {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8
      })
      setIsPositionSet(true)
    }
  }

  const handleMouseEnter = () => {
    if (tooltipTimer) clearTimeout(tooltipTimer)
    setIsPositionSet(false)
    
    const timer = setTimeout(() => {
      updateTooltipPosition()
      requestAnimationFrame(() => setShowTooltip(true))
    }, 300)
    setTooltipTimer(timer)
  }

  const handleMouseLeave = () => {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer)
      setTooltipTimer(null)
    }
    setShowTooltip(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (tooltipTimer) {
      clearTimeout(tooltipTimer)
      setTooltipTimer(null)
    }
    
    updateTooltipPosition()
    setShowTooltip(true)
    
    if (onTermClick) {
      onTermClick(term)
    }
    
    window.dispatchEvent(new CustomEvent('scrollToVocabularyTerm', { 
      detail: { term, type } 
    }))
  }

  useEffect(() => {
    return () => {
      if (tooltipTimer) clearTimeout(tooltipTimer)
    }
  }, [tooltipTimer])

  return (
    <>
      <span
        ref={spanRef}
        className={cn(
          "cursor-pointer transition-all duration-200 relative font-medium inline-block",
          type === 'vocabulary' && "bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] bg-clip-text text-transparent hover:from-[#5FE1D5] hover:to-[#48C2BC] vocab-glow",
          type === 'equation' && "bg-gradient-to-r from-[#805AD5] to-[#9F7AEA] bg-clip-text text-transparent hover:from-[#9F7AEA] hover:to-[#B794F4] equation-glow",
          type === 'concept' && "bg-gradient-to-r from-[#ED64A6] to-[#F687B3] bg-clip-text text-transparent hover:from-[#F687B3] hover:to-[#FBB6CE] concept-glow"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {term}
      </span>
      
      {showTooltip && isPositionSet && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed z-50 pointer-events-none transition-opacity duration-200"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            opacity: showTooltip ? 1 : 0
          }}
        >
                      <div className="relative rounded-lg shadow-xl px-4 py-3 max-w-sm w-64" style={{ backgroundColor: '#5a6478', border: '1px solid #374151' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                type === 'vocabulary' && "bg-[#4FD1C5]",
                type === 'equation' && "bg-[#805AD5]",
                type === 'concept' && "bg-[#ED64A6]"
              )} />
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {type === 'equation' ? 'Formula' : type}
              </span>
            </div>
            
            <p className="text-sm text-gray-200 leading-relaxed">{definition}</p>
            <p className="text-xs text-gray-500 mt-2 italic">Click to view in context</p>
            
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]" style={{ borderTopColor: '#5a6478' }}></div>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] -mt-[7px]" style={{ borderTopColor: '#374151' }}></div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

// Typing indicator component
const TypingIndicator: React.FC = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
  </div>
)

// Formatted message component for completed messages
const FormattedMessage: React.FC<{
  content: string
  parseVocabulary?: (text: string) => React.ReactNode
}> = ({ content, parseVocabulary }) => {
  const processNode = (node: React.ReactNode): React.ReactNode => {
    if (!parseVocabulary) return node
    
    if (typeof node === 'string') {
      return parseVocabulary(node)
    }
    
    if (React.isValidElement(node) && node.props && typeof node.props === 'object') {
      const nodeProps = node.props as { children?: React.ReactNode }
      const children = React.Children.map(nodeProps.children, child => processNode(child))
      return React.cloneElement(node, {}, children)
    }
    
    if (Array.isArray(node)) {
      return node.map((child, idx) => <React.Fragment key={idx}>{processNode(child)}</React.Fragment>)
    }
    
    return node
  }
  
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{processNode(children)}</p>,
        strong: ({ children }) => <strong className="font-semibold">{processNode(children)}</strong>,
        em: ({ children }) => <em className="italic">{processNode(children)}</em>,
        code: (props: { inline?: boolean; children?: React.ReactNode }) => {
          const { inline, children } = props
          if (inline) {
            return <code className="px-1 py-0.5 rounded text-sm" style={{ backgroundColor: '#4a5568' }}>{children}</code>
          }
          return (
            <pre className="my-2 p-3 rounded overflow-x-auto" style={{ backgroundColor: '#4a5568' }}>
              <code>{children}</code>
            </pre>
          )
        },
        ul: ({ children }) => <ul className="list-disc list-inside ml-4 my-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside ml-4 my-2">{children}</ol>,
        li: ({ children }) => <li className="my-1">{processNode(children)}</li>
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// Vocabulary drawer component
const VocabularyDrawer: React.FC<{
  isOpen: boolean
  onClose: () => void
  newTerms: string[]
  onClearNewTerms: () => void
  setDrawerOpen: (open: boolean) => void
}> = ({ isOpen, onClose, newTerms, onClearNewTerms, setDrawerOpen }) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && newTerms.length > 0) {
      setShouldAnimate(true)
      
      const timer = setTimeout(() => {
        setShouldAnimate(false)
        onClearNewTerms()
      }, 4100)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, newTerms.length, onClearNewTerms])

  return (
    <>
      {/* Drawer Tab */}
      {!isOpen && (
        <div 
          className="fixed right-0 z-40 transition-all duration-300"
          style={{ bottom: '15%', transform: 'translateY(50%)' }}
        >
          <Button
            variant="ghost"
            onClick={() => setDrawerOpen(true)}
            className="bg-card border border-border rounded-l-lg px-2 py-8 text-foreground text-sm font-medium transition-all duration-300 hover:bg-accent border-r-0 opacity-80"
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="transform -rotate-90 whitespace-nowrap">Terms</span>
              {newTerms.length > 0 && (
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </Button>
        </div>
      )}

      {/* Drawer Content */}
      <div 
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 h-full w-[30%] z-30 transition-transform duration-300 overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backgroundColor: '#1e2430', borderLeft: '1px solid #374151' }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Vocabulary & Terms</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Vocabulary Section */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Vocabulary
              </h4>
              <div className="space-y-0">
                {vocabularyTerms.filter(term => term.type === 'vocabulary').map((vocab, index, arr) => (
                  <div key={vocab.term}>
                    <div 
                      className={cn(
                        "p-3 transition-all duration-300 hover:bg-accent/50",
                        newTerms.includes(vocab.term) && shouldAnimate && "term-highlight-active"
                      )}
                      style={{
                        animationDelay: newTerms.includes(vocab.term) && shouldAnimate ? `${index * 0.1}s` : '0s'
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#4FD1C5]" />
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">{vocab.term}</h5>
                          <p className="text-sm text-muted-foreground leading-relaxed">{vocab.definition}</p>
                        </div>
                      </div>
                    </div>
                    {index < arr.length - 1 && (
                      <div className="mx-3" style={{ borderBottom: '1px solid #2d3748' }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Equations Section */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Equations
              </h4>
              <div className="space-y-0">
                {vocabularyTerms.filter(term => term.type === 'equation').map((vocab, index, arr) => (
                  <div key={vocab.term}>
                    <div 
                      className={cn(
                        "p-3 transition-all duration-300 hover:bg-accent/50",
                        newTerms.includes(vocab.term) && shouldAnimate && "term-highlight-active"
                      )}
                      style={{
                        animationDelay: newTerms.includes(vocab.term) && shouldAnimate ? `${index * 0.1}s` : '0s'
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#805AD5]" />
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">{vocab.term}</h5>
                          <p className="text-sm text-muted-foreground leading-relaxed">{vocab.definition}</p>
                        </div>
                      </div>
                    </div>
                    {index < arr.length - 1 && (
                      <div className="mx-3" style={{ borderBottom: '1px solid #2d3748' }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Concepts Section */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Concepts
              </h4>
              <div className="space-y-0">
                {vocabularyTerms.filter(term => term.type === 'concept').map((vocab, index, arr) => (
                  <div key={vocab.term}>
                    <div 
                      className={cn(
                        "p-3 transition-all duration-300 hover:bg-accent/50",
                        newTerms.includes(vocab.term) && shouldAnimate && "term-highlight-active"
                      )}
                      style={{
                        animationDelay: newTerms.includes(vocab.term) && shouldAnimate ? `${index * 0.1}s` : '0s'
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#ED64A6]" />
                        <div>
                          <h5 className="font-semibold text-foreground mb-1">{vocab.term}</h5>
                          <p className="text-sm text-muted-foreground leading-relaxed">{vocab.definition}</p>
                        </div>
                      </div>
                    </div>
                    {index < arr.length - 1 && (
                      <div className="mx-3" style={{ borderBottom: '1px solid #2d3748' }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Helper function to get term counts
const getTermCounts = () => {
  const vocabularyCount = vocabularyTerms.filter(term => term.type === 'vocabulary').length
  const equationCount = vocabularyTerms.filter(term => term.type === 'equation').length
  const conceptCount = vocabularyTerms.filter(term => term.type === 'concept').length
  
  return { vocabularyCount, equationCount, conceptCount }
}

// Main component
export function ChatExerciseInterface({ 
  className 
}: ChatExerciseInterfaceProps) {
  const [exercises, setExercises] = useState<Exercise[]>(
    mockExercises.map(ex => ({ ...ex, isExpanded: true }))
  )
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [newTerms, setNewTerms] = useState<string[]>([])
  const [showHintTooltip, setShowHintTooltip] = useState(false)
  const [hintTooltipTimer, setHintTooltipTimer] = useState<NodeJS.Timeout | null>(null)
  const [jumpToExerciseVisible, setJumpToExerciseVisible] = useState(false)
  const subExerciseCreationInProgress = useRef<Set<string>>(new Set())
  const [buttonTooltips, setButtonTooltips] = useState<{
    vocab: boolean
    equations: boolean
    concepts: boolean
  }>({ vocab: false, equations: false, concepts: false })
  const [buttonTooltipTimers, setButtonTooltipTimers] = useState<{
    vocab: NodeJS.Timeout | null
    equations: NodeJS.Timeout | null
    concepts: NodeJS.Timeout | null
  }>({ vocab: null, equations: null, concepts: null })
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})
  const { vocabularyCount, equationCount, conceptCount } = getTermCounts()

  // Button tooltip handlers
  const handleButtonTooltip = (type: 'vocab' | 'equations' | 'concepts', show: boolean) => {
    if (show) {
      const timer = setTimeout(() => {
        setButtonTooltips(prev => ({ ...prev, [type]: true }))
      }, 500)
      setButtonTooltipTimers(prev => ({ ...prev, [type]: timer }))
    } else {
      if (buttonTooltipTimers[type]) {
        clearTimeout(buttonTooltipTimers[type])
      }
      setButtonTooltips(prev => ({ ...prev, [type]: false }))
      setButtonTooltipTimers(prev => ({ ...prev, [type]: null }))
    }
  }

  // Scroll detection for jump to exercise button
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
        const isScrolledUp = scrollTop < scrollHeight - clientHeight - 200
        setJumpToExerciseVisible(isScrolledUp)
      }
    }

    const container = chatContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Manage typing queue
  useEffect(() => {
    const activeExercise = exercises.find(ex => ex.status === 'active')
    if (!activeExercise) return

    const messageNeedingTyping = activeExercise.messages.find(msg => 
      msg.type === 'system' && !msg.hasBeenTyped && !msg.isCurrentlyTyping
    )

    const isAnyMessageTyping = activeExercise.messages.some(msg => msg.isCurrentlyTyping)

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

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // Jump to latest exercise
  const jumpToLatestExercise = () => {
    const activeExercise = exercises.find(ex => ex.status === 'active')
    if (activeExercise && inputRefs.current[activeExercise.id]) {
      inputRefs.current[activeExercise.id]?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  // Handle sending student response
  const handleSendMessage = async (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId)
    if (!exercise || !exercise.currentInput?.trim() || exercise.isLoading) return

    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, isLoading: true } : ex
    ))
    
    const studentMessage: ChatMessage = {
      id: `student-${Date.now()}`,
      type: 'student',
      content: exercise.currentInput,
      timestamp: new Date(),
      exerciseId: exerciseId
    }

    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, messages: [...ex.messages, studentMessage], currentInput: '' }
        : ex
    ))

    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, isTyping: true } : ex
    ))
    
    setTimeout(scrollToBottom, 100)

    setTimeout(() => {
      setExercises(prev => {
        const updatedExercises = prev.map(ex => 
          ex.id === exerciseId ? { ...ex, isTyping: false } : ex
        )
        
        const currentExercise = updatedExercises.find(ex => ex.id === exerciseId)
        if (!currentExercise) return updatedExercises
        
        const hasSubExercise = currentExercise.messages.some(msg => msg.isSubExercise)
        const studentMessageCount = currentExercise.messages.filter(msg => msg.type === 'student').length
        
        let responseContent = ''
        let shouldCreateSubExercise = false
        let isCompleted = false
        
        if (studentMessageCount === 1 && !hasSubExercise) {
          responseContent = mockFeedbackResponses[0].content
          shouldCreateSubExercise = true
        } else if (hasSubExercise && studentMessageCount === 2) {
          responseContent = mockFeedbackResponses[3].content
        } else if (studentMessageCount >= 3) {
          responseContent = mockFeedbackResponses[4].content
          isCompleted = true
        } else {
          responseContent = "I can see you're working on this problem. Let me help guide you through the correct approach to solving two-step linear equations."
        }
        
        const highlights = parseHighlights(responseContent)
        const cleanedContent = responseContent
          .replace(/\[\[vague:(.*?)\]\]/g, '$1')
          .replace(/\[\[incorrect:(.*?)\]\]/g, '$1')
        
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          type: 'system',
          content: cleanedContent,
          timestamp: new Date(),
          exerciseId: exerciseId,
          hasBeenTyped: false,
          isCurrentlyTyping: false
        }

        const finalExercises = updatedExercises.map(ex => {
          if (ex.id === exerciseId) {
            const updatedMessages = [...ex.messages]
            
            if (highlights.length > 0) {
              const lastStudentMessageIndex = updatedMessages
                .map((msg, idx) => ({ msg, idx }))
                .filter(({ msg }) => msg.type === 'student')
                .pop()?.idx
                
              if (lastStudentMessageIndex !== undefined) {
                updatedMessages[lastStudentMessageIndex] = {
                  ...updatedMessages[lastStudentMessageIndex],
                  highlights: highlights
                }
              }
            }
            
            updatedMessages.push(aiMessage)
            return { ...ex, messages: updatedMessages, isLoading: false }
          }
          return ex
        })

        const detectedTerms = vocabularyTerms
          .filter(vocab => cleanedContent.includes(vocab.term))
          .map(vocab => vocab.term)
        
        if (detectedTerms.length > 0) {
          setNewTerms(prev => [...prev, ...detectedTerms])
        }

        setTimeout(scrollToBottom, 100)

        if (shouldCreateSubExercise) {
          if (!subExerciseCreationInProgress.current.has(exerciseId)) {
            subExerciseCreationInProgress.current.add(exerciseId)
            setTimeout(() => createSubExercise(exerciseId), 2000)
          }
        }
        
        if (isCompleted && cleanedContent.includes('<EXERCISE_COMPLETE>')) {
          setTimeout(() => {
            setExercises(prev => prev.map(ex => 
              ex.id === exerciseId ? { ...ex, status: 'completed' } : ex
            ))
            
            setTimeout(() => createAdvancedExercise(), 2000)
          }, 3000)
        }
        
        return finalExercises
      })
    }, 2000)
  }

  // Create sub-exercise
  const createSubExercise = (exerciseId: string) => {
    if (!subExerciseCreationInProgress.current.has(exerciseId)) return
    
    const currentExercise = exercises.find(ex => ex.id === exerciseId)
    if (!currentExercise) {
      subExerciseCreationInProgress.current.delete(exerciseId)
      return
    }
    
    const hasRemediation = currentExercise.messages.some(msg => 
      msg.content.includes('I see your logic in Step 2')
    )
    
    if (hasRemediation) {
      subExerciseCreationInProgress.current.delete(exerciseId)
      return
    }

    const remediationMessage: ChatMessage = {
      id: `remediation-${Date.now()}-${Math.random()}`,
      type: 'system',
      content: mockFeedbackResponses[1].content,
      timestamp: new Date(),
      exerciseId: exerciseId,
      isSubExercise: true,
      subExerciseLevel: 1,
      hasBeenTyped: false,
      isCurrentlyTyping: false
    }

    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, messages: [...ex.messages, remediationMessage] }
        : ex
    ))

    setTimeout(() => {
      setExercises(prev => {
        const currentEx = prev.find(ex => ex.id === exerciseId)
        if (!currentEx) return prev
        
        const hasSubExercise = currentEx.messages.some(msg => 
          msg.content.includes('Sub-Exercise: Let\'s practice')
        )
        
        if (hasSubExercise) return prev
        
        const subExerciseMessage: ChatMessage = {
          id: `sub-${Date.now()}-${Math.random()}`,
          type: 'system',
          content: mockFeedbackResponses[2].content,
          timestamp: new Date(),
          exerciseId: exerciseId,
          isSubExercise: true,
          subExerciseLevel: 1,
          hasBeenTyped: false,
          isCurrentlyTyping: false
        }

        const updatedExercises = prev.map(ex => 
          ex.id === exerciseId 
            ? { ...ex, messages: [...ex.messages, subExerciseMessage] }
            : ex
        )

        const detectedTerms = vocabularyTerms
          .filter(vocab => subExerciseMessage.content.includes(vocab.term))
          .map(vocab => vocab.term)
        
        if (detectedTerms.length > 0) {
          setNewTerms(prev => [...prev, ...detectedTerms])
        }

        setTimeout(scrollToBottom, 100)
        return updatedExercises
      })
      
      subExerciseCreationInProgress.current.delete(exerciseId)
    }, 2000)

    setTimeout(scrollToBottom, 100)
  }

  // Toggle exercise expansion
  const toggleExerciseExpansion = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, isExpanded: !ex.isExpanded } : ex
    ))
  }

  // Create advanced exercise
  const createAdvancedExercise = () => {
    const exerciseId = `exercise-${Date.now()}`
    const advancedExercise: Exercise = {
      id: exerciseId,
      title: 'Advanced Two-Step Equations',
      status: 'active',
      currentInput: '',
      isLoading: false,
      isTyping: false,
      isExpanded: true,
      messages: [
        {
          id: 'adv-msg-1',
          type: 'system',
          content: 'Great work on the basic exercise! Now let\'s try a more complex problem.',
          timestamp: new Date(),
          exerciseId: exerciseId,
          hasBeenTyped: false,
          isCurrentlyTyping: false
        },
        {
          id: 'adv-msg-2',
          type: 'system',
          content: 'Problem: You are ordering custom t-shirts for a club. The company charges a $40 setup fee for the design. Each shirt costs $8. You also have a coupon for $10 off your entire order. If your final bill is $110, how many shirts (s) did you order?\n\nAdded Complexity: This problem introduces a third number that must be correctly applied before solving. The student must realize that the coupon reduces the total cost before they start solving for the number of shirts, requiring them to combine the constants first (40 - 10).',
          timestamp: new Date(),
          exerciseId: exerciseId,
          hasBeenTyped: false,
          isCurrentlyTyping: false
        }
      ]
    }

    setExercises(prev => [...prev, advancedExercise])
    setTimeout(scrollToBottom, 100)
  }

  // Handle hint
  const handleHint = (exerciseId: string) => {
    const hintMessage: ChatMessage = {
      id: `hint-${Date.now()}`,
      type: 'system',
      content: 'Think about what we said earlier about the reverse order of operations. What comes first when you\'re "undoing" operations?',
      timestamp: new Date(),
      exerciseId: exerciseId,
      hasBeenTyped: false,
      isCurrentlyTyping: false
    }

    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, messages: [...ex.messages, hintMessage] }
        : ex
    ))

    setTimeout(scrollToBottom, 100)
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent, exerciseId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(exerciseId)
    }
  }

  // Handle input change
  const handleInputChange = (exerciseId: string, value: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, currentInput: value } : ex
    ))
  }

  return (
    <div className="w-full h-full" style={{ backgroundColor: '#2d3748' }}>
      {/* Jump to Exercise Button */}
      {jumpToExerciseVisible && (
        <div className="fixed bottom-4 right-4 z-20">
          <Button
            onClick={jumpToLatestExercise}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Jump to Exercise
          </Button>
        </div>
      )}

      {/* Vocabulary Drawer */}
      <VocabularyDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        newTerms={newTerms}
        onClearNewTerms={() => {
          setNewTerms([])
          setDrawerOpen(true)
        }}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Render all exercises */}
      {exercises.map((exercise, index) => (
        <div key={exercise.id} className={cn(
          "rounded-lg overflow-visible",
          index === 0 && "mt-8",
          index > 0 && "mt-4"
        )} style={{ backgroundColor: '#2d3748' }}>
                {/* Header */}
                <div 
                  className={cn(
                    "flex items-center justify-between p-6 cursor-pointer z-20",
                    "border-l-4",
                    exercise.isExpanded ? "rounded-t-lg sticky top-0" : "rounded-lg",
                    exercise.status === 'active' && "border-l-blue-500",
                    exercise.status === 'completed' && "border-l-green-500",
                    exercise.status === 'collapsed' && "border-l-green-500"
                  )}
                  style={{
                    backgroundColor: '#182e35',
                    transition: 'all 0.2s ease',
                    ...(exercise.isExpanded && {
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    })
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1f3440'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#182e35'
                  }}
                  onClick={() => toggleExerciseExpansion(exercise.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-xl font-semibold text-foreground">{exercise.title}</h2>
                    <div className="flex items-center gap-1">
                      {/* Vocabulary Terms Button */}
                      <div className="relative">
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDrawerOpen(true)
                          }}
                          onMouseEnter={() => handleButtonTooltip('vocab', true)}
                          onMouseLeave={() => handleButtonTooltip('vocab', false)}
                          className="flex items-center gap-4 px-3 py-2 rounded-lg bg-transparent hover:bg-accent border border-transparent hover:border-border transition-all duration-200 group"
                        >
                          <span className="text-base font-medium text-[#4FD1C5] group-hover:text-[#5FE1D5]">
                            {vocabularyCount}
                          </span>
                          <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-foreground ml-3" />
                        </Button>
                        {buttonTooltips.vocab && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-sm text-popover-foreground whitespace-nowrap" style={{ backgroundColor: '#5a6478', border: '1px solid #374151' }}>
                            Vocab
                          </div>
                        )}
                      </div>
                      
                      {/* Equations Button */}
                      <div className="relative">
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDrawerOpen(true)
                          }}
                          onMouseEnter={() => handleButtonTooltip('equations', true)}
                          onMouseLeave={() => handleButtonTooltip('equations', false)}
                          className="flex items-center gap-4 px-3 py-2 rounded-lg bg-transparent hover:bg-accent border border-transparent hover:border-border transition-all duration-200 group"
                        >
                          <span className="text-base font-medium text-[#805AD5] group-hover:text-[#9F7AEA]">
                            {equationCount}
                          </span>
                          <Sigma className="w-5 h-5 text-muted-foreground group-hover:text-foreground ml-3" />
                        </Button>
                        {buttonTooltips.equations && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-sm text-popover-foreground whitespace-nowrap" style={{ backgroundColor: '#5a6478', border: '1px solid #374151' }}>
                            Formulas
                          </div>
                        )}
                      </div>
                      
                      {/* Concepts Button */}
                      <div className="relative">
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDrawerOpen(true)
                          }}
                          onMouseEnter={() => handleButtonTooltip('concepts', true)}
                          onMouseLeave={() => handleButtonTooltip('concepts', false)}
                          className="flex items-center gap-4 px-3 py-2 rounded-lg bg-transparent hover:bg-accent border border-transparent hover:border-border transition-all duration-200 group"
                        >
                          <span className="text-base font-medium text-[#ED64A6] group-hover:text-[#F687B3]">
                            {conceptCount}
                          </span>
                          <Brain className="w-5 h-5 text-muted-foreground group-hover:text-foreground ml-3" />
                        </Button>
                        {buttonTooltips.concepts && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-sm text-popover-foreground whitespace-nowrap" style={{ backgroundColor: '#5a6478', border: '1px solid #374151' }}>
                            Concepts
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Chevron Icon */}
                  <div className="ml-4 p-2 rounded-full transition-colors duration-200" style={{ 
                    backgroundColor: 'transparent' 
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}>
                    {exercise.isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Content */}
                {exercise.isExpanded && (
                  <div>
                    {/* Collapsed Exercise Summary */}
                    {exercise.status === 'collapsed' && (
                      <div className="p-6 text-muted-foreground">
                        <p className="text-sm">
                          🎉 Exercise completed - You successfully mastered two-step linear equations!
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-primary hover:text-primary/90"
                          onClick={() => setExercises(prev => prev.map(ex => 
                            ex.id === exercise.id ? { ...ex, status: 'completed' } : ex
                          ))}
                        >
                          View Full Exercise
                        </Button>
                      </div>
                    )}

                    {/* Chat Container */}
                    {(exercise.status === 'active' || exercise.status === 'completed') && (
                      <div 
                        ref={exercise.status === 'active' ? chatContainerRef : null}
                        className="p-6 space-y-4 rounded-b-lg"
                        style={{ backgroundColor: '#1e2430' }}
                      >
                                                 {exercise.messages.map((message, index) => {
                           const isSubExercise = message.isSubExercise
                           const prevMessage = exercise.messages[index - 1]
                           const isPrevSubExercise = prevMessage?.isSubExercise
                          
                          const isFirstInSubExerciseSequence = isSubExercise && !isPrevSubExercise
                          
                          let consecutiveSubExercises = 0
                          if (isFirstInSubExerciseSequence) {
                            for (let i = index; i < exercise.messages.length && exercise.messages[i]?.isSubExercise; i++) {
                              const msg = exercise.messages[i]
                              if (msg.type === 'student' || msg.isCurrentlyTyping || msg.hasBeenTyped) {
                                consecutiveSubExercises++
                              }
                            }
                          }
                          
                          return (
                            <div key={message.id} className="space-y-2">
                              <div className={cn(
                                "flex relative",
                                message.type === 'student' ? "justify-end" : "justify-start"
                              )}>
                                {/* Threading line for sub-exercises */}
                                {isFirstInSubExerciseSequence && (
                                  <div 
                                    className="absolute left-2 w-0.5 bg-muted-foreground/30"
                                    style={{
                                      top: 0,
                                      height: consecutiveSubExercises === 1 
                                        ? '70%' 
                                        : `calc(${(consecutiveSubExercises - 0.4) * 100}% + ${(consecutiveSubExercises - 1) * 0.7}rem)`
                                    }}
                                  />
                                )}
                                
                                {/* Message content */}
                                {(message.type === 'student' || message.isCurrentlyTyping || message.hasBeenTyped) && (
                                                                  <div className={cn(
                                  "rounded-lg px-4 py-3 relative",
                                  message.type === 'student' 
                                    ? "text-primary-foreground ml-auto min-w-[60%] max-w-[85%]" 
                                    : "text-foreground max-w-[95%]",
                                  isSubExercise && "ml-6"
                                )}
                                style={message.type === 'student' ? { backgroundColor: '#2d3748' } : { backgroundColor: '#3a4a5c' }}>
                                    <div className={cn(
                                      "leading-relaxed",
                                      message.type === 'student' && "whitespace-pre-wrap"
                                    )}>
                                      {message.type === 'system' && message.isCurrentlyTyping ? (
                                        <TypingMessage
                                          content={message.content.trim()}
                                          speed={100}
                                          parseVocabulary={(text) => parseVocabularyTermsGeneric(text, (term) => {
                                            setNewTerms(prev => [...prev, term])
                                            setDrawerOpen(true)
                                          })}
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
                                      ) : message.type === 'system' ? (
                                        <FormattedMessage 
                                          content={message.content.trim()} 
                                          parseVocabulary={(text) => parseVocabularyTermsGeneric(text, (term) => {
                                            setNewTerms(prev => [...prev, term])
                                            setDrawerOpen(true)
                                          })} 
                                        />
                                      ) : (
                                        message.highlights && message.highlights.length > 0 ? (
                                          applyHighlightsToText(message.content, message.highlights)
                                        ) : (
                                          message.content
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}

                        {/* Typing Indicator */}
                        {exercise.isTyping && (
                          <div className="flex justify-start">
                            <div className="border border-border rounded-lg px-4 py-3" style={{ backgroundColor: '#3a4a5c' }}>
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
                                style={{
                                  backgroundColor: '#2d3748',
                                  color: '#e2e8f0',
                                  borderColor: '#4a5568'
                                }}
                              />
                              
                              {/* Hint Button */}
                              <div className="absolute top-2 right-2 z-10">
                                <Button
                                  onClick={() => handleHint(exercise.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground rounded-lg hover:!bg-yellow-500/20 hover:!text-yellow-400"
                                  onMouseEnter={() => {
                                    const timer = setTimeout(() => {
                                      setShowHintTooltip(true)
                                    }, 500)
                                    setHintTooltipTimer(timer)
                                  }}
                                  onMouseLeave={() => {
                                    if (hintTooltipTimer) {
                                      clearTimeout(hintTooltipTimer)
                                    }
                                    setShowHintTooltip(false)
                                  }}
                                >
                                  <Lightbulb className="w-4 h-4" />
                                </Button>
                                
                                {showHintTooltip && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 rounded text-sm text-popover-foreground whitespace-nowrap" style={{ backgroundColor: '#5a6478', border: '1px solid #374151' }}>
                                    Need help?
                                  </div>
                                )}
                              </div>
                              
                              {/* Send Button */}
                              <Button
                                onClick={() => handleSendMessage(exercise.id)}
                                disabled={exercise.isLoading || !exercise.currentInput?.trim()}
                                className="absolute right-2 bottom-2 h-8 w-12 p-0"
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
                    )}
                  </div>
                )}
            </div>
        ))}
    </div>
  )
} 