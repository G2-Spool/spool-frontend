import React, { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { ProgressBar } from './ProgressBar';
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
  beginner: { background: 'rgba(72, 187, 120, 0.1)', color: 'var(--color-success)' },
  intermediate: { background: 'rgba(237, 137, 54, 0.1)', color: 'var(--color-warning)' },
  advanced: { background: 'rgba(245, 101, 101, 0.1)', color: 'var(--color-error)' },
};

const categoryColors: Record<LifeCategory, string> = {
  personal: 'var(--color-personal)',
  social: 'var(--color-social)',
  career: 'var(--color-career)',
  philanthropic: 'var(--color-philanthropic)',
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
    <Card variant="thread" style={{ borderTopWidth: '4px', borderTopStyle: 'solid', borderTopColor: categoryColors[category] }}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
          
          {/* Progress */}
          <div className="mt-4">
            <ProgressBar
              value={completionPercentage}
              label="Concept Progress"
              showPercentage={false}
              size="md"
            />
            <div className="flex justify-end text-sm mt-1">
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{completedComponents.length} of {components.length} completed</span>
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
                  'border rounded-lg transition-all',
                  isExpanded && 'shadow-md'
                )}
                style={{
                  borderColor: isExpanded ? 'var(--thread-primary)' : 'var(--border-color)',
                  backgroundColor: isCompleted ? 'var(--surface-overlay)' : 'transparent'
                }}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full px-6 py-4 flex items-center justify-between transition-colors"
                  onMouseEnter={(e) => { if (!isCompleted) e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: isCompleted ? 'rgba(72, 187, 120, 0.1)' : 'rgba(79, 209, 197, 0.1)' }}>
                      <Icon className="h-5 w-5" style={{ color: isCompleted ? 'var(--color-success)' : 'var(--thread-primary)' }} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        {component.title}
                        {isCompleted && (
                          <Badge variant="success" size="sm">Completed</Badge>
                        )}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{component.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        {component.duration && (
                          <span style={{ color: 'var(--text-muted)' }}>Duration: {component.duration}</span>
                        )}
                        {component.difficulty && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium" style={difficultyColors[component.difficulty]}>
                            {component.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
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
                        <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(72, 187, 120, 0.05)', border: '1px solid rgba(72, 187, 120, 0.2)' }}>
                          <p className="text-sm" style={{ color: 'var(--color-success)' }}>
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
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'rgba(79, 209, 197, 0.05)', border: '1px solid rgba(79, 209, 197, 0.2)' }}>
            <p className="font-medium mb-3" style={{ color: 'var(--thread-primary)' }}>
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