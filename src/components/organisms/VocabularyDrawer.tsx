import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '../../utils/cn';

interface VocabularyTerm {
  term: string;
  definition: string;
  type: 'vocabulary' | 'equation' | 'concept';
}

interface VocabularyDrawerProps {
  newTerms?: string[];
  onClearNewTerms?: () => void;
  className?: string;
}

// Mock vocabulary terms - this should be dynamic based on the concept
const vocabularyTerms: VocabularyTerm[] = [
  { term: 'Variable', definition: 'The letter representing the unknown value you\'re looking for (like x).', type: 'vocabulary' },
  { term: 'Coefficient', definition: 'The number attached to the variable (the 2 in 2x).', type: 'vocabulary' },
  { term: 'Constant', definition: 'A number without a variable (the 5 and 15 in 2x + 5 = 15).', type: 'vocabulary' },
  { term: 'PEMDAS', definition: 'Parentheses, Exponents, Multiplication/Division, Addition/Subtraction - the order of operations.', type: 'concept' },
  { term: '2x + 5 = 15', definition: 'A two-step linear equation where x is multiplied by 2, then 5 is added, equaling 15.', type: 'equation' },
  { term: '15m + 20 = 80', definition: 'A two-step linear equation representing the gym membership problem.', type: 'equation' },
  { term: '10x + 4 = 24', definition: 'A practice two-step linear equation for the sub-exercise.', type: 'equation' }
];

export const VocabularyDrawer: React.FC<VocabularyDrawerProps> = ({
  newTerms = [],
  onClearNewTerms,
  className
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const termRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newTerms.length > 0) {
      setShouldAnimate(true);
      
      // Scroll to the latest clicked term within the sidebar container only
      const latestTerm = newTerms[newTerms.length - 1];
      const termElement = termRefs.current[latestTerm];
      if (termElement && containerRef.current) {
        const container = containerRef.current;
        const termRect = termElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate the scroll position to center the term within the container
        const termTop = termElement.offsetTop;
        const containerHeight = container.clientHeight;
        const termHeight = termElement.clientHeight;
        const scrollTo = termTop - (containerHeight / 2) + (termHeight / 2);
        
        container.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
      
      const timer = setTimeout(() => {
        setShouldAnimate(false);
        onClearNewTerms?.();
      }, 4100);
      
      return () => clearTimeout(timer);
    }
  }, [newTerms.length, onClearNewTerms]);

  return (
    <div ref={containerRef} className={cn("h-full overflow-y-auto", className)}>
      <div className="p-4">
        <div className="space-y-6">
          {/* Vocabulary Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Vocabulary
            </h4>
            <div className="space-y-0">
              {vocabularyTerms.filter(term => term.type === 'vocabulary').map((vocab, index, arr) => (
                <div key={vocab.term}>
                  <div 
                    ref={(el) => { termRefs.current[vocab.term] = el; }}
                    className={cn(
                      "p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg",
                      newTerms.includes(vocab.term) && shouldAnimate && "animate-pulse border-2 border-white"
                    )}
                    style={{
                      animationDelay: newTerms.includes(vocab.term) && shouldAnimate ? `${index * 0.1}s` : '0s'
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#4FD1C5]" />
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{vocab.term}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{vocab.definition}</p>
                      </div>
                    </div>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="mx-3 border-b border-gray-200 dark:border-gray-700"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Equations Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Equations
            </h4>
            <div className="space-y-0">
              {vocabularyTerms.filter(term => term.type === 'equation').map((vocab, index, arr) => (
                <div key={vocab.term}>
                  <div 
                    ref={(el) => { termRefs.current[vocab.term] = el; }}
                    className={cn(
                      "p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg",
                      newTerms.includes(vocab.term) && shouldAnimate && "animate-pulse border-2 border-white"
                    )}
                    style={{
                      animationDelay: newTerms.includes(vocab.term) && shouldAnimate ? `${index * 0.1}s` : '0s'
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#805AD5]" />
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{vocab.term}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{vocab.definition}</p>
                      </div>
                    </div>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="mx-3 border-b border-gray-200 dark:border-gray-700"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Concepts Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Concepts
            </h4>
            <div className="space-y-0">
              {vocabularyTerms.filter(term => term.type === 'concept').map((vocab, index, arr) => (
                <div key={vocab.term}>
                  <div 
                    ref={(el) => { termRefs.current[vocab.term] = el; }}
                    className={cn(
                      "p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg",
                      newTerms.includes(vocab.term) && shouldAnimate && "animate-pulse border-2 border-white"
                    )}
                    style={{
                      animationDelay: newTerms.includes(vocab.term) && shouldAnimate ? `${index * 0.1}s` : '0s'
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#ED64A6]" />
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{vocab.term}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{vocab.definition}</p>
                      </div>
                    </div>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="mx-3 border-b border-gray-200 dark:border-gray-700"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 