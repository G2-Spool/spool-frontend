import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const SimpleDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { } = useVideoConfig();

  // Simple animations to test if Remotion is working
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 60], [0.5, 1], { extrapolateRight: 'clamp' });
  const rotate = interpolate(frame, [60, 120], [0, 360], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      {/* Title */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center',
          opacity,
        }}
      >
        Spool Education Demo
      </div>

      {/* Animated Circle */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
          width: '100px',
          height: '100px',
          backgroundColor: '#4FD1C5',
          borderRadius: '50%',
          opacity,
        }}
      />

      {/* Animated Text */}
      <div 
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#94a3b8',
          fontSize: '1.5rem',
          textAlign: 'center',
          opacity: interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp' })
        }}
      >
        Learning transformed through personalization
      </div>
    </AbsoluteFill>
  );
};