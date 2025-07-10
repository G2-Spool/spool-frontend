import React from 'react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Book, Clock, Layers } from 'lucide-react';
import type { Textbook } from '../../types';

interface TextbookCardProps {
  textbook: Textbook;
  onClick?: () => void;
}

export const TextbookCard: React.FC<TextbookCardProps> = ({ textbook, onClick }) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-normal cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Cover Image or Placeholder */}
        <div className="aspect-[3/4] bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 rounded-lg flex items-center justify-center">
          {textbook.coverImageUrl ? (
            <img 
              src={textbook.coverImageUrl} 
              alt={textbook.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Book className="h-20 w-20 text-teal-600 dark:text-teal-400" />
          )}
        </div>

        {/* Textbook Info */}
        <div>
          <h3 className="text-lg font-semibold text-obsidian dark:text-gray-100 line-clamp-2 mb-1">
            {textbook.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{textbook.subject}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="default" size="sm">
              Grade {textbook.gradeLevel}
            </Badge>
            {textbook.publisher && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {textbook.publisher}
              </span>
            )}
          </div>

          {textbook.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
              {textbook.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              <span>{textbook.totalChapters} chapters</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{textbook.estimatedHours}h</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};