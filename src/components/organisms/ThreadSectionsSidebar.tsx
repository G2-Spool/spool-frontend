import React from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { 
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { MarkdownText } from '../../utils/markdown';
import { VocabularyDrawer } from './VocabularyDrawer';

interface ThreadSection {
  id: string;
  title: string;
  text: string;
  relevanceScore: number;
  courseId?: string;
  conceptIds?: string[];
  difficulty?: string;
  estimatedMinutes?: number;
}

interface ThreadSectionsSidebarProps {
  sections: ThreadSection[];
  selectedSection: string | null;
  onSelectSection: (sectionId: string) => void;
  expandedSections: Set<string>;
  onToggleExpanded: (sectionId: string) => void;
  isExerciseMode?: boolean;
  newTerms?: string[];
  onClearNewTerms?: () => void;
  activeTab?: 'concepts' | 'glossary';
  onSetActiveTab?: (tab: 'concepts' | 'glossary') => void;
}

export const ThreadSectionsSidebar: React.FC<ThreadSectionsSidebarProps> = ({
  sections,
  selectedSection,
  onSelectSection,
  expandedSections,
  onToggleExpanded,
  isExerciseMode = false,
  newTerms = [],
  onClearNewTerms,
  activeTab = 'concepts',
  onSetActiveTab
}) => {
  const getRelevanceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (score >= 0.85) return 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20';
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 dark:text-green-400';
      case 'intermediate':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'advanced':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  return (
    <div className="w-80 bg-white dark:bg-gray-900 overflow-y-auto">
      <div className="p-4">
        {/* Tab Header */}
        {isExerciseMode ? (
          <div className="relative mb-4">
            <div className="flex gap-1 px-2">
              <button
                onClick={() => onSetActiveTab?.('concepts')}
                className={cn(
                  "flex-1 px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 relative z-10 border-b-0",
                  activeTab === 'concepts'
                    ? "bg-white dark:bg-gray-900 text-obsidian dark:text-gray-100 border-t border-l border-r border-gray-200 dark:border-gray-700"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border-t border-l border-r border-transparent"
                )}
              >
                Concepts
              </button>
              <button
                onClick={() => onSetActiveTab?.('glossary')}
                className={cn(
                  "flex-1 px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 relative z-10 border-b-0",
                  activeTab === 'glossary'
                    ? "bg-white dark:bg-gray-900 text-obsidian dark:text-gray-100 border-t border-l border-r border-gray-200 dark:border-gray-700"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border-t border-l border-r border-transparent"
                )}
              >
                Glossary
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700 z-0"></div>
          </div>
        ) : (
          <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100 mb-4 text-center">
            Concepts
          </h2>
        )}
        
        {/* Tab Content */}
        {!isExerciseMode || activeTab === 'concepts' ? (
          <div className="space-y-2">
            {sections.map((section, index) => {
            const isSelected = selectedSection === section.id;
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <Card
                key={section.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 transform hover:scale-[1.02] bg-gray-100 dark:bg-gray-800",
                  isSelected 
                    ? "border-teal-500 shadow-md bg-white dark:bg-teal-900/20" 
                    : "hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-teal-100 dark:hover:shadow-teal-900/20"
                )}
              >
                <div 
                  className="px-0 py-1"
                  onClick={() => onSelectSection(section.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-base font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                        {index + 1}.
                      </div>
                      <h3 className={cn(
                        "text-base font-medium line-clamp-2 flex-1",
                        isSelected ? "text-teal-900 dark:text-teal-200" : "text-obsidian dark:text-gray-100"
                      )}>
                        {section.title}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpanded(section.id);
                      }}
                      className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded",
                      getRelevanceColor(section.relevanceScore)
                    )}>
                      <TrendingUp className="h-3 w-3" />
                      <span>{Math.round(section.relevanceScore * 100)}%</span>
                    </div>
                    
                    {section.estimatedMinutes && (
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{section.estimatedMinutes}m</span>
                      </div>
                    )}
                    
                    {section.difficulty && (
                      <span className={cn(
                        "text-xs font-medium",
                        getDifficultyColor(section.difficulty)
                      )}>
                        {section.difficulty}
                      </span>
                    )}
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4 mb-1">
                        <MarkdownText text={section.text.substring(0, 150) + '...'} />
                      </p>
                      

                    </div>
                  )}
                </div>
              </Card>
            );
          })}
          </div>
        ) : (
          <VocabularyDrawer
            newTerms={newTerms}
            onClearNewTerms={onClearNewTerms}
            className="mt-0"
          />
        )}
        
        {/* Summary Stats */}
        {(!isExerciseMode || activeTab === 'concepts') && (
          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Thread Summary
          </h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Total Sections:</span>
              <span className="font-medium">{sections.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Relevance:</span>
              <span className="font-medium">
                {Math.round(
                  (sections.reduce((sum, s) => sum + s.relevanceScore, 0) / sections.length) * 100
                )}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Est. Reading Time:</span>
              <span className="font-medium">
                {sections.reduce((sum, s) => sum + (s.estimatedMinutes || 0), 0)} min
              </span>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};