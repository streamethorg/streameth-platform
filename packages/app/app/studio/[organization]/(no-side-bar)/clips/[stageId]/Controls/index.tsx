'use client';
import React, { useRef, useState } from 'react';
import { PlayIcon, PauseIcon, EyeIcon, PlusIcon } from 'lucide-react';
import { useClipPageContext } from '../ClipPageContext';
import { formatTime } from '@/lib/utils/time';
import { Button } from '@/components/ui/button';
import KeyboardShortcuts from './KeyboardShortcuts';
import { useMarkersContext } from '../sidebar/markers/markersContext';
import ZoomControls from './ZoomControls';
import { useTimelineContext } from '../Timeline/TimelineContext';
import usePlayer from '@/lib/hooks/usePlayer';
import { useTrimmControlsContext } from '../Timeline/TrimmControlsContext';

const Controls = () => {
  const { videoRef, isCreatingClip } = useClipPageContext();

  const {
    isAddingOrEditingMarker,
    isImportingMarkers,
    setIsAddingOrEditingMarker,
    setSelectedMarkerId,
  } = useMarkersContext();

  const {
    videoDuration,
    isPreviewMode,
    setIsPreviewMode,
    setPreviewTimeBounds,
  } = useTimelineContext();

  const { startTime, endTime } = useTrimmControlsContext();
  const { currentTime } = usePlayer(videoRef);

  const [playbackRate, setPlaybackRate] = useState(1);
  const currentPlaybackRateIndexRef = useRef(1);

  // Available playback rates
  const playbackRates = [0.5, 1, 1.5, 2];

  const isDisabled =
    isImportingMarkers || isCreatingClip || isAddingOrEditingMarker;

  const handlePreviewMode = () => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
      return;
    }
    setPreviewTimeBounds({
      startTime: startTime,
      endTime: endTime,
    });
    setIsPreviewMode(true);
  };
  return (
    <div className="bg-white flex flex-row w-full border-b items-center border-t p-2 gap-4">
      <Button
        disabled={isDisabled}
        onClick={() => {
          setIsAddingOrEditingMarker(true);
          setSelectedMarkerId('');
        }}
        variant="ghost"
      >
        <PlusIcon size={22} className="mr-1" />
        <p className="text-sm text-primary">Add marker</p>
      </Button>
      <div className="space-x-6 flex flex-row items-center justify-center flex-1">
        <KeyboardShortcuts
          playbackRates={playbackRates}
          setPlaybackRate={setPlaybackRate}
          currentPlaybackRateIndex={currentPlaybackRateIndexRef.current}
          playbackRate={playbackRate}
          setCurrentPlaybackRateIndex={(index) => {
            currentPlaybackRateIndexRef.current = index;
          }}
        />
        <label>
          <select
            value={playbackRate}
            onChange={(e) => {
              if (videoRef.current) {
                const newIndex = parseFloat(e.target.value);
                videoRef.current.playbackRate = newIndex;
                setPlaybackRate(newIndex);
              }
            }}
          >
            {playbackRates.map((speed, i) => (
              <option key={i} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </label>
        {videoRef.current?.paused ? (
          <button onClick={() => videoRef.current?.play()}>
            <PlayIcon size={22} className="text-primary" />
          </button>
        ) : (
          <button onClick={() => videoRef.current?.pause()}>
            <PauseIcon size={22} className="text-primary" />
          </button>
        )}

        <span>
          {formatTime(currentTime)} /{' '}
          {videoDuration ? formatTime(videoDuration) : '00:00:00'}
        </span>
      </div>
      <div className="space-x-2 flex items-center self-end">
        <ZoomControls />

        <div className="hidden xl:flex space-x-2">
          <Button variant={'ghost'} onClick={handlePreviewMode} type="button">
            <EyeIcon
              size={22}
              className={`mr-2 ${
                isPreviewMode ? 'text-primary animate-pulse' : 'text-primary'
              }`}
            />
            <p
              className={` ${
                isPreviewMode ? 'text-primary animate-pulse' : 'text-primary'
              }`}
            >
              Preview
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
