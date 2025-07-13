import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { ArrowLeft } from 'lucide-react';

export const ConceptPage: React.FC = () => {
  const { topicId, conceptId } = useParams<{ topicId?: string; conceptId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    if (topicId) {
      // Navigate back to the topic page
      navigate(`/topic/${topicId}`);
    } else {
      // Fallback to threads page
      navigate('/threads');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {topicId ? 'Back to Topic' : 'Back to Classes'}
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Concept Learning
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Concept ID: {conceptId}
          </p>
        </div>

        {/* Main Content */}
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📚</span>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Learning Content Coming Soon
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                This concept's detailed learning content is being prepared. Soon you'll be able to learn through interactive content, exercises, and personalized explanations.
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleBack}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Return to Course
              </Button>
            </div>
          </div>
        </Card>

        {/* Future: This is where ConceptPresentation component would go */}
        {topicId && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Developer Note:</strong> This concept ({conceptId}) belongs to topic ({topicId}). 
              The full learning experience with interactive content, exercises, and progress tracking will be implemented here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};