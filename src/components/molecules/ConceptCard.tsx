import React, { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { 
  Sparkles,
  Eye,
  BookOpen,
  CheckCircle,
  Lock,
  PlayCircle,
  FileText,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import type { LifeCategory } from '../../types';

interface ConceptComponent {
  id: string;
  title: string;
  type: 'hook' | 'example' | 'approach' | 'non-example';
  contentType: 'video' | 'article' | 'interactive';
  duration?: string;
  url?: string;
}

export interface ConceptCardProps {
  id: string;
  title: string;
  description: string;
  category: LifeCategory;
  components: {
    hook: ConceptComponent;
    example: ConceptComponent;
    approach: ConceptComponent;
    nonExample: ConceptComponent;
  };
  completedComponents: string[];
  onComponentComplete: (componentId: string) => void;
  isLocked?: boolean;
}

const categoryColors: Record<LifeCategory, string> = {
  personal: 'border-personal',
  social: 'border-social',
  career: 'border-career',
  philanthropic: 'border-philanthropic',
};

const componentIcons = {
  hook: Sparkles,
  example: Eye,
  approach: BookOpen,
  'non-example': FileText,
};

const contentTypeIcons = {
  video: PlayCircle,
  article: FileText,
  interactive: BookOpen,
};

const componentOrder = ['hook', 'example', 'approach', 'nonExample'] as const;
const componentLabels = {
  hook: 'Hook & Relevance',
  example: 'Show Me Examples',
  approach: 'Academic Approach',
  nonExample: 'What NOT to Do',
};

export const ConceptCard: React.FC<ConceptCardProps> = ({
  title,
  description,
  category,
  components,
  completedComponents,
  onComponentComplete,
  isLocked = false,
}) => {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);

  const isComponentCompleted = (componentId: string) => completedComponents.includes(componentId);
  const allComponentsCompleted = componentOrder.every(key => 
    isComponentCompleted(components[key].id)
  );

  const progress = (completedComponents.filter(id => 
    componentOrder.some(key => components[key].id === id)
  ).length / 4) * 100;

  const handleComponentClick = (component: ConceptComponent) => {
    if (!isComponentCompleted(component.id) && component.url) {
      // In real app, this would open the content
      onComponentComplete(component.id);
    }
  };

  if (isLocked) {
    return (
      <Card className={cn('relative overflow-hidden opacity-60', 'border-t-4 border-gray-300 dark:border-gray-600')}>
        <div className="flex items-center justify-center py-8">
          <Lock className="h-8 w-8 text-gray-400 dark:text-gray-500 mr-3" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Complete previous concept to unlock</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('border-t-4', categoryColors[category])}>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-obsidian dark:text-gray-100 mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-teal-500 h-2 rounded-full transition-all duration-normal"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 3 Components */}
        <div className="space-y-3">
          {componentOrder.map((key) => {
            const component = components[key];
            const Icon = componentIcons[component.type];
            const ContentIcon = contentTypeIcons[component.contentType];
            const isCompleted = isComponentCompleted(component.id);
            const isExpanded = expandedComponent === component.id;

            return (
              <div
                key={component.id}
                className={cn(
                  'border rounded-lg transition-all duration-normal',
                  isExpanded ? 'border-teal-300 dark:border-teal-600 shadow-sm' : 'border-gray-200 dark:border-gray-700',
                  isCompleted && 'bg-gray-50 dark:bg-gray-800'
                )}
              >
                <button
                  onClick={() => setExpandedComponent(isExpanded ? null : component.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-teal-50 dark:bg-teal-900/30'
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm text-obsidian dark:text-gray-100">
                        {componentLabels[key]}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{component.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ContentIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    {component.duration && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{component.duration}</span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="pt-3 space-y-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleComponentClick(component)}
                        disabled={isCompleted}
                      >
                        {isCompleted ? 'Completed' : `Start ${componentLabels[key]}`}
                        {!isCompleted && <ArrowRight className="h-4 w-4 ml-2" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {allComponentsCompleted && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
              ✨ Concept completed! Ready for exercises.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};