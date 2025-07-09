import React from 'react';
import { Card } from '../atoms/Card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  primary: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  success: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-obsidian dark:text-gray-100">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'text-xs font-medium flex items-center gap-1',
              trend.isPositive ? 'text-success' : 'text-error'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-lg',
          variantStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};