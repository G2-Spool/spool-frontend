import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { 
  MessageSquare, 
  Brain, 
  Clock,
  ArrowRight,
  Sparkles
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
  estimatedReadTime = 15
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
  
  return (
    <Link
      to={`/thread/${threadId}`}
      className="block hover:scale-[1.02] transition-transform"
    >
      <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-personal">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-personal" />
              <span className="text-sm font-medium text-personal">Learning Thread</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(createdAt)}</span>
          </div>
          
          {/* User Query */}
          <div className="mb-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 italic">
              "{userInput}"
            </p>
          </div>
          
          {/* AI Analysis Summary */}
          <div className="mb-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Brain className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-teal-800 dark:text-teal-300 line-clamp-2">
                  {analysis.summary}
                </p>
              </div>
            </div>
          </div>
          
          {/* Subject Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {analysis.subjects.slice(0, 2).map((subject, idx) => (
              <Badge key={idx} variant="primary" size="sm">
                {subject}
              </Badge>
            ))}
            {analysis.topics.slice(0, 2).map((topic, idx) => (
              <Badge key={idx} variant="default" size="sm">
                {topic}
              </Badge>
            ))}
            {analysis.subjects.length + analysis.topics.length > 4 && (
              <Badge variant="default" size="sm">
                +{analysis.subjects.length + analysis.topics.length - 4}
              </Badge>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>{sectionCount} sections</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{estimatedReadTime} min</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-personal" />
          </div>
        </div>
      </Card>
    </Link>
  );
};