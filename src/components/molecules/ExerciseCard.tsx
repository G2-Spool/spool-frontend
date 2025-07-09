import React, { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { cn } from '../../utils/cn';
import type { LifeCategory } from '../../types';
import { 
  Brain, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

export interface ExerciseCardProps {
  title: string;
  description: string;
  category: LifeCategory;
  type: 'initial' | 'articulation';
  onSubmit: (response: string) => void;
  isCompleted?: boolean;
  feedback?: string;
}

const categoryColors: Record<LifeCategory, { bg: string; border: string; text: string }> = {
  personal: {
    bg: 'bg-personal',
    border: 'border-personal',
    text: 'text-white',
  },
  social: {
    bg: 'bg-social',
    border: 'border-social',
    text: 'text-white',
  },
  career: {
    bg: 'bg-career',
    border: 'border-career',
    text: 'text-white',
  },
  philanthropic: {
    bg: 'bg-philanthropic',
    border: 'border-philanthropic',
    text: 'text-white',
  },
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  description,
  category,
  type,
  onSubmit,
  isCompleted = false,
  feedback,
}) => {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colors = categoryColors[category];

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(response);
    } finally {
      setIsSubmitting(false);
    }
  };

  const placeholderText = type === 'initial' 
    ? "Walk through your thought process and understanding of this exercise. Explain how you would approach this problem and why..."
    : "Explain your solution in detail. What concepts did you apply? What was your reasoning? How would you teach this to someone else?";

  return (
    <Card className="overflow-hidden border-0 shadow-md">
      {/* Colored Header */}
      <div className={cn('px-6 py-4', colors.bg, colors.text)}>
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6" />
          <h3 className="text-lg font-semibold">
            {type === 'initial' ? 'Initial Exercise' : 'Articulation Exercise'}: {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>

        {!isCompleted ? (
          <>
            {/* Hint Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">
                  {type === 'initial' ? 'Thinking Tip:' : 'Articulation Tip:'}
                </p>
                <p>
                  {type === 'initial' 
                    ? 'Break down the problem into smaller parts. Consider what you already know and how it relates to this exercise.'
                    : 'Imagine you\'re teaching this to a friend. Use clear examples and explain the "why" behind your approach.'}
                </p>
              </div>
            </div>

            {/* Response Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Response
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={placeholderText}
                className="w-full min-h-[200px] p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg resize-y focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Minimum 100 characters • {response.length} characters written
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={response.length < 100 || isSubmitting}
              >
                Submit Response
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Completed State */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-100 mb-1">Exercise Completed!</p>
                  {feedback && (
                    <p className="text-sm text-green-800 dark:text-green-200">{feedback}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Show submitted response */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Response:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{response}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};