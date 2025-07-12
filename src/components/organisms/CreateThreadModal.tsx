import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThreadCreated?: (threadId: string) => void;
}

interface Interest {
  interest: string;
  category: 'personal' | 'social' | 'career' | 'philanthropic';
  strength: number;
}

export const CreateThreadModal: React.FC<CreateThreadModalProps> = ({
  isOpen,
  onClose,
  onThreadCreated,
}) => {
  const { user, studentProfile } = useAuth();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInterests, setUserInterests] = useState<Interest[]>([]);

  // Load user interests when modal opens
  useEffect(() => {
    if (isOpen && studentProfile?.interests) {
      setUserInterests(studentProfile.interests || []);
    }
  }, [isOpen, studentProfile]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const question = inputValue.trim();
    setIsLoading(true);

    try {
      console.log('🚀 Creating thread with AcademiaSearch:', question);

      // Call AcademiaSearch lambda to create thread
      const response = await api.post<{
        threadId: string;
        message: string;
        topic?: string;
        category?: string;
      }>(API_ENDPOINTS.academiaSearch.createThread, {
        question: question,
        studentId: user?.id,
        studentProfile: {
          interests: userInterests,
          firstName: studentProfile?.firstName,
          grade: studentProfile?.grade,
        },
      });

      console.log('Thread created successfully:', response);
      
      if (response.threadId) {
        toast.success('Learning thread created successfully!');
        
        // Call the callback if provided
        onThreadCreated?.(response.threadId);
        
        // Navigate to thread page
        setTimeout(() => {
          navigate(`/thread/${response.threadId}`);
          onClose();
        }, 500);
      }
    } catch (error: any) {
      console.error('Failed to create thread:', error);
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || 'Failed to create thread. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInterestClick = (interest: string) => {
    // Add interest to the input
    setInputValue(prev => {
      const newValue = prev.trim();
      if (newValue) {
        return `${newValue} ${interest}`;
      }
      return `I want to learn about ${interest}`;
    });
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
      <Card className="relative w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-personal/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-personal" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100">
                  What are you curious about learning today?
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Ask any question and explore topics across all subjects
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full -mr-2 -mt-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question here... For example: 'How do computers understand human language?' or 'What causes thunderstorms?'"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-personal focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
              autoFocus
            />

            {/* Your Interests Section */}
            {userInterests.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Your interests (click to explore):
                </p>
                <div className="flex flex-wrap gap-2">
                  {userInterests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => handleInterestClick(interest.interest)}
                    >
                      {interest.interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Thread
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};