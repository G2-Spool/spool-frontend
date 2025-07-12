import React, { Suspense } from 'react';
import { Player } from '@remotion/player';
import { SimpleDemo } from './SimpleDemo';

interface SpoolPlayerProps {
  className?: string;
}

export const SpoolPlayer: React.FC<SpoolPlayerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="relative">
        <Suspense fallback={
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl h-96">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading animation...</p>
            </div>
          </div>
        }>
          <Player
            component={SimpleDemo}
            durationInFrames={150}
            compositionWidth={1200}
            compositionHeight={600}
            fps={30}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            }}
            controls={true}
            loop={true}
            autoPlay={false}
            showVolumeControls={false}
            clickToPlay={true}
            inputProps={{}}
            errorFallback={({ error }) => (
              <div className="flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-xl h-96 border border-red-200 dark:border-red-800">
                <div className="text-center space-y-4">
                  <div className="text-red-600 dark:text-red-400 text-lg">⚠️ Animation Error</div>
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error?.message || 'Failed to load Remotion demo'}
                  </p>
                </div>
              </div>
            )}
          />
        </Suspense>
      </div>
    </div>
  );
};