import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';

interface Scene3Props {
  frame: number;
  totalFrames: number;
}

export const Scene3SpoolOrganizes: React.FC<Scene3Props> = ({ frame, totalFrames }) => {
  const { width, height, fps } = useVideoConfig();

  // Animation phases
  const convergenceStart = 0;
  const convergenceEnd = 40;
  const spoolStart = 30;
  const spoolEnd = totalFrames;

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Convergence progress - tangled lines coming together
  const convergenceProgress = interpolate(
    frame,
    [convergenceStart, convergenceEnd],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Spool animation with spring
  const spoolSpring = spring({
    frame: frame - spoolStart,
    fps,
    config: {
      damping: 20,
      stiffness: 100,
    },
  });

  const spoolProgress = interpolate(
    frame,
    [spoolStart, spoolEnd],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Generate spiral path for spool
  const generateSpoolPath = (turns: number, progress: number) => {
    const centerX = width * 0.75;
    const centerY = height * 0.5;
    const maxRadius = 80;
    
    const points = [];
    const totalPoints = Math.floor(turns * 20 * progress);
    
    for (let i = 0; i <= totalPoints; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      const radius = (i / (turns * 20)) * maxRadius;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * 0.6; // Flatten for spool effect
      
      points.push({ x, y });
    }
    
    return points;
  };

  // Create organized line path
  const generateOrganizedPath = (progress: number) => {
    const startX = width * 0.2;
    const startY = height * 0.5;
    const endX = width * 0.7;
    const endY = height * 0.5;
    
    const pathLength = progress * (endX - startX);
    return `M ${startX} ${startY} L ${startX + pathLength} ${endY}`;
  };

  // Spool thread points
  const spoolPoints = generateSpoolPath(4, spoolProgress);
  
  // Create path string for spool
  const createSpoolPathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

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
          opacity: titleOpacity,
        }}
      >
        Spool Organizes the Mess
      </div>

      {/* Central starting node */}
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
          zIndex: 10,
        }}
      />

      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Initial tangled lines (fading out during convergence) */}
        {convergenceProgress < 1 && (
          <g opacity={1 - convergenceProgress}>
            <path
              d={`M ${width * 0.2} ${height * 0.35} Q ${width * 0.4} ${height * 0.2} ${width * 0.6} ${height * 0.4} Q ${width * 0.5} ${height * 0.6} ${width * 0.7} ${height * 0.3}`}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="4"
              opacity={0.6}
            />
            <path
              d={`M ${width * 0.2} ${height * 0.45} Q ${width * 0.45} ${height * 0.7} ${width * 0.55} ${height * 0.3} Q ${width * 0.65} ${height * 0.8} ${width * 0.75} ${height * 0.4}`}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="4"
              opacity={0.6}
            />
            <path
              d={`M ${width * 0.2} ${height * 0.55} Q ${width * 0.35} ${height * 0.8} ${width * 0.5} ${height * 0.2} Q ${width * 0.7} ${height * 0.9} ${width * 0.8} ${height * 0.5}`}
              fill="none"
              stroke="#EC4899"
              strokeWidth="4"
              opacity={0.6}
            />
          </g>
        )}

        {/* Convergence lines - tangled lines straightening */}
        {convergenceProgress > 0 && (
          <g>
            <path
              d={generateOrganizedPath(convergenceProgress)}
              fill="none"
              stroke="#4FD1C5"
              strokeWidth="6"
              strokeLinecap="round"
              opacity={interpolate(convergenceProgress, [0, 1], [0, 1])}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(79, 209, 197, 0.6))'
              }}
            />
          </g>
        )}

        {/* Spool - circular thread winding */}
        {spoolProgress > 0 && (
          <g>
            {/* Spool base/cylinder */}
            <ellipse
              cx={width * 0.75}
              cy={height * 0.5}
              rx="100"
              ry="25"
              fill="none"
              stroke="#64748b"
              strokeWidth="3"
              opacity={spoolSpring}
            />
            <ellipse
              cx={width * 0.75}
              cy={height * 0.45}
              rx="100"
              ry="25"
              fill="none"
              stroke="#64748b"
              strokeWidth="3"
              opacity={spoolSpring}
            />
            
            {/* Spool sides */}
            <line
              x1={width * 0.75 - 100}
              y1={height * 0.45 + 25}
              x2={width * 0.75 - 100}
              y2={height * 0.5 + 25}
              stroke="#64748b"
              strokeWidth="3"
              opacity={spoolSpring}
            />
            <line
              x1={width * 0.75 + 100}
              y1={height * 0.45 + 25}
              x2={width * 0.75 + 100}
              y2={height * 0.5 + 25}
              stroke="#64748b"
              strokeWidth="3"
              opacity={spoolSpring}
            />

            {/* Wound thread */}
            <path
              d={createSpoolPathString(spoolPoints)}
              fill="none"
              stroke="#4FD1C5"
              strokeWidth="4"
              strokeLinecap="round"
              opacity={spoolSpring}
              style={{
                filter: 'drop-shadow(0 0 6px rgba(79, 209, 197, 0.4))'
              }}
            />
            
            {/* Multiple thread layers for depth */}
            {spoolProgress > 0.5 && (
              <>
                <path
                  d={createSpoolPathString(generateSpoolPath(3.5, spoolProgress - 0.1))}
                  fill="none"
                  stroke="#4FD1C5"
                  strokeWidth="3"
                  opacity={0.6}
                />
                <path
                  d={createSpoolPathString(generateSpoolPath(3, spoolProgress - 0.2))}
                  fill="none"
                  stroke="#4FD1C5"
                  strokeWidth="2"
                  opacity={0.4}
                />
              </>
            )}
          </g>
        )}
      </svg>

      {/* Organized subject labels appearing around spool */}
      {spoolProgress > 0.7 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: `${75}%`,
              top: `${30}%`,
              transform: 'translate(-50%, -50%)',
              padding: '10px 16px',
              backgroundColor: '#8B5CF6',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
              opacity: spoolSpring,
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
            }}
          >
            Mathematics ∑
          </div>
          
          <div
            style={{
              position: 'absolute',
              left: `${85}%`,
              top: `${50}%`,
              transform: 'translate(-50%, -50%)',
              padding: '10px 16px',
              backgroundColor: '#06B6D4',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
              opacity: spoolSpring * 0.9,
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
            }}
          >
            Science 🔬
          </div>
          
          <div
            style={{
              position: 'absolute',
              left: `${75}%`,
              top: `${70}%`,
              transform: 'translate(-50%, -50%)',
              padding: '10px 16px',
              backgroundColor: '#EC4899',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
              opacity: spoolSpring * 0.8,
              boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
            }}
          >
            Literature 📚
          </div>
        </>
      )}

      {/* Spool logo/brand element */}
      {spoolProgress > 0.8 && (
        <div
          style={{
            position: 'absolute',
            right: '10%',
            top: '20%',
            color: '#4FD1C5',
            fontSize: '3rem',
            fontWeight: 'bold',
            fontFamily: 'Inter, sans-serif',
            opacity: interpolate(frame, [spoolEnd - 20, spoolEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            textShadow: '0 0 20px rgba(79, 209, 197, 0.5)',
          }}
        >
          SPOOL
        </div>
      )}

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
        Organizing knowledge into clear, connected lessons
      </div>
    </AbsoluteFill>
  );
};