import { useEventContext } from '../Timeline/EventConntext';
import { useClipPageContext } from '../ClipPageContext';
import { useRemotionPlayer } from '@/lib/hooks/useRemotionPlayer';
import { ScissorsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
const SplitEvent = () => {
  const { videoRef, metadata } = useClipPageContext();
  const { currentTime } = useRemotionPlayer(videoRef, metadata.fps);
  const { splitEvent } = useEventContext();
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={() => splitEvent(currentTime)}
        size="icon"
      >
        <ScissorsIcon size={22} className="text-primary" />
      </Button>
    </div>
  );
};

export default SplitEvent;
