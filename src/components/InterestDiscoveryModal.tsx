import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

interface InterestWithDetails {
  interest: string;
  details: string;
  discovered_at: string;
}

interface InterestDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  onInterestsUpdated?: (interests: InterestWithDetails[]) => void;
}

export function InterestDiscoveryModal({ 
  isOpen, 
  onClose, 
  studentId,
  onInterestsUpdated 
}: InterestDiscoveryModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedInterests, setExtractedInterests] = useState<InterestWithDetails[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    console.log('Submitting interests text:', inputValue);

    try {
      console.log('Calling interest-discovery edge function...');
      const { data, error } = await supabase.functions.invoke('interest-discovery', {
        body: { 
          action: 'extract_interests', 
          studentId,
          text: inputValue.trim()
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data || !data.success) {
        throw new Error('Failed to extract interests');
      }

      setExtractedInterests(data.interests);

      // Notify parent component
      if (data.interests.length > 0 && onInterestsUpdated) {
        onInterestsUpdated(data.interests);
      }

      toast.success(`Discovered ${data.interests.length} interests!`);
      
      // Clear form and close after a short delay
      setTimeout(() => {
        setInputValue('');
        setExtractedInterests([]);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error processing interests:', error);
      toast.error('Failed to process your interests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tell Us About Your Interests
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
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Tell us about your hobbies, activities you enjoy, subjects that fascinate you, 
            or anything you're curious about. The more details you share, the better we can 
            personalize your learning experience!
          </p>

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="I love playing basketball because I enjoy the teamwork and strategy. I'm also really into cooking, especially trying new recipes from different cultures. Recently I've been curious about how artificial intelligence works..."
            className="flex-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
            disabled={isLoading}
            rows={8}
          />

          {/* Extracted Interests Preview */}
          {extractedInterests.length > 0 && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Discovered interests:</p>
              <div className="flex flex-wrap gap-2">
                {extractedInterests.map((interest, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                      {interest.interest}
                    </span>
                    {interest.details && (
                      <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {interest.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Discover My Interests
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 