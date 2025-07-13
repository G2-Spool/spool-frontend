import React from 'react';
import { useHardcodedThread, useThreadConcepts, HARDCODED_THREAD_ID } from '../hooks/useThreadData';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { useNavigate } from 'react-router-dom';

export const TestSupabaseIntegration: React.FC = () => {
  const navigate = useNavigate();
  const { data: thread, isLoading: threadLoading, error: threadError } = useHardcodedThread();
  const { data: concepts, isLoading: conceptsLoading, error: conceptsError } = useThreadConcepts(HARDCODED_THREAD_ID);

  if (threadLoading || conceptsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600 dark:text-gray-400">Loading data from Supabase...</p>
        </Card>
      </div>
    );
  }

  if (threadError || conceptsError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400">{threadError?.message || conceptsError?.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Supabase Integration Test</h1>
        
        {/* Thread Data */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Thread Data</h2>
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {thread?.id}</p>
            <p><strong>Title:</strong> {thread?.title}</p>
            <p><strong>Description:</strong> {thread?.situation_description}</p>
            <p><strong>Concepts:</strong> {JSON.stringify(thread?.concepts)}</p>
          </div>
        </Card>

        {/* Concept Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Concept Content ({concepts?.length} concepts)</h2>
          {concepts?.map((concept) => (
            <Card key={concept.id} className="p-6">
              <h3 className="text-lg font-bold mb-4">{concept.concept_name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-purple-600">Hook:</p>
                  <p><strong>{concept.hook_title}</strong></p>
                  <p className="text-gray-600 dark:text-gray-400">{concept.hook_content.substring(0, 150)}...</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-600">Example:</p>
                  <p><strong>{concept.example_title}</strong></p>
                  <p className="text-gray-600 dark:text-gray-400">{concept.example_scenario.substring(0, 150)}...</p>
                </div>
                <div>
                  <p className="font-semibold text-cyan-600">Approach:</p>
                  <p><strong>{concept.approach_title}</strong></p>
                  <p className="text-gray-600 dark:text-gray-400">Steps: {concept.approach_steps.length}</p>
                </div>
                <div>
                  <p className="font-semibold text-red-600">Non-Example:</p>
                  <p><strong>{concept.nonexample_title}</strong></p>
                  <p className="text-gray-600 dark:text-gray-400">{concept.nonexample_scenario.substring(0, 150)}...</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => navigate(`/thread/${HARDCODED_THREAD_ID}`)}
                >
                  View in ThreadPage
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    // Navigate to LearningPage with this concept
                    const params = new URLSearchParams({
                      conceptId: concept.concept_id,
                      threadId: HARDCODED_THREAD_ID
                    });
                    navigate(`/learning?${params.toString()}`);
                  }}
                >
                  View in LearningPage
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}; 