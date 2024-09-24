'use client';
import React, { useEffect } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { useClipContext } from '../ClipContext';
import { formatTime } from '@/lib/utils/time';
import { Button } from '@/components/ui/button';

const Controls = () => {
  const {
    videoRef,
    isAddingOrEditingMarker,
    setIsAddingOrEditingMarker,
    isImportingMarkers,
    setSelectedMarkerId,
    isCreatingClip,
  } = useClipContext();

  const spaceBarHandler = (e: KeyboardEvent) => {
    if (e.key == ' ' || e.code == 'Space' || e.keyCode == 32) {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', spaceBarHandler);

    return () => {
      window.removeEventListener('keydown', spaceBarHandler);
    };
  }, [videoRef]);

  return (
    <div className="bg-white flex w-full flex-row border-b items-center border-t p-2">
      <div className="space-x-8 flex flex-row">
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
            defaultValue={1}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.playbackRate = parseFloat(e.target.value);
              }
            }}
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </label>
        <span>
          {videoRef?.current?.currentTime
            ? formatTime(videoRef.current.currentTime)
            : '00:00:00'}
          /{' '}
          {videoRef?.current?.duration
            ? formatTime(videoRef.current.duration)
            : '00:00:00'}
        </span>
      </div>
      <Button
        disabled={
          isAddingOrEditingMarker || isImportingMarkers || isCreatingClip
        }
        onClick={() => {
          setIsAddingOrEditingMarker(true);
          setSelectedMarkerId('');
        }}
        variant="outline"
        className="ml-auto"
      >
        Add marker
      </Button>
    </div>
  );
};

export default Controls;
