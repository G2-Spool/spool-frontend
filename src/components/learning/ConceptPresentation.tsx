/**
 * ConceptPresentation Component
 * 
 * Displays comprehensive educational content for a specific concept including:
 * - Hook & Relevance section with real-world applications
 * - Show Me Examples section with interest-based scenarios
 * - What & How section with vocabulary, mental models, principles, and workflow
 * - Interactive exercise interface
 * 
 * Features:
 * - Structured educational content presentation
 * - Real-world relevance examples
 * - Interactive learning components
 * - Vocabulary definitions and mental models
 * - Step-by-step workflow instructions
 */

import { cn } from '@/utils/cn'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { useExerciseContent, useThreadConceptContent } from '../../hooks/useExerciseContent'

// Add custom styles for inline math
if (typeof document !== 'undefined') {
  const mathStyles = `
    .katex {
      background-color: #4a5568;
      padding: 4px 6px;
      border-radius: 4px;
      font-size: 1.05em;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    
    .katex-display .katex {
      background-color: #4a5568;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 1.1em;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      margin: 8px 0;
    }
    
    .dark .katex {
      background-color: #4a5568;
    }
    
    .dark .katex-display .katex {
      background-color: #4a5568;
    }
  `
  
  if (!document.head.querySelector('style[data-math-styles]')) {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = mathStyles
    styleSheet.setAttribute('data-math-styles', 'true')
    document.head.appendChild(styleSheet)
  }
}

interface ConceptPresentationProps {
  conceptId: string
  conceptTitle?: string
  topicId?: string
  className?: string
}

