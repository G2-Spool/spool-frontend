import React from 'react';
import { cn } from '../../utils/cn';
import type { LifeCategory } from '../../types';

export interface InterestBubbleProps {
  interest: string;
  category: LifeCategory;
  strength: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const categoryColors: Record<LifeCategory, { bg: string; text: string; border: string }> = {
  personal: {
    bg: 'bg-personal/10 dark:bg-personal/20',
    text: 'text-personal',
    border: 'border-personal/20 dark:border-personal/30',
  },
  social: {
    bg: 'bg-social/10 dark:bg-social/20',
    text: 'text-social',
    border: 'border-social/20 dark:border-social/30',
  },
  career: {
    bg: 'bg-career/10 dark:bg-career/20',
    text: 'text-career',
    border: 'border-career/20 dark:border-career/30',
  },
  philanthropic: {
    bg: 'bg-philanthropic/10 dark:bg-philanthropic/20',
    text: 'text-philanthropic',
    border: 'border-philanthropic/20 dark:border-philanthropic/30',
  },
};

const sizeClasses = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

export const InterestBubble: React.FC<InterestBubbleProps> = ({
  interest,
  category,
  strength,
  size = 'md',
  onClick,
}) => {
  const colors = categoryColors[category];
  const opacity = Math.max(0.4, strength);

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border-2 font-medium transition-all duration-normal',
        'hover:scale-105 active:scale-95',
        sizeClasses[size],
        colors.bg,
        colors.text,
        colors.border,
        onClick && 'cursor-pointer'
      )}
      style={{ opacity }}
      title={`${interest} (${Math.round(strength * 100)}% strength)`}
    >
      {interest}
    </button>
  );
};