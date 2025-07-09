import React, { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { 
  BookOpen, 
  Video, 
  Code, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PlayCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import type { LifeCategory } from '../../types';

export interface ConceptComponent {
  type: 'article' | 'video' | 'interactive';
  title: string;
  description: string;
  url?: string;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
}

export interface ConceptDisplayProps {
  title: string;
  category: LifeCategory;
  description: string;
  components: ConceptComponent[];
  onComplete?: (componentIndex: number) => void;
  completedComponents?: number[];
}

const componentIcons = {
  article: BookOpen,
  video: Video,
  interactive: Code,
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

const categoryColors: Record<LifeCategory, string> = {
  personal: 'border-personal',
  social: 'border-social',
  career: 'border-career',
  philanthropic: 'border-philanthropic',
};

export const ConceptDisplay: React.FC<ConceptDisplayProps> = ({
  title,
  category,
  description,
  components,
  onComplete,
  completedComponents = [],
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const completionPercentage = (completedComponents.length / components.length) * 100;

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleComponentClick = (index: number) => {
    if (onComplete && !completedComponents.includes(index)) {
      onComplete(index);
    }
  };

  return (
    <Card className={cn('border-t-4', categoryColors[category])}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-obsidian mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Concept Progress</span>
              <span className="font-medium">{completedComponents.length} of {components.length} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-500 h-2 rounded-full transition-all duration-normal"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Components */}
        <div className="space-y-4">
          {components.map((component, index) => {
            const Icon = componentIcons[component.type];
            const isExpanded = expandedIndex === index;
            const isCompleted = completedComponents.includes(index);

            return (
              <div
                key={index}
                className={cn(
                  'border rounded-lg transition-all duration-normal',
                  isExpanded ? 'border-teal-300 shadow-md' : 'border-gray-200',
                  isCompleted && 'bg-gray-50'
                )}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'p-3 rounded-lg',
                      isCompleted ? 'bg-green-100' : 'bg-teal-50'
                    )}>
                      <Icon className={cn(
                        'h-5 w-5',
                        isCompleted ? 'text-green-600' : 'text-teal-600'
                      )} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-obsidian flex items-center gap-2">
                        {component.title}
                        {isCompleted && (
                          <Badge variant="success" size="sm">Completed</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        {component.duration && (
                          <span className="text-gray-500">Duration: {component.duration}</span>
                        )}
                        {component.difficulty && (
                          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', difficultyColors[component.difficulty])}>
                            {component.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <div className="pt-4 space-y-4">
                      {component.thumbnail && (
                        <img 
                          src={component.thumbnail} 
                          alt={component.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      
                      <div className="flex gap-3">
                        {component.url && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleComponentClick(index)}
                          >
                            {component.type === 'video' ? (
                              <>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Watch Now
                              </>
                            ) : component.type === 'interactive' ? (
                              <>
                                <Code className="h-4 w-4 mr-2" />
                                Start Activity
                              </>
                            ) : (
                              <>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Read Article
                              </>
                            )}
                          </Button>
                        )}
                        
                        {component.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(component.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </Button>
                        )}
                      </div>

                      {isCompleted && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800">
                            ✓ You've completed this component. Great job!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Steps */}
        {completionPercentage === 100 && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
            <p className="text-teal-800 font-medium mb-3">
              🎉 Congratulations! You've completed all components of this concept.
            </p>
            <Button variant="primary">
              Continue to Exercise
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};