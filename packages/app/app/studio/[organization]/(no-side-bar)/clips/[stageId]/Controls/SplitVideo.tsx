import { useEventContext } from '../Timeline/EventConntext';
import { useClipPageContext } from '../ClipPageContext';
import { useRemotionPlayer } from '@/lib/hooks/useRemotionPlayer';
const SplitVideo = () => {
  const { videoRef, metadata } = useClipPageContext();
  const { currentTime } = useRemotionPlayer(videoRef, metadata.fps);
  const { events, splitEvent } = useEventContext();
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => splitEvent(currentTime)}>Split</button>
    </div>
  );
};

export default SplitVideo;
