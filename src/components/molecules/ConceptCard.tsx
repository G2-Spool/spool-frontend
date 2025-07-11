import React, { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { ProgressBar } from './ProgressBar';
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
  type: 'hook' | 'examples' | 'what-how';
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
    hookRelevance: ConceptComponent;
    showMeExamples: ConceptComponent;
    whatAndHow: ConceptComponent;
  };
  completedComponents: string[];
  onComponentComplete: (componentId: string) => void;
  isLocked?: boolean;
}

const categoryColors: Record<LifeCategory, string> = {
  personal: 'var(--color-personal)',
  social: 'var(--color-social)',
  career: 'var(--color-career)',
  philanthropic: 'var(--color-philanthropic)',
};

const componentIcons = {
  hook: Sparkles,
  examples: Eye,
  'what-how': BookOpen,
};

const contentTypeIcons = {
  video: PlayCircle,
  article: FileText,
  interactive: BookOpen,
};

const componentOrder = ['hookRelevance', 'showMeExamples', 'whatAndHow'] as const;
const componentLabels = {
  hookRelevance: 'Hook & Relevance',
  showMeExamples: 'Show Me Examples',
  whatAndHow: 'What & How',
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
  ).length / 3) * 100;

  const handleComponentClick = (component: ConceptComponent) => {
    if (!isComponentCompleted(component.id) && component.url) {
      // In real app, this would open the content
      onComponentComplete(component.id);
    }
  };

  if (isLocked) {
    return (
      <Card variant="thread" className="relative overflow-hidden opacity-60" style={{ borderTopWidth: '4px', borderTopStyle: 'solid', borderTopColor: 'var(--border-color-strong)' }}>
        <div className="flex items-center justify-center py-8">
          <Lock className="h-8 w-8 mr-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Complete previous concept to unlock</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="thread" style={{ borderTopWidth: '4px', borderTopStyle: 'solid', borderTopColor: categoryColors[category] }}>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          value={progress}
          label="Progress"
          showPercentage
          size="md"
        />

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
                  'border rounded-lg transition-all',
                  isExpanded && 'shadow-sm'
                )}
                style={{
                  borderColor: isExpanded ? 'var(--thread-primary)' : 'var(--border-color)',
                  backgroundColor: isCompleted ? 'var(--surface-overlay)' : 'transparent'
                }}
              >
                <button
                  onClick={() => setExpandedComponent(isExpanded ? null : component.id)}
                  className="w-full px-4 py-3 flex items-center justify-between transition-colors rounded-lg hover:bg-opacity-50"
                  style={{ ':hover': { backgroundColor: 'var(--surface-overlay)' } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: isCompleted ? 'rgba(72, 187, 120, 0.1)' : 'rgba(79, 209, 197, 0.1)' }}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" style={{ color: 'var(--color-success)' }} />
                      ) : (
                        <Icon className="h-5 w-5" style={{ color: 'var(--thread-primary)' }} />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        {componentLabels[key]}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{component.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ContentIcon className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    {component.duration && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{component.duration}</span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    ) : (
                      <ChevronDown className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
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
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: 'rgba(72, 187, 120, 0.05)', border: '1px solid rgba(72, 187, 120, 0.2)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>
              ✨ Concept completed! Ready for exercises.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};