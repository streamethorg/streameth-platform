'use client';
import React, { useEffect, useState } from 'react';
import { PlayIcon, PauseIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
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
    pixelsPerSecond,
    setPixelsPerSecond,
    currentTime,
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

  const handleZoomIn = () => {
    setPixelsPerSecond((prev) => Math.min(prev * 1.2, 10));
  };

  const handleZoomOut = () => {
    setPixelsPerSecond((prev) => Math.max(prev / 1.2, 0.1));
  };

  const isMaxZoom = pixelsPerSecond >= 10;
  const isMinZoom = pixelsPerSecond <= 0.1;

  return (
    <div className="bg-white flex w-full flex-row border-b items-center border-t p-2">
      <div className="space-x-8 flex flex-row items-center">
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
          {formatTime(currentTime)} /{' '}
          {videoRef?.current?.duration
            ? formatTime(videoRef.current.duration)
            : '00:00:00'}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
            disabled={isMinZoom}
          >
            <ZoomOutIcon size={20} />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
            disabled={isMaxZoom}
          >
            <ZoomInIcon size={20} />
          </button>
        </div>
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
