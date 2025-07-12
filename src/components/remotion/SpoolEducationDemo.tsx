import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Scene1LinearEducation } from './scenes/Scene1LinearEducation';
import { Scene2MessyLines } from './scenes/Scene2MessyLines';
import { Scene3SpoolOrganizes } from './scenes/Scene3SpoolOrganizes';

export const SpoolEducationDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { } = useVideoConfig();

  // Scene timing (30fps)
  const scene1Duration = 90; // 0-3 seconds
  const scene2Duration = 120; // 3-7 seconds 
  const scene3Duration = 90; // 7-10 seconds

  // Calculate opacity for smooth transitions
  const scene1Opacity = interpolate(
    frame,
    [0, scene1Duration - 30, scene1Duration],
    [1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scene2Opacity = interpolate(
    frame,
    [scene1Duration - 30, scene1Duration, scene1Duration + scene2Duration - 30, scene1Duration + scene2Duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scene3Opacity = interpolate(
    frame,
    [scene1Duration + scene2Duration - 30, scene1Duration + scene2Duration, 300],
    [0, 1, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      {/* Scene 1: Linear Education */}
      <AbsoluteFill style={{ opacity: scene1Opacity }}>
        <Scene1LinearEducation 
          frame={Math.min(frame, scene1Duration)} 
          totalFrames={scene1Duration}
        />
      </AbsoluteFill>

      {/* Scene 2: Messy Lines */}
      <AbsoluteFill style={{ opacity: scene2Opacity }}>
        <Scene2MessyLines 
          frame={Math.max(0, frame - scene1Duration)} 
          totalFrames={scene2Duration}
        />
      </AbsoluteFill>

      {/* Scene 3: Spool Organizes */}
      <AbsoluteFill style={{ opacity: scene3Opacity }}>
        <Scene3SpoolOrganizes 
          frame={Math.max(0, frame - scene1Duration - scene2Duration)} 
          totalFrames={scene3Duration}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};