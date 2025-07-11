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
    student: 'chat-bubble chat-bubble-student',
    ai: 'chat-bubble chat-bubble-ai',
    system: 'chat-bubble self-center text-center italic',
  };

  const containerClasses = {
    student: 'items-end',
    ai: 'items-start',
    system: 'items-center',
  };

  return (
    <div className={cn('flex flex-col', containerClasses[sender])}>
      <div
        className={cn(
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
          <p className="whitespace-pre-wrap">{message}</p>
        )}
      </div>
      {!isTyping && sender !== 'system' && (
        <span className="chat-timestamp">
          {format(timestamp, 'h:mm a')}
        </span>
      )}
    </div>
  );
};