import React, { useState } from 'react';
import { Card } from '../atoms/Card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown, Calendar, Target, Info } from 'lucide-react';

export interface ExpandableStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  expandedContent?: {
    weeklyData?: number[];
    monthlyGoal?: number;
    bestRecord?: number;
    insights?: string[];
  };
}

const variantStyles = {
  default: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  primary: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  success: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
};

export const ExpandableStatsCard: React.FC<ExpandableStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  expandedContent,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => setIsExpanded(true), 200);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsExpanded(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          isHovered && "shadow-lg scale-105 z-10"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl font-semibold text-obsidian dark:text-gray-100">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
            )}
            {trend && (
              <div className={cn(
                'text-xs font-medium flex items-center gap-1',
                trend.isPositive ? 'text-success' : 'text-error'
              )}>
                {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <div className={cn(
            'p-2 rounded-lg transition-all duration-300',
            variantStyles[variant],
            isHovered && 'scale-110'
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && expandedContent && (
          <div className={cn(
            "absolute inset-0 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xl",
            "animate-in",
            "min-w-[280px]"
          )}>
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-obsidian dark:text-gray-100">{title}</h3>
                <Info className="h-4 w-4 text-gray-400" />
              </div>

              {/* Current Value Display */}
              <div className="text-center py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-3xl font-bold text-obsidian dark:text-gray-100">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {expandedContent.monthlyGoal && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Monthly Goal</p>
                    <p className="font-semibold text-obsidian dark:text-gray-100">
                      {expandedContent.monthlyGoal}
                    </p>
                  </div>
                )}
                {expandedContent.bestRecord && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Best Record</p>
                    <p className="font-semibold text-obsidian dark:text-gray-100">
                      {expandedContent.bestRecord}
                    </p>
                  </div>
                )}
              </div>

              {/* Weekly Trend */}
              {expandedContent.weeklyData && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</p>
                  <div className="flex items-end justify-between h-12 gap-1">
                    {expandedContent.weeklyData.map((value, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex-1 rounded-t transition-all duration-300",
                          variantStyles[variant].split(' ')[0]
                        )}
                        style={{ height: `${(value / Math.max(...expandedContent.weeklyData)) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              {expandedContent.insights && expandedContent.insights.length > 0 && (
                <div className="space-y-1 border-t border-gray-200 dark:border-gray-700 pt-2">
                  {expandedContent.insights.map((insight, index) => (
                    <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
                      • {insight}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};