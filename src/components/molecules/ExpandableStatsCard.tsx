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
        className="relative overflow-hidden transition-all duration-300 h-24 p-4"
      >
        <div className="flex items-center justify-between h-full">
          {/* Left side - Icon and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              {subtitle && (
                <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Right side - Value and Trend */}
          <div className="text-right">
            <p className="text-2xl font-bold text-obsidian dark:text-gray-100">{value}</p>
            {trend && (
              <div className={cn(
                'text-xs font-medium flex items-center justify-end gap-1 mt-1',
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              )}>
                {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};