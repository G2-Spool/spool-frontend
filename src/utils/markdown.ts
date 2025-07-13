import React from 'react';

export interface MarkdownTextProps {
  text: string;
  className?: string;
}

export const parseMarkdownText = (text: string): React.ReactNode[] => {
  if (!text) return [];
  
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let key = 0;
  
  // Regular expression to match ** (bold) and * (italic) patterns
  const markdownRegex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  
  let match;
  while ((match = markdownRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = markdownRegex.lastIndex;
    
    // Add text before the match
    if (matchStart > currentIndex) {
      parts.push(text.substring(currentIndex, matchStart));
    }
    
    // Add the formatted text
    if (match[1]) {
      // Bold text (**text**)
      parts.push(
        React.createElement('strong', { key: key++, className: 'font-semibold' }, match[2])
      );
    } else if (match[3]) {
      // Italic text (*text*)
      parts.push(
        React.createElement('em', { key: key++, className: 'italic' }, match[4])
      );
    }
    
    currentIndex = matchEnd;
  }
  
  // Add remaining text after the last match
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }
  
  return parts;
};

export const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className = '' }) => {
  const parsedContent = parseMarkdownText(text);
  
  return React.createElement(
    'span',
    { className },
    parsedContent.map((part, index) => 
      React.createElement(React.Fragment, { key: index }, part)
    )
  );
}; 