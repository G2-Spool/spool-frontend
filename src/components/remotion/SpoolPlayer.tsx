import React from 'react';
import { Player } from '@remotion/player';
import { SpoolEducationDemo } from './SpoolEducationDemo';

interface SpoolPlayerProps {
  className?: string;
}

export const SpoolPlayer: React.FC<SpoolPlayerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Player
        component={SpoolEducationDemo}
        durationInFrames={300}
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
        controls
        loop
        autoPlay
        showVolumeControls={false}
        clickToPlay
      />
    </div>
  );
};