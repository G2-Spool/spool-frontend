import React from 'react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';

export interface ChatBubbleProps {
  message: string;
  sender: 'student' | 'ai' | 'system';
  timestamp: Date;
  isTyping?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  sender,
  timestamp,
  isTyping = false,
}) => {
  const bubbleClasses = {
    student: 'bg-student-bubble text-white self-end rounded-br-sm',
    ai: 'bg-gray-100 text-gray-800 self-start rounded-bl-sm',
    system: 'bg-gray-50 text-gray-600 self-center text-center italic',
  };

  const containerClasses = {
    student: 'items-end',
    ai: 'items-start',
    system: 'items-center',
  };

  return (
    <div className={cn('flex flex-col mb-4', containerClasses[sender])}>
      <div
        className={cn(
          'max-w-[70%] px-4 py-3 rounded-lg',
          bubbleClasses[sender],
          isTyping && 'min-w-[80px]'
        )}
      >
        {isTyping ? (
          <div className="flex gap-1 items-center justify-center">
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        )}
      </div>
      {!isTyping && sender !== 'system' && (
        <span className="text-xs text-gray-500 mt-1 px-4">
          {format(timestamp, 'h:mm a')}
        </span>
      )}
    </div>
  );
};