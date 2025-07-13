import React, { useState } from 'react';
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
  RotateCcw,
  Sparkles,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { exerciseService, ExerciseGenerationResponse, ExerciseEvaluationResponse } from '../../services/exercise.service';
import { cn } from '../../utils/cn';
import { ConceptPresentation } from '../learning/ConceptPresentation';

interface TwoStageExerciseProps {
  conceptId: string;
  conceptName: string;
  conceptDescription?: string;
  relevanceScore: number;
  estimatedMinutes?: number;
  difficulty?: string;
  studentProfile: {
    interests: string[];
    careerInterests: string[];
    philanthropicInterests: string[];
  };
  onComplete?: () => void;
}

type ExerciseStage = 'initial' | 'advanced' | 'complete';
type ExerciseStatus = 'ready' | 'loading' | 'answering' | 'remediation' | 'evaluating';

const lifeCategoryColors = {
  personal: 'bg-personal/10 border-personal/30 text-personal',
  social: 'bg-social/10 border-social/30 text-social',
  career: 'bg-career/10 border-career/30 text-career',
  philanthropic: 'bg-philanthropic/10 border-philanthropic/30 text-philanthropic',
};

// Helper functions for styling
const getRelevanceColor = (score: number) => {
  const percentage = Math.round(score * 100);
  if (percentage < 30) {
    return 'text-red-600 dark:text-red-400';
  } else if (percentage <= 70) {
    return 'text-yellow-600 dark:text-yellow-400';
  } else {
    return 'text-green-600 dark:text-green-400';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    case 'intermediate':
      return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    case 'advanced':
      return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    default:
      return 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
  }
};

