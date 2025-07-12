import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  Brain,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  Target,
  MessageSquare,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Send,
  PlusCircle,
  Zap,
} from 'lucide-react';
import { exerciseService } from '../../services/exercise.service';
import type { ExerciseGenerationResponse, ExerciseEvaluationResponse } from '../../services/exercise.service';
import { cn } from '../../utils/cn';

interface ChatBasedExerciseProps {
  conceptId: string;
  conceptName: string;
  conceptDescription?: string;
  studentProfile: {
    interests: string[];
    careerInterests: string[];
    philanthropicInterests: string[];
  };
  onComplete?: () => void;
}

type ExerciseStage = 'initial' | 'advanced' | 'complete';
type ExerciseStatus = 'ready' | 'loading' | 'answering' | 'evaluating' | 'remediation' | 'thinking';

interface ChatMessage {
  id: string;
  type: 'system' | 'student' | 'assistant' | 'thinking' | 'step' | 'evaluation' | 'hint';
  content: string;
  timestamp: Date;
  isTemporary?: boolean;
}

const lifeCategoryColors = {
  personal: 'bg-personal/10 border-personal/30 text-personal',
  social: 'bg-social/10 border-social/30 text-social',
  career: 'bg-career/10 border-career/30 text-career',
  philanthropic: 'bg-philanthropic/10 border-philanthropic/30 text-philanthropic',
};

