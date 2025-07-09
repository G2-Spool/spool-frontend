import React from 'react';
import { Card } from '../atoms/Card';
import { ProgressBar } from './ProgressBar';
import { Badge } from '../atoms/Badge';
import { Clock, Trophy, Target, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { LifeCategory } from '../../types';

export interface LearningPathCardProps {
  id: string;
  title: string;
  category: LifeCategory;
  description: string;
  progress: number;
  totalExercises: number;
  completedExercises: number;
  estimatedMinutes: number;
  points: number;
  isActive?: boolean;
  onClick?: () => void;
}

const categoryColors: Record<LifeCategory, string> = {
  personal: 'border-personal',
  social: 'border-social',
  career: 'border-career',
  philanthropic: 'border-philanthropic',
};

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  title,
  category,
  description,
  progress,
  totalExercises,
  completedExercises,
  estimatedMinutes,
  points,
  isActive = false,
  onClick,
}) => {
  return (
    <Card
      hover
      onClick={onClick}
      className={cn(
        'transition-all duration-normal cursor-pointer',
        'border-l-4',
        categoryColors[category],
        isActive && 'ring-2 ring-teal-500 ring-offset-2'
      )}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-obsidian dark:text-gray-100 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-4" />
        </div>

        <ProgressBar
          value={progress}
          label={`${completedExercises} of ${totalExercises} exercises`}
          showPercentage
          variant={progress === 100 ? 'success' : 'default'}
        />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{estimatedMinutes} min</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Trophy className="h-4 w-4" />
              <span>{points} pts</span>
            </div>
          </div>
          {isActive && (
            <Badge variant="success" size="sm">
              <Target className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};