export const TwoStageExercise: React.FC<TwoStageExerciseProps> = ({
  conceptId,
  conceptName,
  conceptDescription,
  relevanceScore,
  estimatedMinutes,
  difficulty,
  studentProfile,
  onComplete,
}) => {
  const [stage, setStage] = useState<ExerciseStage>('initial');
  const [status, setStatus] = useState<ExerciseStatus>('ready');
  const [currentExercise, setCurrentExercise] = useState<ExerciseGenerationResponse | null>(null);
  const [evaluation, setEvaluation] = useState<ExerciseEvaluationResponse | null>(null);
  const [response, setResponse] = useState('');
  const [remediationAttempts, setRemediationAttempts] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

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
      setResponse('');
      setEvaluation(null);
    } catch (error) {
      console.error('Failed to generate exercise:', error);
      setStatus('ready');
    }
  };

  const evaluateResponse = async () => {
    if (!currentExercise || !response.trim()) return;
    
    setStatus('evaluating');
    try {
      const result = await exerciseService.evaluateExercise({
        exerciseId: currentExercise.exerciseId,
        studentResponse: response,
        expectedSteps: currentExercise.expectedSteps,
      });
      
      setEvaluation(result);
      setCompletedSteps([...completedSteps, ...result.identifiedSteps]);
      
      if (result.remediationNeeded && remediationAttempts < 3) {
        setStatus('remediation');
      } else if (result.competencyScore >= 0.8) {
        if (stage === 'initial') {
          // Move to advanced exercise
          setTimeout(() => {
            setStage('advanced');
            setStatus('ready');
          }, 2000);
        } else {
          // Complete!
          setStage('complete');
          onComplete?.();
        }
      } else {
        setStatus('answering');
      }
    } catch (error) {
      console.error('Failed to evaluate response:', error);
      setStatus('answering');
    }
  };

  const startRemediation = async () => {
    if (!evaluation?.remediationFocus) return;
    
    setStatus('loading');
    setRemediationAttempts(remediationAttempts + 1);
    
    try {
      const exercise = await exerciseService.generateRemediation(
        conceptId,
        evaluation.remediationFocus,
        studentProfile
      );
      setCurrentExercise(exercise);
      setStatus('answering');
      setResponse('');
      setEvaluation(null);
    } catch (error) {
      console.error('Failed to generate remediation:', error);
      setStatus('ready');
    }
  };

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

  const renderExerciseContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Generating personalized exercise...
            </p>
          </div>
        </div>
      );
    }

    if (!currentExercise) {
      return (
        <div className="text-center py-12">
          <Button
            variant="primary"
            size="lg"
            onClick={() => generateExercise('initial')}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Start Initial Exercise
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Life Category Context */}
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

        {/* Exercise Prompt */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h3 className="font-semibold text-lg mb-3 text-obsidian dark:text-gray-100">
            Exercise Prompt
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {currentExercise.prompt}
          </p>
          
          {/* Difficulty Badge */}
          <div className="mt-4">
            <Badge
              variant={
                currentExercise.difficulty === 'basic' ? 'success' :
                currentExercise.difficulty === 'intermediate' ? 'warning' : 'error'
              }
              size="sm"
            >
              {currentExercise.difficulty} difficulty
            </Badge>
          </div>
        </Card>

        {/* Response Section */}
        {status !== 'evaluating' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Thinking Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Break down the problem into clear steps</li>
                    <li>Explain your reasoning for each decision</li>
                    <li>Show how you apply the concept</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Thought Process
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Walk through your complete thought process step by step..."
                className="w-full min-h-[200px] p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg resize-y focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                disabled={(status as string) === 'loading' || (status as string) === 'evaluating'}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Minimum 50 characters • {response.length} characters written
                </p>
                <Button
                  variant="primary"
                  onClick={evaluateResponse}
                  disabled={response.length < 50 || (status as string) === 'loading' || (status as string) === 'evaluating'}
                >
                  Submit Response
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Evaluation Results */}
        {evaluation && (
          <Card className={cn(
            'p-6',
            evaluation.remediationNeeded ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-green-400 bg-green-50 dark:bg-green-900/20'
          )}>
            <div className="flex items-start gap-3 mb-4">
              {evaluation.remediationNeeded ? (
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">
                  {evaluation.remediationNeeded ? 'Let\'s Strengthen Your Understanding' : 'Excellent Work!'}
                </h4>
                <p className="text-sm mb-3">{evaluation.feedback}</p>
                
                {/* Step Analysis */}
                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="font-medium">Steps Identified:</span> {evaluation.stepsCorrect} of {evaluation.stepsTotal}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(evaluation.competencyScore * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Missing Steps */}
                {evaluation.missingSteps.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Steps to Include:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {evaluation.missingSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {evaluation.remediationNeeded && status === 'remediation' && (
                    <Button
                      variant="primary"
                      onClick={startRemediation}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Practice This Step
                    </Button>
                  )}
                  {!evaluation.remediationNeeded && stage === 'initial' && (
                    <Button
                      variant="primary"
                      onClick={() => generateExercise('advanced')}
                    >
                      Continue to Advanced
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderCompleteState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-obsidian dark:text-gray-100 mb-3">
        Concept Mastered! 🎉
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
          <div className="text-2xl font-bold text-purple-600">{remediationAttempts}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Practice Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">100%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mastery</div>
        </div>
      </div>

      <Button variant="primary" size="lg" onClick={onComplete}>
        Continue Learning
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );

  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#293243' }}>
      {/* Concept Title Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-semibold text-white">
            {conceptName}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-base text-gray-300">
          <div className="flex items-center gap-1">
            <TrendingUp className={cn("h-4 w-4", getRelevanceColor(relevanceScore))} />
            <span className={getRelevanceColor(relevanceScore)}>
              {Math.round(relevanceScore * 100)}% relevant
            </span>
          </div>
          {estimatedMinutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{estimatedMinutes} min</span>
            </div>
          )}
          {difficulty && (
            <span className={cn(
              "text-sm font-medium px-2 py-0.5 rounded-full",
              getDifficultyColor(difficulty)
            )}>
              {difficulty}
            </span>
          )}
        </div>
      </div>
      
      {/* Concept Presentation */}
      <div className="mx-6 mb-6">
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1a202c' }}>
          <ConceptPresentation 
            conceptId={conceptId}
            conceptTitle={conceptName}
            className="text-white"
          />
        </div>
      </div>
      
      {/* Exercise Content */}
      <Card className="mx-6 mb-6">
        {renderExerciseHeader()}
        {stage === 'complete' ? renderCompleteState() : renderExerciseContent()}
      </Card>
    </div>
  );
};