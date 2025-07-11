import React from 'react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { 
  ChevronRight, 
  ChevronDown,
  Target,
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
    if (score >= 0.9) return 'text-green-600 bg-green-50';
    if (score >= 0.85) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-yellow-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-obsidian mb-4">
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
                  "cursor-pointer transition-all",
                  isSelected 
                    ? "border-teal-500 shadow-md bg-teal-50" 
                    : "hover:border-gray-300 hover:shadow-sm"
                )}
              >
                <div 
                  className="p-3"
                  onClick={() => onSelectSection(section.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="text-sm font-medium text-gray-500 mt-0.5">
                        {index + 1}.
                      </div>
                      <h3 className={cn(
                        "text-sm font-medium line-clamp-2 flex-1",
                        isSelected ? "text-teal-900" : "text-obsidian"
                      )}>
                        {section.title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpanded(section.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded",
                      getRelevanceColor(section.relevanceScore)
                    )}>
                      <Target className="h-3 w-3" />
                      <span>{Math.round(section.relevanceScore * 100)}%</span>
                    </div>
                    
                    {section.estimatedMinutes && (
                      <div className="flex items-center gap-1 text-gray-500">
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
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600 line-clamp-3 mb-2">
                        {section.text.substring(0, 150)}...
                      </p>
                      
                      {section.conceptIds && section.conceptIds.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
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
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Thread Summary
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
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