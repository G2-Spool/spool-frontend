import {Composition} from 'remotion';
import {SpoolEducationDemo} from './SpoolEducationDemo';

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="SpoolEducationDemo"
        component={SpoolEducationDemo}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1200}
        height={600}
        defaultProps={{}}
      />
    </>
  );
};