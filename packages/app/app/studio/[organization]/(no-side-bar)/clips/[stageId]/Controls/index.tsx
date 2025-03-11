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
import { useEventContext } from '../Timeline/EventConntext';
import { useRemotionPlayer } from '@/lib/hooks/useRemotionPlayer';
import SplitVideo from './SplitVideo';

const Controls = () => {
  const { videoRef, isCreatingClip, metadata } = useClipPageContext();

  const {
    isAddingOrEditingMarker,
    isImportingMarkers,
    setIsAddingOrEditingMarker,
    setSelectedMarkerId,
  } = useMarkersContext();

  const { currentTime, isPlaying, handlePlay, handlePause } = useRemotionPlayer(
    videoRef,
    metadata.fps
  );
  const [playbackRate, setPlaybackRate] = useState(1);
  const currentPlaybackRateIndexRef = useRef(1);

  // Available playback rates
  const playbackRates = [0.5, 1, 1.5, 2];

  const isDisabled =
    isImportingMarkers || isCreatingClip || isAddingOrEditingMarker;

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
                videoRef.current.dispatchRateChange(newIndex);
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
        {isPlaying ? (
          <button onClick={handlePause}>
            <PauseIcon size={22} className="text-primary" />
          </button>
        ) : (
          <button onClick={handlePlay}>
            <PlayIcon size={22} className="text-primary" />
          </button>
        )}

        <span>
          {formatTime(currentTime)} /{' '}
          {metadata.duration ? formatTime(metadata.duration) : '00:00:00'}
        </span>
      </div>
      <div className="space-x-2 flex items-center self-end">
        <ZoomControls />
      </div>
      <SplitVideo />
    </div>
  );
};

export default Controls;
