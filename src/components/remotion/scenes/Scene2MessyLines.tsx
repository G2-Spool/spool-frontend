import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useVideoConfig,
} from 'remotion';

interface Scene2Props {
  frame: number;
  totalFrames: number;
}

export const Scene2MessyLines: React.FC<Scene2Props> = ({ frame, totalFrames }) => {
  const { width, height } = useVideoConfig();

  // Animation progress
  const progress = interpolate(frame, [0, totalFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Title animation
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Generate messy path data
  const generateMessyPath = (pathIndex: number, pathProgress: number) => {
    const startX = width * 0.2;
    const startY = height * (0.35 + pathIndex * 0.1);
    
    const points = [];
    const numPoints = 15;
    
    for (let i = 0; i <= numPoints * pathProgress; i++) {
      const t = i / numPoints;
      const baseX = startX + (width * 0.6 * t);
      
      // Create increasingly chaotic movement
      const chaos = Math.min(t * 2, 1);
      const noiseX = Math.sin(t * 12 + pathIndex * 2) * 50 * chaos;
      const noiseY = Math.cos(t * 8 + pathIndex * 3) * 80 * chaos;
      
      const x = baseX + noiseX;
      const y = startY + noiseY;
      
      points.push({ x, y });
    }
    
    return points;
  };

  // Create path string for SVG
  const createPathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) * 0.3;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * 0.3;
      const cp2y = curr.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  // Line animation progress (staggered)
  const getLineProgress = (lineIndex: number) => {
    const startFrame = lineIndex * 10; // Stagger by 10 frames
    return interpolate(
      frame,
      [startFrame, startFrame + 80],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  };

  const colors = ['#8B5CF6', '#06B6D4', '#EC4899'];

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
        But Life is Messy
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

      {/* Messy animated paths */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {colors.map((color, index) => {
          const lineProgress = getLineProgress(index);
          const pathPoints = generateMessyPath(index, lineProgress);
          const pathString = createPathString(pathPoints);

          return (
            <g key={index}>
              {/* Main path */}
              <path
                d={pathString}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
              />
              
              {/* Additional connecting lines that appear later */}
              {lineProgress > 0.5 && pathPoints.length > 5 && (
                <>
                  <path
                    d={`M ${pathPoints[Math.floor(pathPoints.length * 0.3)].x} ${pathPoints[Math.floor(pathPoints.length * 0.3)].y} 
                        Q ${pathPoints[Math.floor(pathPoints.length * 0.5)].x + 30} ${pathPoints[Math.floor(pathPoints.length * 0.5)].y - 40} 
                        ${pathPoints[Math.floor(pathPoints.length * 0.7)].x} ${pathPoints[Math.floor(pathPoints.length * 0.7)].y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity={0.4}
                  />
                  
                  {/* Loops */}
                  <circle
                    cx={pathPoints[Math.floor(pathPoints.length * 0.6)]?.x || 0}
                    cy={pathPoints[Math.floor(pathPoints.length * 0.6)]?.y || 0}
                    r="15"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity={0.3}
                  />
                </>
              )}
            </g>
          );
        })}

        {/* Additional entanglement effects */}
        {progress > 0.7 && (
          <>
            <path
              d={`M ${width * 0.4} ${height * 0.3} Q ${width * 0.6} ${height * 0.6} ${width * 0.5} ${height * 0.7}`}
              fill="none"
              stroke="#4FD1C5"
              strokeWidth="3"
              opacity={0.3}
              strokeDasharray="10,5"
            />
            <path
              d={`M ${width * 0.45} ${height * 0.6} Q ${width * 0.3} ${height * 0.4} ${width * 0.55} ${height * 0.35}`}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              opacity={0.4}
            />
          </>
        )}
      </svg>

      {/* Floating subject labels that get scattered */}
      {progress > 0.3 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: `${30 + Math.sin(frame * 0.1) * 5}%`,
              top: `${25 + Math.cos(frame * 0.08) * 3}%`,
              transform: `rotate(${Math.sin(frame * 0.05) * 10}deg)`,
              padding: '8px 16px',
              backgroundColor: '#8B5CF6',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.7,
            }}
          >
            Math ∑
          </div>
          
          <div
            style={{
              position: 'absolute',
              left: `${60 + Math.cos(frame * 0.12) * 8}%`,
              top: `${40 + Math.sin(frame * 0.09) * 6}%`,
              transform: `rotate(${Math.cos(frame * 0.07) * 15}deg)`,
              padding: '8px 16px',
              backgroundColor: '#06B6D4',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.7,
            }}
          >
            Science 🔬
          </div>
          
          <div
            style={{
              position: 'absolute',
              left: `${40 + Math.sin(frame * 0.11) * 7}%`,
              top: `${65 + Math.cos(frame * 0.06) * 4}%`,
              transform: `rotate(${Math.sin(frame * 0.08) * -12}deg)`,
              padding: '8px 16px',
              backgroundColor: '#EC4899',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.7,
            }}
          >
            Literature 📚
          </div>
        </>
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
          opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        }}
      >
        Learning paths become tangled and overwhelming
      </div>
    </AbsoluteFill>
  );
};