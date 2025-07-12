import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { 
  MessageSquare, 
  Brain, 
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ThreadCardProps {
  threadId: string;
  userInput: string;
  analysis: {
    subjects: string[];
    topics: string[];
    summary: string;
  };
  sectionCount: number;
  createdAt: string;
  estimatedReadTime?: number;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  threadId,
  userInput,
  analysis,
  sectionCount,
  createdAt,
  estimatedReadTime
}) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };
  
  // Calculate actual read time from sections if not provided
  const readTime = estimatedReadTime || sectionCount * 8;
  
  return (
    <Link
      to={`/thread/${threadId}`}
      className="block hover:scale-[1.02] transition-transform"
    >
      <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-personal">
        <div className="p-4 sm:p-6 space-y-4">
          {/* User Question */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                {userInput}
              </h3>
            </div>
          </div>
          
          {/* AI Analysis Summary */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Brain className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {analysis.summary}
              </p>
            </div>
          </div>
          
          {/* Subject Badges */}
          {analysis.subjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {analysis.subjects.slice(0, 3).map((subject, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                >
                  {subject}
                </Badge>
              ))}
              {analysis.subjects.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{analysis.subjects.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Thread Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {sectionCount} sections
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime} min
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{formatTimeAgo(createdAt)}</span>
            </div>
          </div>
          
          {/* Hover Indicator */}
          <div className="flex justify-end pt-2">
            <ArrowRight className="w-4 h-4 text-personal opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Card>
    </Link>
  );
};