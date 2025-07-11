import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../atoms/Dialog';
import { Button } from '../atoms/Button';
import { useCreateThread } from '../../hooks/useThread';
import { useNavigate } from 'react-router-dom';
import { Brain, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const CreateThreadDialog: React.FC<CreateThreadDialogProps> = ({
  isOpen,
  onClose,
  userId = 'anonymous'
}) => {
  const [userInput, setUserInput] = useState('');
  const navigate = useNavigate();
  const { mutate: createThread, isPending } = useCreateThread();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      toast.error('Please enter a question or topic');
      return;
    }
    
    createThread(
      { userInput, userId },
      {
        onSuccess: (thread) => {
          toast.success('Thread created successfully!');
          onClose();
          navigate(`/thread/${thread.threadId}`);
        },
        onError: (error) => {
          toast.error('Failed to create thread. Please try again.');
          console.error('Thread creation error:', error);
        }
      }
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Create a Learning Thread
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to learn about?
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="E.g., How does photosynthesis relate to cellular respiration? or Explain the connection between calculus and physics..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
              disabled={isPending}
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask about any academic topic, concept, or how different subjects connect.
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
              <div className="text-sm text-purple-800">
                <p className="font-medium mb-1">AI-Powered Analysis</p>
                <p>Our AI will analyze your question to identify relevant subjects, topics, and concepts, 
                   then find the most relevant educational content from our knowledge base.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !userInput.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Thread...
                </>
              ) : (
                'Create Thread'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};