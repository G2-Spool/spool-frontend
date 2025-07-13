import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

export const TestThreadCreation: React.FC = () => {
  const { user, studentProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [profileId, setProfileId] = useState('');

  useEffect(() => {
    if (studentProfile?.id) {
      setProfileId(studentProfile.id);
    }
  }, [studentProfile]);

  const testThreadCreation = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const proposal = {
        goal: 'I want to learn how to build a mobile app',
        objectives: ['Learn mobile app development basics'],
        depth_preference: 'moderate',
        motivation: 'User expressed curiosity',
        confidence_score: 0.9,
        suggested_title: 'Building Your First Mobile App'
      };

      console.log('Testing thread creation with:', {
        proposal,
        studentProfileId: profileId
      });

      const { data, error: edgeError } = await supabase.functions.invoke('thread-generation', {
        body: {
          proposal,
          studentProfileId: profileId
        }
      });

      if (edgeError) {
        setError(edgeError);
        console.error('Edge function error:', edgeError);
      } else {
        setResult(data);
        console.log('Success:', data);
      }
    } catch (err: any) {
      setError(err);
      console.error('Exception:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Thread Creation</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>User:</strong> {user?.email || 'Not logged in'}</p>
        <p><strong>Profile ID:</strong> {profileId || 'No profile'}</p>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Profile ID (override):</label>
        <input
          type="text"
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter profile ID"
        />
      </div>

      <button
        onClick={testThreadCreation}
        disabled={isLoading || !profileId}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Thread Creation'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <pre className="mt-2 text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <h3 className="font-bold">Success!</h3>
          <pre className="mt-2 text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}; 