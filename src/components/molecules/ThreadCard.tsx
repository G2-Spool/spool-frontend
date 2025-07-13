import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../atoms/Badge';
import { 
  MessageSquare, 
  Brain, 
  ArrowRight,
} from 'lucide-react';
import ThreadGraph from './ThreadGraph';
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
  const [isGraphVisible, setIsGraphVisible] = useState(false);
  const [graphPosition, setGraphPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Calculate position for ThreadGraph
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setGraphPosition({
        x: rect.right + 10, // Position to the right of the card
        y: rect.top
      });
    }

    // Set timeout to show graph after 300ms to prevent accidental triggers
    hoverTimeoutRef.current = setTimeout(() => {
      setIsGraphVisible(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    // Clear timeout if user leaves before graph appears
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Hide graph immediately
    setIsGraphVisible(false);
  };

  const handleGraphClose = () => {
    setIsGraphVisible(false);
  };

  // Thread color gradient
  const threadColor = "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)";
  
  return (
    <>
      <Link
        to={`/thread/${threadId}`}
        className="block"
      >
        <div
          ref={cardRef}
          className={cn(
            "w-80 flex-shrink-0 cursor-pointer group relative",
            "transition-all duration-200 ease-out",
            "hover:shadow-lg hover:shadow-black/5",
            "active:scale-98",
            "rounded-2xl overflow-hidden",
            "border border-gray-300 dark:border-gray-700",
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            {/* Colored header section */}
            <div 
              className="h-40 p-5 text-white relative overflow-hidden" 
              style={{ background: threadColor }}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-white/15 transition-colors duration-200" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium text-white opacity-90">{formatTimeAgo(createdAt)}</span>
                </div>
                <h3 className="font-semibold text-xl leading-tight mb-2">
                  Learning Thread
                </h3>
                <p className="text-base opacity-90 line-clamp-2 italic">
                  "{userInput}"
                </p>
              </div>
            </div>
            
            {/* Stats section with enhanced background */}
            <div className="relative transition-colors duration-200" style={{ backgroundColor: '#1a202c' }}>
              <div className="absolute inset-0 bg-transparent group-hover:bg-white/[0.075] transition-colors duration-200" />
              <div className="relative z-10 px-3 py-4 space-y-4">
                
                {/* AI Analysis Summary */}
                <div className="p-3 bg-teal-900/40 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-teal-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-teal-300 line-clamp-2">
                        {analysis.summary}
                      </p>
                    </div>
                  </div>
                </div>
                
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
                      Sections
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
                    <div className="font-bold text-white text-2xl flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-gray-300 text-sm">
                      Continue
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* ThreadGraph overlay */}
      <ThreadGraph
        threadId={threadId}
        isVisible={isGraphVisible}
        position={graphPosition}
        onClose={handleGraphClose}
      />
    </>
  );
};