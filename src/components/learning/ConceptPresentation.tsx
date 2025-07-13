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

export function ConceptPresentation({ className }: ConceptPresentationProps) {
  // Mock data - in real implementation, this would come from API based on conceptId
  const conceptData = {
    title: "Solving Two-Step Linear Equations",
    subtitle: "e.g., $$2x + 5 = 15$$",
    hooks: {
      personal: `You have a $100 gift card and want to buy a new pair of jeans for $40. You also want to buy a few books that all cost the same price. You can use a two-step equation to figure out exactly how many books you can afford with the remaining balance.`,
      social: `You and your friends are planning a movie night. You spend $12 on snacks and drinks. Tickets cost $9 each. With a total budget set, you can use an equation to determine how many friends you can invite to stay within that budget.`,
      career: `As an event planner, you might have a client's total budget of $5000. If your fixed fee for planning is $500, and the cost per guest is $75, you would use a two-step equation to calculate the maximum number of guests the event can have.`,
      service: `You are organizing a fundraiser to build a community garden. The project requires $1000 for tools and lumber. Your goal is to raise $4000 total. If you raise money by getting $50 sponsorships for each garden bed, an equation tells you exactly how many sponsorships you need to secure.`
    },
    examples: [
      {
        interest: "Gaming Interest",
        scenario: `You want to buy some in-game items that cost $4 each. You also buy a one-time character skin for $7. Your total spending is $27. How many items (x) did you buy?`,
        equation: `$$4x + 7 = 27$$`
      },
      {
        interest: "Music Interest", 
        scenario: `You are saving for a $350 guitar. You already have $50 saved. If you save $25 per week (w), how many weeks will it take to afford the guitar?`,
        equation: `$$25w + 50 = 350$$`
      },
      {
        interest: "Sports Interest",
        scenario: `Your soccer team is raising money. They earned $100 from a car wash. They are also selling candy bars that make a $2 profit each (c). Their goal is to raise a total of $500. How many candy bars do they need to sell?`,
        equation: `$$2c + 100 = 500$$`
      }
    ],
    vocabulary: [
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
      title: "How to Solve $$2x + 5 = 15$$",
      steps: [
        {
          step: "Goal",
          description: "Get $$x$$ by itself."
        },
        {
          step: "Undo Addition/Subtraction",
          description: "The equation has \"$$+ 5$$\". Do the opposite by subtracting $$5$$ from both sides.",
          math: ["$$2x + 5 - 5 = 15 - 5$$", "$$2x = 10$$"]
        },
        {
          step: "Undo Multiplication/Division", 
          description: "The variable $$x$$ is multiplied by $$2$$. Do the opposite by dividing both sides by $$2$$.",
          math: ["$$\\frac{2x}{2} = \\frac{10}{2}$$"]
        },
        {
          step: "Solve",
          description: "",
          math: ["$$x = 5$$"]
        }
      ]
    }
  }

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
                <h3 className="text-lg font-semibold tracking-wide" style={{ color: '#805AD5' }}>Personal</h3>
                <p className="text-foreground leading-relaxed pl-4">{conceptData.hooks.personal}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-wide" style={{ color: '#facc15' }}>Social</h3>
                <p className="text-foreground leading-relaxed pl-4">{conceptData.hooks.social}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-wide" style={{ color: '#22d3ee' }}>Career</h3>
                <p className="text-foreground leading-relaxed pl-4">{conceptData.hooks.career}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold tracking-wide" style={{ color: '#E53E3E' }}>Service (Philanthropic)</h3>
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

          {/* Section 3: What & How */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">What & How</h2>
              <p className="text-muted-foreground font-bold">The building blocks</p>
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
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
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
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 