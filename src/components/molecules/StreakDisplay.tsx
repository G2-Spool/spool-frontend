import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  className,
}) => {
  const isOnFire = currentStreak >= 7;
  const isPersonalBest = currentStreak === longestStreak && currentStreak > 0;

  return (
    <div className={cn('flex items-center gap-6', className)}>
      <div className="flex items-center gap-3">
        <div className={cn(
          'p-3 rounded-full transition-all duration-normal',
          isOnFire ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'
        )}>
          <Flame className={cn(
            'h-6 w-6 transition-colors duration-normal',
            isOnFire ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'
          )} />
        </div>
        <div>
          <p className="text-2xl font-bold text-obsidian dark:text-gray-100">{currentStreak}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">day streak</p>
        </div>
      </div>

      <div className="h-12 w-px bg-gray-200 dark:bg-gray-700" />

      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full bg-teal-50 dark:bg-teal-900/30">
          <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <p className="text-2xl font-bold text-obsidian dark:text-gray-100">{longestStreak}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">best streak</p>
        </div>
      </div>

      {isPersonalBest && currentStreak > 0 && (
        <div className="ml-4">
          <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full">
            🎉 Personal Best!
          </span>
        </div>
      )}
    </div>
  );
};