export const ChatBasedExercise: React.FC<ChatBasedExerciseProps> = ({
  conceptId,
  conceptName,
  conceptDescription,
  studentProfile,
  onComplete,
}: ChatBasedExerciseProps) => {
  const [stage, setStage] = useState<ExerciseStage>('initial');
  const [status, setStatus] = useState<ExerciseStatus>('ready');
  const [currentExercise, setCurrentExercise] = useState<ExerciseGenerationResponse | null>(null);
  const [evaluation, setEvaluation] = useState<ExerciseEvaluationResponse | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [remediationAttempts, setRemediationAttempts] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setChatMessages((prev: ChatMessage[]) => [...prev, {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    }]);
  };

  const simulateThinking = async (content: string) => {
    const thinkingId = `thinking-${Date.now()}`;
    
    // Add thinking message
    setChatMessages(prev => [...prev, {
      id: thinkingId,
      type: 'thinking',
      content: 'Thinking...',
      timestamp: new Date(),
      isTemporary: true,
    }]);

    // Simulate progressive thinking steps
    const thinkingSteps = [
      'Analyzing your response...',
      'Checking conceptual understanding...',
      'Evaluating problem-solving approach...',
      'Generating personalized feedback...',
    ];

    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setChatMessages(prev => prev.map(msg => 
        msg.id === thinkingId 
          ? { ...msg, content: thinkingSteps[i] }
          : msg
      ));
    }

    // Remove thinking message and add actual content
    setChatMessages(prev => [
      ...prev.filter(msg => msg.id !== thinkingId),
      {
        id: `response-${Date.now()}`,
        type: 'assistant',
        content,
        timestamp: new Date(),
      }
    ]);
  };

  const generateExercise = async (exerciseType: 'initial' | 'advanced') => {
    setStatus('loading');
    try {
      const exercise = await exerciseService.generateExercise({
        conceptId,
        conceptName,
        conceptDescription,
        studentProfile,
        exerciseType,
      });
      
      setCurrentExercise(exercise);
      setStatus('answering');
      setCurrentInput('');
      setEvaluation(null);
      setHintsUsed(0);

      // Add exercise as first chat message
      const exerciseMessage = `**${exerciseType === 'initial' ? 'Initial' : 'Advanced'} Exercise**

${exercise.prompt}

*This exercise connects to your interests in ${exercise.personalizationContext.selectedInterest}*

Take your time to think through this step-by-step. You can submit individual steps to build your answer, get hints if you need guidance, or submit your complete answer when ready.`;

      addMessage({
        type: 'system',
        content: exerciseMessage,
      });

    } catch (error) {
      console.error('Failed to generate exercise:', error);
      setStatus('ready');
      addMessage({
        type: 'system',
        content: 'Sorry, I encountered an error generating the exercise. Please try again.',
      });
    }
  };

  const submitStep = () => {
    if (!currentInput.trim()) return;

    // Add student's step to chat
    addMessage({
      type: 'step',
      content: currentInput,
    });

    // Check if it's a request for help
    const helpKeywords = ['help', 'hint', 'stuck', 'confused', '?', 'how do', 'what should'];
    const isHelpRequest = helpKeywords.some(keyword => 
      currentInput.toLowerCase().includes(keyword)
    );

    if (isHelpRequest) {
      getHint();
    } else {
      // Acknowledge the step
      addMessage({
        type: 'assistant',
        content: 'Good step! Keep building your solution. You can continue adding steps, get a hint, or submit your complete answer when ready.',
      });
    }

    setCurrentInput('');
  };

  const getHint = async () => {
    if (!currentExercise) return;

    setStatus('thinking');
    
    try {
      // Get chat context for more targeted hints
      const chatContext = chatMessages
        .filter(msg => msg.type === 'student' || msg.type === 'step')
        .map(msg => msg.content);

      const hintResponse = await exerciseService.getHint(
        currentExercise.exerciseId,
        hintsUsed,
        chatContext
      );

      setHintsUsed((prev: number) => prev + 1);

      await simulateThinking(`💡 **Hint ${hintsUsed + 1}**

${hintResponse.hint}

Try applying this guidance to move forward with your solution.`);
      
      setStatus('answering');
    } catch (error) {
      console.error('Failed to get hint:', error);
      
      // Fallback to exercise hints
      const hintIndex = Math.min(hintsUsed, (currentExercise.expectedSteps || []).length - 1);
      const hint = currentExercise.expectedSteps?.[hintIndex] || "Think about breaking the problem into smaller parts.";

      setHintsUsed((prev: number) => prev + 1);

      await simulateThinking(`💡 **Hint ${hintsUsed + 1}**

${hint}

Try applying this guidance to move forward with your solution.`);
      
      setStatus('answering');
    }
  };

  const submitAnswer = async () => {
    if (!currentExercise || !currentInput.trim()) return;

    // Add student's complete answer to chat
    addMessage({
      type: 'student',
      content: currentInput,
    });

    setStatus('evaluating');
    setCurrentInput('');

    try {
      const result = await exerciseService.evaluateExercise({
        exerciseId: currentExercise.exerciseId,
        studentResponse: currentInput,
        expectedSteps: currentExercise.expectedSteps,
      });

      setEvaluation(result);
      setCompletedSteps([...completedSteps, ...result.identifiedSteps]);

      // Create evaluation message with thinking simulation
      const evaluationContent = `**Assessment Complete**

**What you did well:**
${result.feedback}

**Understanding Score:** ${Math.round(result.competencyScore * 100)}%
**Steps Identified:** ${result.stepsCorrect} of ${result.stepsTotal}

${result.missingSteps.length > 0 ? `**Areas to strengthen:**
${result.missingSteps.map(step => `• ${step}`).join('\n')}` : ''}

${result.remediationNeeded 
  ? "Let's work together to strengthen your understanding with some targeted practice."
  : result.competencyScore >= 0.8 && stage === 'initial'
    ? "Excellent work! You're ready for the advanced challenge."
    : "Outstanding! You've mastered this concept."
}`;

      await simulateThinking(evaluationContent);

      // Determine next steps
      if (result.remediationNeeded && remediationAttempts < 3) {
        setStatus('remediation');
        startRemediationChat();
      } else if (result.competencyScore >= 0.8) {
        if (stage === 'initial') {
          setTimeout(() => {
            setStage('advanced');
            setStatus('ready');
            addMessage({
              type: 'system',
              content: '🎉 Ready for the advanced challenge? Click below to continue!',
            });
          }, 2000);
        } else {
          setStage('complete');
          onComplete?.();
        }
      } else {
        setStatus('answering');
        addMessage({
          type: 'assistant',
          content: 'Feel free to try again or ask for hints to improve your approach.',
        });
      }
    } catch (error) {
      console.error('Failed to evaluate response:', error);
      setStatus('answering');
      addMessage({
        type: 'system',
        content: 'Sorry, I encountered an error evaluating your response. Please try again.',
      });
    }
  };

  const startRemediationChat = async () => {
    if (!evaluation?.remediationFocus) return;

    setRemediationAttempts(prev => prev + 1);

    try {
      const remediationExercise = await exerciseService.generateRemediation(
        conceptId,
        evaluation.remediationFocus,
        studentProfile
      );

      const remediationContent = `Let's work on **${evaluation.remediationFocus}** together.

${remediationExercise.prompt}

I'll guide you through this step by step. Take it slow and think out loud - share your thought process as we work through this together.`;

      await simulateThinking(remediationContent);
      
      setStatus('answering');
    } catch (error) {
      console.error('Failed to generate remediation:', error);
      addMessage({
        type: 'system',
        content: 'Let me help you with this concept in a different way. What specific part would you like to explore together?',
      });
      setStatus('answering');
    }
  };

  const renderChatMessage = (message: ChatMessage) => {
    const isSystem = message.type === 'system';
    const isStudent = message.type === 'student' || message.type === 'step';
    const isThinking = message.type === 'thinking';

    return (
      <div
        key={message.id}
        className={cn(
          'mb-4 flex',
          isStudent ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'max-w-[80%] px-4 py-3 rounded-lg',
            isSystem && 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
            isStudent && 'bg-teal-500 text-white',
            !isSystem && !isStudent && 'bg-gray-100 dark:bg-gray-800',
            isThinking && 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 italic',
            message.type === 'step' && 'bg-teal-400 text-white'
          )}
        >
          {message.type === 'step' && (
            <div className="text-xs uppercase tracking-wide mb-1 opacity-80">
              Step Added
            </div>
          )}
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
          {isThinking && (
            <div className="flex items-center mt-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-2" />
              <span className="text-xs">Processing...</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChatInterface = () => (
    <div className="flex flex-col h-[600px]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Start Exercise" below to begin your learning journey!</p>
          </div>
        ) : (
          chatMessages.map(renderChatMessage)
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {status === 'answering' && (
        <div className="border-t p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col space-y-3">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response, ask a question, or work through the problem step by step..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  // Allow new line with Shift+Enter
                  return;
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  submitStep();
                }
              }}
            />
            
            {/* Three Button System */}
            <div className="flex justify-between items-center">
              {/* Get Hint - Bottom Left */}
              <Button
                variant="outline"
                size="sm"
                onClick={getHint}
                className="flex items-center gap-2"
                disabled={!currentExercise}
              >
                <Lightbulb className="h-4 w-4" />
                Get Hint
              </Button>

              {/* Submit Step and Submit Answer - Bottom Right */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={submitStep}
                  disabled={!currentInput.trim()}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Submit Step
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={submitAnswer}
                  disabled={!currentInput.trim()}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Answer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderExerciseHeader = () => {
    const stageInfo = {
      initial: {
        icon: Brain,
        title: 'Initial Exercise',
        description: 'Test your understanding of the core concept',
        color: 'text-teal-600',
      },
      advanced: {
        icon: TrendingUp,
        title: 'Advanced Exercise',
        description: 'Apply your knowledge to complex scenarios',
        color: 'text-purple-600',
      },
      complete: {
        icon: CheckCircle,
        title: 'Exercise Complete!',
        description: 'You\'ve mastered this concept',
        color: 'text-green-600',
      },
    };

    const info = stageInfo[stage];
    const Icon = info.icon;

    return (
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-800', info.color)}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100">
              {info.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {info.description}
            </p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-3 h-3 rounded-full',
            stage !== 'initial' ? 'bg-green-500' : 'bg-gray-300'
          )} />
          <div className="w-8 h-0.5 bg-gray-300" />
          <div className={cn(
            'w-3 h-3 rounded-full',
            stage === 'complete' ? 'bg-green-500' : 'bg-gray-300'
          )} />
        </div>
      </div>
    );
  };

  const renderCompleteState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-obsidian dark:text-gray-100 mb-3">
        Well Done! You've mastered this concept! 🎉
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        You've successfully completed both initial and advanced exercises for {conceptName}.
        Your understanding is solid!
      </p>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-600">{completedSteps.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Steps Mastered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{hintsUsed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Hints Used</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">100%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mastery</div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => {
            // Reset for revisit
            setStage('initial');
            setStatus('ready');
            setChatMessages([]);
            setCurrentExercise(null);
            setEvaluation(null);
            setCompletedSteps([]);
            setHintsUsed(0);
            setRemediationAttempts(0);
          }}
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Revisit This Concept Later
        </Button>
        <Button variant="primary" size="lg" onClick={onComplete}>
          Continue Learning
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="max-w-4xl mx-auto">
      {renderExerciseHeader()}
      
      {stage === 'complete' ? (
        renderCompleteState()
      ) : (
        <div className="space-y-6">
          {/* Exercise Status Bar */}
          {currentExercise && (
            <div className={cn(
              'p-4 rounded-lg border',
              lifeCategoryColors[currentExercise.lifeCategory as keyof typeof lifeCategoryColors] || 'bg-gray-50'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {currentExercise.lifeCategory} Context
                </span>
                <Badge variant="default" size="sm">
                  {currentExercise.personalizationContext.selectedInterest}
                </Badge>
              </div>
              <p className="text-sm opacity-90">
                This exercise connects to your interests in {currentExercise.personalizationContext.selectedInterest}
              </p>
            </div>
          )}

          {/* Chat Interface */}
          <Card>
            {renderChatInterface()}
          </Card>

          {/* Start Exercise Button */}
          {!currentExercise && status === 'ready' && (
            <div className="text-center py-12">
              <Button
                variant="primary"
                size="lg"
                onClick={() => generateExercise(stage === 'initial' ? 'initial' : 'advanced')}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Generating Exercise...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Start {stage === 'initial' ? 'Initial' : 'Advanced'} Exercise
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Continue to Advanced Button */}
          {evaluation && !evaluation.remediationNeeded && stage === 'initial' && status === 'ready' && (
            <div className="text-center py-6">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setStage('advanced');
                  generateExercise('advanced');
                }}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Continue to Advanced Exercise
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 