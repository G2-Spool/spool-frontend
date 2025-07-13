import React from 'react';
import { Card } from '../atoms/Card';
import { 
  ChevronRight, 
  ChevronDown,
  TrendingUp,
  Clock,
  BookOpen
} from 'lucide-react';
import { cn } from '../../utils/cn';

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
}

export const ThreadSectionsSidebar: React.FC<ThreadSectionsSidebarProps> = ({
  sections,
  selectedSection,
  onSelectSection,
  expandedSections,
  onToggleExpanded
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
    <div className="w-80 bg-white dark:bg-gray-900 overflow-y-auto hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-300">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-obsidian dark:text-gray-100 mb-4">
          Thread Sections
        </h2>
        
        <div className="space-y-2">
          {sections.map((section, index) => {
            const isSelected = selectedSection === section.id;
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <Card
                key={section.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 transform hover:scale-[1.02]",
                  isSelected 
                    ? "border-teal-500 shadow-md bg-teal-50 dark:bg-teal-900/20" 
                    : "hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
              >
                <div 
                  className="p-3"
                  onClick={() => onSelectSection(section.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                        {index + 1}.
                      </div>
                      <h3 className={cn(
                        "text-sm font-medium line-clamp-2 flex-1",
                        isSelected ? "text-teal-900 dark:text-teal-200" : "text-obsidian dark:text-gray-100"
                      )}>
                        {section.title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpanded(section.id);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200 hover:scale-110"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
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
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mb-2">
                        {section.text.substring(0, 150)}...
                      </p>
                      
                      {section.conceptIds && section.conceptIds.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <BookOpen className="h-3 w-3" />
                          <span>{section.conceptIds.length} related concepts</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 hover:shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Thread Summary
          </h3>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
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
      </div>
    </div>
  );
};