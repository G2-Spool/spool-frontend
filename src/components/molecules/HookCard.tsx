import React from 'react';
import { cn } from '../../utils/cn';
import { Card } from '../atoms/Card';
import { Heart, Users, Briefcase, Globe } from 'lucide-react';
import type { LifeCategory } from '../../types';

export interface HookCardProps {
  category: LifeCategory;
  title: string;
  text: string;
  onClick?: () => void;
}

const categoryConfig = {
  personal: {
    icon: Heart,
    color: 'text-personal',
    bgColor: 'bg-personal/10',
    borderColor: 'border-personal',
    title: 'Personal Life',
  },
  social: {
    icon: Users,
    color: 'text-social',
    bgColor: 'bg-social/10',
    borderColor: 'border-social',
    title: 'Social Life',
  },
  career: {
    icon: Briefcase,
    color: 'text-career',
    bgColor: 'bg-career/10',
    borderColor: 'border-career',
    title: 'Career Life',
  },
  philanthropic: {
    icon: Globe,
    color: 'text-philanthropic',
    bgColor: 'bg-philanthropic/10',
    borderColor: 'border-philanthropic',
    title: 'Philanthropic Life',
  },
};

export const HookCard: React.FC<HookCardProps> = ({
  category,
  title,
  text,
  onClick,
}) => {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <Card
      hover
      onClick={onClick}
      className={cn(
        'relative overflow-hidden border-t-4',
        config.borderColor,
        'transition-all duration-normal'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('p-3 rounded-lg', config.bgColor)}>
          <Icon className={cn('h-6 w-6', config.color)} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title || config.title}
          </p>
          <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </Card>
  );
};