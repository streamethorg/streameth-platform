import { CallbackListener, PlayerRef } from '@remotion/player';
import { useCallback, useSyncExternalStore } from 'react';

export const useRemotionPlayer = (
  ref: React.RefObject<PlayerRef | null>,
  fps: number
) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const { current } = ref;
      if (!current) {
        return () => undefined;
      }
      const updater: CallbackListener<'frameupdate'> = ({ detail }) => {
        onStoreChange();
      };
      current.addEventListener('frameupdate', updater);
      return () => {
        current.removeEventListener('frameupdate', updater);
      };
    },
    [ref]
  );

  const data = useSyncExternalStore<number>(
    subscribe,
    () => ref.current?.getCurrentFrame() ?? 0,
    () => 0
  );

  const isPlaying = useSyncExternalStore<boolean>(
    useCallback(
      (onStoreChange: () => void) => {
        const { current } = ref;
        if (!current) {
          return () => undefined;
        }

        const playListener = () => onStoreChange();
        const pauseListener = () => onStoreChange();

        current.addEventListener('play', playListener);
        current.addEventListener('pause', pauseListener);

        return () => {
          current.removeEventListener('play', playListener);
          current.removeEventListener('pause', pauseListener);
        };
      },
      [ref]
    ),
    () => ref.current?.isPlaying() ?? false,
    () => false
  );

  const handleSetCurrentTime = useCallback(
    (time: number) => {
      ref.current?.seekTo(time * fps);
    },
    [ref, fps]
  );

  const handlePlay = useCallback(() => {
    ref.current?.play();
  }, [ref]);

  const handlePause = useCallback(() => {
    ref.current?.pause();
  }, [ref]);

  return {
    isPlaying,
    currentFrame: data,
    currentTime: data / fps,
    handleSetCurrentTime,
    handlePlay,
    handlePause,
  };
};
