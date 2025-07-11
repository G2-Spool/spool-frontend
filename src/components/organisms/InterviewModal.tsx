import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, Mic, MicOff } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { cn } from '../../utils/cn';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInterestsExtracted?: (interests: Array<{ interest: string; category: string; strength: number }>) => void;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  onInterestsExtracted,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize the interview when modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startInterview();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = async () => {
    try {
      // Add initial system message
      const systemMessage: Message = {
        id: 'system-1',
        role: 'system',
        content: "Hi! I'm here to learn about your interests. What do you enjoy doing for fun? It could be anything - hobbies, activities, games, or things you're curious about!",
        timestamp: new Date(),
      };
      setMessages([systemMessage]);

      // Debug logging
      console.log('Starting interview...');
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
      console.log('Interview endpoint:', API_ENDPOINTS.interview.start);
      console.log('Full URL:', `${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINTS.interview.start}`);
      console.log('Student ID:', user?.id);

      // Start interview session
      const response = await api.post<{ sessionId: string }>(API_ENDPOINTS.interview.start, {
        studentId: user?.id,
        type: 'text', // Using text-based interview instead of voice
      });
      
      console.log('Interview started successfully:', response);
      setSessionId(response.sessionId);
    } catch (error: any) {
      console.error('Failed to start interview:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      toast.error('Failed to start interview. Please try again.');
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !sessionId) return;

    const messageText = inputValue.trim();
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending message...');
      console.log('Session ID:', sessionId);
      console.log('Message:', messageText);
      console.log('Endpoint:', `/api/interview/${sessionId}/message`);
      
      // Send message to backend
      const response = await api.post<{
        reply: string;
        interests?: Array<{ interest: string; category: string; strength: number }>;
        isComplete?: boolean;
      }>(`/api/interview/${sessionId}/message`, {
        message: messageText,
      });

      console.log('Message response:', response);

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // If interests were extracted, save them
      if (response.interests && response.interests.length > 0) {
        console.log('Interests extracted:', response.interests);
        await saveInterests(response.interests);
        onInterestsExtracted?.(response.interests);
      }

      // If interview is complete, show completion message
      if (response.isComplete) {
        setTimeout(() => {
          toast.success('Thanks for sharing your interests!');
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveInterests = async (interests: Array<{ interest: string; category: string; strength: number }>) => {
    try {
      // Save interests to student profile via API
      await api.put(API_ENDPOINTS.studentProfile.interests, {
        interests,
      });

      // Also save to progress service for RDS storage
      await api.post('/api/progress/interests', {
        studentId: user?.id,
        interests,
      });
    } catch (error) {
      console.error('Failed to save interests:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-2xl h-[80vh] flex flex-col bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100">
              Let's Learn About Your Interests
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Have a quick chat to help us personalize your learning journey
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-teal-500 text-white'
                    : message.role === 'system'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={cn(
                  'text-xs mt-1',
                  message.role === 'user'
                    ? 'text-teal-100'
                    : 'text-gray-500 dark:text-gray-500'
                )}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className="rounded-full"
              disabled
              title="Voice input coming soon"
            >
              {isVoiceEnabled ? (
                <Mic className="h-5 w-5 text-teal-500" />
              ) : (
                <MicOff className="h-5 w-5 text-gray-400" />
              )}
            </Button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="rounded-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};