/**
 * ConceptList Component
 * 
 * Displays a list of concepts within a course section with completion status,
 * description, and play buttons for starting each concept.
 */

import React from 'react';
import { Card } from '../atoms/Card';
import { Check, Play } from 'lucide-react';

interface Concept {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
  progress: number;
}

interface ConceptListProps {
  concepts: Concept[];
  onConceptClick: (conceptId: string) => void;
}

export function ConceptList({ concepts, onConceptClick }: ConceptListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Concepts</h3>
      
      <div className="space-y-2">
        {concepts.map((concept) => (
          <Card
            key={concept.id}
            className="transition-all duration-200 cursor-pointer hover:shadow-md"
            onClick={() => onConceptClick(concept.id)}
          >
            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {concept.completed ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 text-gray-900 dark:text-gray-100">
                    {concept.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {concept.description}
                  </p>
                </div>

                {/* Play Button */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-teal-500 hover:bg-teal-600 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                    <Play className="h-4 w-4 text-white fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 