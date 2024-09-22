'use client';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { useClipContext } from '../[stageId]/ClipContext';
import { formatTime } from '@/lib/utils/time';

const Controls = () => {
  const { videoRef } = useClipContext();

  return (
    <div className="bg-white flex w-full flex-row items-center justify-center space-x-6 border-b border-t p-2">
      {videoRef.current?.paused ? (
        <button onClick={() => videoRef.current?.play()}>
          <PlayIcon />
        </button>
      ) : (
        <button onClick={() => videoRef.current?.pause()}>
          <PauseIcon />
        </button>
      )}
      <label>
        Speed:
        <select
          onChange={(e) => {
            if (videoRef.current) {
              videoRef.current.playbackRate = parseFloat(e.target.value);
            }
          }}
        >
          <option value="0.5">0.5x</option>
          <option value="1" selected>
            1x
          </option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </label>
      <span>
        {videoRef.current
          ? formatTime(videoRef.current.currentTime)
          : '00:00:00'}
        /{' '}
        {videoRef.current ? formatTime(videoRef.current.duration) : '00:00:00'}
      </span>
    </div>
  );
};

export default Controls;