// Enhanced LaTeX text processor - only formats double dollar sign LaTeX expressions
const processLatexInText = (content: string): React.ReactNode => {
  // Check if content contains double dollar LaTeX patterns only
  const hasDoubleDollarLatex = /\$\$[\s\S]*?\$\$/.test(content)
  
  if (hasDoubleDollarLatex) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-0">{children}</p>,
          code: (props: { inline?: boolean; children?: React.ReactNode }) => {
            const { inline, children } = props
            if (inline) {
              return <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono text-sm">{children}</code>
            }
            return (
              <pre className="bg-gray-200 dark:bg-gray-700 rounded p-2 overflow-x-auto my-2">
                <code className="font-mono text-sm">{children}</code>
              </pre>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }
  
  // For regular text (including single $ currency symbols), return as plain text
  return <span>{content}</span>
}

// Enhanced equation renderer - only for standalone equations
const EnhancedEquationRenderer: React.FC<{
  content: string
  className?: string
}> = ({ content, className }) => {
  // Only apply enhanced styling to standalone equations (block equations)
  const isBlockEquation = /^\s*\$\$[\s\S]*?\$\$\s*$/.test(content.trim())
  
  if (isBlockEquation) {
    return (
      <div 
        className={cn("rounded-lg p-2 my-2", className)}
        style={{ backgroundColor: '#4a5568' }}
      >
        {/* Pulsing dot code saved but commented out */}
        {/* <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-pulse"></div> */}
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p className="mb-0 text-center font-mono">{children}</p>
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }
  
  // For everything else, use regular LaTeX processing
  return (
    <div className={className}>
      {processLatexInText(content)}
    </div>
  )
}

export function ConceptPresentation({ conceptId, className }: ConceptPresentationProps) {
  // Fetch exercise content from database
  const { data: exerciseData, isLoading, error } = useExerciseContent(conceptId);
  
  // Fetch all concepts for the thread to get all 4 hook titles
  const threadId = 'd6046803-eece-42ba-9cbb-ab2eebd9c683'; // hardcoded thread_id as requested
  const { data: allConcepts } = useThreadConceptContent(threadId);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="rounded-lg" style={{ backgroundColor: '#2d3748' }}>
          <div className="space-y-12 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-600 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-600 rounded w-2/3 mb-8"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-600 rounded"></div>
                <div className="h-32 bg-gray-600 rounded"></div>
                <div className="h-32 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cn("w-full", className)}>
        <div className="rounded-lg" style={{ backgroundColor: '#2d3748' }}>
          <div className="space-y-12 p-8">
            <div className="text-center text-red-400">
              <p>Unable to load exercise content. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show fallback content if no data found
  if (!exerciseData) {
    return (
      <div className={cn("w-full", className)}>
        <div className="rounded-lg" style={{ backgroundColor: '#2d3748' }}>
          <div className="space-y-12 p-8">
            <div className="text-center text-yellow-400">
              <p className="text-lg font-semibold mb-2">No Content Available</p>
              <p className="text-sm text-gray-400">
                No exercise content found for section ID: <code className="bg-gray-700 px-2 py-1 rounded">{conceptId}</code>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Please ensure the section exists in your database with matching id.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform database data to match the component's expected structure
  const conceptData = {
    title: exerciseData?.concept_name || "Concept",
    subtitle: "", // Not directly mapped from database
    hooks: {
      personal: exerciseData?.hook_content || "",
      social: exerciseData?.hook_content || "",
      career: exerciseData?.hook_content || "",
      service: exerciseData?.hook_content || ""
    },
    examples: [
      {
        interest: exerciseData?.example_title || "Example",
        scenario: exerciseData?.example_scenario || "",
        equation: exerciseData?.example_visual || ""
      }
    ],
    vocabulary: [
      // Keep existing vocabulary for now - could be extended to pull from database
      {
        term: "Variable",
        definition: "The letter representing the unknown value you're looking for (like $$x$$)."
      },
      {
        term: "Coefficient", 
        definition: "The number attached to the variable (the $$2$$ in $$2x$$)."
      },
      {
        term: "Constant",
        definition: "A number without a variable (the $$5$$ and $$15$$ in $$2x + 5 = 15$$)."
      }
    ],
    mentalModel: {
      title: "The \"Reverse Order of Operations\"",
      description: "Think about getting dressed: you put on socks first, then shoes. To undo it, you take off your shoes first, then your socks.",
      explanation: "In math, we follow PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction). To solve for an unknown, you undo the operations in the reverse order: first, undo any addition or subtraction, then undo any multiplication or division."
    },
    principle: {
      title: "Keep the Equation Balanced",
      description: "An equation is like a balanced scale. Whatever you do to one side of the equals sign ($$=$$), you must do to the other side to keep it balanced."
    },
    workflow: {
      title: exerciseData?.approach_title || "Approach",
      steps: (exerciseData?.approach_steps || []).map((step, index) => ({
        step: `Step ${index + 1}`,
        description: step,
        math: [] // Formula would be added separately if needed
      }))
    }
  }

  // Keep formula separate - don't add to steps

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-lg" style={{ backgroundColor: '#2d3748' }}>
        <div className="space-y-12 p-8">
          {/* Section 1: Hook & Relevance */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Hook & Relevance</h2>
              <p className="text-muted-foreground font-bold">Where will you ever use this?</p>
              <div className="w-full h-px bg-border"></div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-wide" style={{ color: '#805AD5' }}>
                  {allConcepts?.[0]?.hook_title || exerciseData?.hook_title || "Personal"}
                </h3>
                <p className="text-foreground leading-relaxed pl-4">{conceptData.hooks.personal}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-wide" style={{ color: '#facc15' }}>
                  {allConcepts?.[1]?.hook_title || "Social"}
                </h3>
                <p className="text-foreground leading-relaxed pl-4">{conceptData.hooks.social}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-wide" style={{ color: '#22d3ee' }}>
                  {allConcepts?.[2]?.hook_title || "Career"}
                </h3>
                <p className="text-foreground leading-relaxed pl-4">{conceptData.hooks.career}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-wide" style={{ color: '#E53E3E' }}>
                  {allConcepts?.[3]?.hook_title || "Service (Philanthropic)"}
                </h3>
                <p className="text-foreground leading-relaxed pl-4">{conceptData.hooks.service}</p>
              </div>
            </div>
          </section>

          {/* Section Separator */}
          <div className="w-full h-px bg-border opacity-50"></div>

          {/* Section 2: Show Me Examples */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Show Me Examples</h2>
              <p className="text-muted-foreground font-bold">See it in action</p>
              <div className="w-full h-px bg-border"></div>
            </div>

            <div className="space-y-8">
              {conceptData.examples.map((example, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-bold text-primary">{example.interest}</h3>
                  <p className="text-foreground leading-relaxed pl-4">{example.scenario}</p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-muted-foreground mb-2">Equation:</p>
                    <EnhancedEquationRenderer 
                      content={example.equation} 
                      className="text-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section Separator */}
          <div className="w-full h-px bg-border opacity-50"></div>

          {/* Section 3: Academic Approach */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Academic Approach</h2>
              <p className="text-muted-foreground font-bold">The structured methodology</p>
              <div className="w-full h-px bg-border"></div>
            </div>

            <div className="space-y-8">
              {/* Vocabulary */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Vocabulary</h3>
                <div className="space-y-6 pl-6">
                  {conceptData.vocabulary.map((item, index) => (
                    <div key={index} className="space-y-1" id={`definition-${item.term}`}>
                      <h4 className="font-extrabold text-foreground">{item.term}:</h4>
                      <div className="pl-4">
                        <div className="text-foreground leading-relaxed">
                          {processLatexInText(item.definition)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtle separator */}
              <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

              {/* Mental Model */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Mental Model: {conceptData.mentalModel.title}</h3>
                <div className="space-y-3 pl-4">
                  <div className="text-foreground leading-relaxed">
                    {processLatexInText(conceptData.mentalModel.description)}
                  </div>
                  <div className="text-foreground leading-relaxed">
                    {processLatexInText(conceptData.mentalModel.explanation)}
                  </div>
                </div>
              </div>

              {/* Subtle separator */}
              <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

              {/* Principle */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Principle: {conceptData.principle.title}</h3>
                <div className="pl-4">
                  <div className="text-foreground leading-relaxed">
                    {processLatexInText(conceptData.principle.description)}
                  </div>
                </div>
              </div>

              {/* Subtle separator */}
              <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

              {/* Workflow */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Workflow: <span className="inline">{processLatexInText(conceptData.workflow.title)}</span>
                  </h3>
                </div>
                <div className="space-y-6">
                  {conceptData.workflow.steps.map((step, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <div className="space-y-2">
                          <h4 className="font-bold text-foreground">{step.step}:</h4>
                          {step.description && (
                            <div className="pl-4">
                              <div className="text-foreground leading-relaxed">
                                {processLatexInText(step.description)}
                              </div>
                            </div>
                          )}
                          {step.math && (
                            <div className="space-y-1">
                              {step.math.map((equation, mathIndex) => (
                                <EnhancedEquationRenderer 
                                  key={mathIndex} 
                                  content={equation} 
                                  className="text-foreground"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Formula section - displayed separately without step number */}
                  {exerciseData?.approach_formula && (
                    <div className="mt-6 p-4 bg-teal-900/20 border border-teal-500/30 rounded-lg">
                      <h4 className="font-bold text-teal-400 mb-2">Formula:</h4>
                      <div className="text-foreground leading-relaxed">
                        <EnhancedEquationRenderer 
                          content="$$\text{Optimal Decision} = \max\left(\sum(\text{Probability} \times \text{Outcome Value})\right)$$"
                          className="text-foreground"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section Separator */}
          <div className="w-full h-px bg-border opacity-50"></div>

          {/* Section 4: Non-Example (What NOT to Do) */}
          {exerciseData?.nonexample_scenario && (
            <section className="space-y-6">
                              <div className="space-y-2">
                  <h2 className="text-xl font-bold text-foreground">
                    {exerciseData?.nonexample_title || "What NOT to Do"}
                  </h2>
                  <p className="text-muted-foreground font-bold">Common mistakes to avoid</p>
                  <div className="w-full h-px bg-border"></div>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-400 mb-3">Scenario:</h3>
                    <p className="text-foreground leading-relaxed mb-4">
                      {exerciseData?.nonexample_scenario}
                    </p>
                    
                    <h3 className="text-lg font-semibold text-red-400 mb-3">Why This Fails:</h3>
                    <p className="text-foreground leading-relaxed">
                      {exerciseData?.nonexample_explanation}
                    </p>
                  </div>
                </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
} 