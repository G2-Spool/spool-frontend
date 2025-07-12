import React from 'react';
import { Composition } from 'remotion';
import { SpoolEducationDemo } from './SpoolEducationDemo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SpoolEducationDemo"
        component={SpoolEducationDemo}
        durationInFrames={300}
        fps={30}
        width={1200}
        height={600}
        defaultProps={{}}
      />
    </>
  );
};