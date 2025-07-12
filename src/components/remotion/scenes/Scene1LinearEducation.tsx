import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';

interface Scene1Props {
  frame: number;
  totalFrames: number;
}

export const Scene1LinearEducation: React.FC<Scene1Props> = ({ frame, totalFrames }) => {
  const { fps } = useVideoConfig();

  // Subject data
  const subjects = [
    { name: 'Mathematics', color: '#8B5CF6', icon: '∑' },
    { name: 'Science', color: '#06B6D4', icon: '🔬' },
    { name: 'Literature', color: '#EC4899', icon: '📚' }
  ];

  // Animation timing
  const subjectAppearDelay = 20; // frames between each subject
  const lineStartFrame = 60; // when line starts extending

  // Spring animations for subjects
  const getSubjectAnimation = (index: number) => {
    return spring({
      frame: frame - (index * subjectAppearDelay),
      fps,
      config: {
        damping: 15,
        stiffness: 200,
      },
    });
  };

  // Line extension animation
  const lineProgress = interpolate(
    frame,
    [lineStartFrame, totalFrames - 10],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill>
      {/* Title */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Traditional Education
      </div>

      {/* Central node */}
      <div
        style={{
          position: 'absolute',
          left: '20%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          backgroundColor: '#4FD1C5',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(79, 209, 197, 0.6)',
        }}
      />

      {/* Subjects stack */}
      {subjects.map((subject, index) => {
        const subjectScale = getSubjectAnimation(index);
        const subjectOpacity = interpolate(
          frame - (index * subjectAppearDelay),
          [0, 20],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={subject.name}
            style={{
              position: 'absolute',
              left: '20%',
              top: `${35 + (index * 10)}%`,
              transform: `translate(-50%, -50%) scale(${subjectScale})`,
              opacity: subjectOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              backgroundColor: subject.color,
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              fontSize: '1.1rem',
              fontFamily: 'Inter, sans-serif',
              boxShadow: `0 4px 15px ${subject.color}40`,
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>{subject.icon}</span>
            {subject.name}
          </div>
        );
      })}

      {/* Horizontal line extending right */}
      <svg
        style={{
          position: 'absolute',
          left: '22%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '60%',
          height: '4px',
        }}
      >
        <line
          x1="0"
          y1="2"
          x2={`${lineProgress * 100}%`}
          y2="2"
          stroke="#4FD1C5"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Arrow at the end */}
        {lineProgress > 0.8 && (
          <polygon
            points={`${lineProgress * 100 - 2},0 ${lineProgress * 100 + 8},2 ${lineProgress * 100 - 2},4`}
            fill="#4FD1C5"
          />
        )}
      </svg>

      {/* Subtitle */}
      <div 
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#94a3b8',
          fontSize: '1.3rem',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        }}
      >
        A straight line from start to finish
      </div>
    </AbsoluteFill>
  );
};