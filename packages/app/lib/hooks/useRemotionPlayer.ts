import {CallbackListener, PlayerRef} from '@remotion/player';
import {useCallback, useSyncExternalStore} from 'react';
 
export const useRemotionPlayer = (
  ref: React.RefObject<PlayerRef | null>,
  fps: number,
) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const {current} = ref;
      if (!current) {
        return () => undefined;
      }
      const updater: CallbackListener<'frameupdate'> = ({detail}) => {
        onStoreChange();
      };
      current.addEventListener('frameupdate', updater);
      return () => {
        current.removeEventListener('frameupdate', updater);
      };
    },
    [ref],
  );
 
  const data = useSyncExternalStore<number>(
    subscribe,
    () => ref.current?.getCurrentFrame() ?? 0,
    () => 0,
  );

  const handleSetCurrentTime = useCallback((time: number) => {
    ref.current?.seekTo(time * fps);
  }, [ref]);
 
  return {
    
    currentFrame: data,
    currentTime: data / fps,
    handleSetCurrentTime,
  };
};