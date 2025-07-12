import React from 'react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { 
  Book, 
  Clock,
  GraduationCap,
  Library,
  ArrowRight,
  Layers
} from 'lucide-react';
import type { TraditionalThread } from '../../services/traditionalThreads.service';

interface TraditionalThreadCardProps {
  thread: TraditionalThread;
  onClick?: () => void;
}

export const TraditionalThreadCard: React.FC<TraditionalThreadCardProps> = ({ 
  thread, 
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: navigate to a traditional thread view
      // This could open the textbook in a reader or show chapter listing
      console.log('Traditional thread selected:', thread.bookId);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="block hover:scale-[1.02] transition-transform cursor-pointer"
    >
      <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-philanthropic">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Library className="h-5 w-5 text-philanthropic" />
              <span className="text-sm font-medium text-philanthropic">Traditional Textbook</span>
            </div>
            <Badge variant="primary" size="sm">
              {thread.subject}
            </Badge>
          </div>
          
          {/* Book Cover or Placeholder */}
          {thread.coverImageUrl ? (
            <div className="aspect-[3/4] max-h-32 mb-3 overflow-hidden rounded-lg">
              <img 
                src={thread.coverImageUrl} 
                alt={thread.bookTitle}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[3/4] max-h-32 mb-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg flex items-center justify-center">
              <Book className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            </div>
          )}
          
          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-obsidian dark:text-gray-100 line-clamp-2 mb-1">
              {thread.bookTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {thread.description}
            </p>
          </div>
          
          {/* Grade Level */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Grade {thread.gradeLevel}
              </span>
            </div>
          </div>
          
          {/* Traditional Learning Path Info */}
          <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Book className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-purple-800 dark:text-purple-300">
                  Follow the structured curriculum chapter by chapter, perfect for comprehensive subject mastery
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                <span>{thread.chapterCount} chapters</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{thread.estimatedHours}h</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-philanthropic" />
          </div>
        </div>
      </Card>
    </div>
  );
};