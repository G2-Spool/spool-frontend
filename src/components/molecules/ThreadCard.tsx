import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../atoms/Badge';
import { cn } from '../../utils/cn';

interface ThreadCardProps {
  threadId: string;
  userInput: string;
  analysis: {
    subjects: string[];
    topics: string[];
    summary: string;
  };
  sectionCount: number;
  estimatedReadTime?: number;
  completionPercentage?: number;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  threadId,
  userInput,
  analysis,
  sectionCount,
  estimatedReadTime = 15,
  completionPercentage = 0
}) => {
  // Generate a short, meaningful title based on the thread content
  const generateTitle = () => {
    const primarySubject = analysis.subjects[0];
    const primaryTopic = analysis.topics[0];
    
    // Create title based on subject and topic
    if (primarySubject && primaryTopic) {
      return `${primarySubject}: ${primaryTopic}`;
    } else if (primarySubject) {
      return `${primarySubject} Study`;
    } else if (primaryTopic) {
      return primaryTopic;
    }
    
    // Fallback to first few words if no analysis available
    const words = userInput.split(' ');
    if (words.length <= 3) return userInput;
    return `${words.slice(0, 3).join(' ')} Guide`;
  };

  // Thread color gradient
  const threadColor = "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)";
  
  return (
    <Link
      to={`/thread/${threadId}`}
      className="block"
    >
      <div
        className={cn(
          "w-80 flex-shrink-0 cursor-pointer group relative",
          "transition-all duration-200 ease-out",
          "hover:shadow-lg hover:shadow-black/5",
          "active:scale-98",
          "rounded-2xl overflow-hidden",
          "border border-gray-300 dark:border-gray-700",
        )}
      >
        <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          {/* Colored header section */}
          <div 
            className="h-40 p-5 text-white relative overflow-hidden" 
            style={{ background: threadColor }}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-white/15 transition-colors duration-200" />
            
            <div className="relative z-10">
              <h3 className="font-semibold text-2xl leading-tight mb-2">
                {generateTitle()}
              </h3>
              <p className="text-base opacity-90 line-clamp-2">
                {analysis.summary.length > 80 ? `${analysis.summary.substring(0, 80)}...` : analysis.summary}
              </p>
            </div>
          </div>
          
          {/* Stats section with enhanced background */}
          <div className="relative transition-colors duration-200" style={{ backgroundColor: '#1a202c' }}>
            <div className="absolute inset-0 bg-transparent group-hover:bg-white/[0.075] transition-colors duration-200" />
            <div className="relative z-10 px-3 py-4 space-y-4">

              
              {/* Subject Tags */}
              <div className="flex flex-wrap gap-1.5">
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

              {/* Stats section */}
              <div className="flex justify-around items-center text-base pt-2">
                <div className="text-center">
                  <div className="font-bold text-white text-2xl">
                    {sectionCount}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Concepts
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-white text-2xl">
                    {estimatedReadTime}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Minutes
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-white text-2xl">
                    {completionPercentage}%
                  </div>
                  <div className="text-gray-300 text-sm">
                    Complete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};