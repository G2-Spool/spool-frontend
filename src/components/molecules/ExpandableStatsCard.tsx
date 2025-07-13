import React from 'react';
import { Card } from '../atoms/Card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface ExpandableStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}


export const ExpandableStatsCard: React.FC<ExpandableStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-gray-400 dark:text-gray-500',
  trend,
}) => {
  return (
    <div className="relative">
      <Card 
        className="relative overflow-hidden transition-all duration-300 min-h-[120px] p-6"
      >
        <div className="relative h-full">
          <div className="absolute top-0 left-0">
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</p>
              <p className="text-4xl font-bold text-obsidian dark:text-gray-100">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-400 dark:text-gray-500">{subtitle}</p>
              )}
              {trend && (
                <div className={cn(
                  'text-sm font-medium flex items-center justify-center gap-1',
                  trend.isPositive ? 'text-success' : 'text-error'
                )}>
                  {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>


      </Card>
    </div>
  );
};