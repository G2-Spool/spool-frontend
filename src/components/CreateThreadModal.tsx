import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

export function CreateThreadModal({ 
  isOpen, 
  onClose, 
  studentId
}: CreateThreadModalProps) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    console.log('Creating thread with curiosity:', inputValue);

    try {
      // First, create a simple proposal from the curiosity text
      const proposal = {
        goal: inputValue.trim(),
        objectives: [inputValue.trim()], // Simple objective for now
        depth_preference: 'moderate',
        motivation: 'User expressed curiosity',
        confidence_score: 0.9,
        suggested_title: inputValue.length > 50 
          ? inputValue.substring(0, 50) + '...' 
          : inputValue
      };

      console.log('Calling thread-generation edge function with proposal:', proposal);
      const { data, error } = await supabase.functions.invoke('thread-generation', {
        body: { 
          proposal,
          studentProfileId: studentId
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data || !data.success) {
        throw new Error('Failed to create thread');
      }

      toast.success('Thread created successfully!');
      
      // Navigate to the new thread
      if (data.thread?.id) {
        navigate(`/threads/${data.thread.id}`);
      } else {
        // Fallback to threads page if no ID returned
        navigate('/threads');
      }
      
      // Clear form and close
      setInputValue('');
      onClose();
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-teal-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              What are you curious about?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Tell us what you'd like to learn about. We'll create a personalized learning thread 
            tailored to your curiosity and current knowledge level.
          </p>

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="I want to learn how to build a mobile app..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white resize-none"
            disabled={isLoading}
            rows={4}
            autoFocus
          />

          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Example topics:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "How machine learning works",
                "Building a web application",
                "Understanding cryptocurrency",
                "Creative writing techniques",
                "Music theory basics"
              ].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setInputValue(example)}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="mt-6 w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Your Thread...
              </>
            ) : (
              <>
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 