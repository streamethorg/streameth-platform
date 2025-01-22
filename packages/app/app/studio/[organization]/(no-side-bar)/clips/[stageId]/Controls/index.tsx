'use client';
import React, { useRef, useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
} from 'lucide-react';
import { useClipContext } from '../ClipContext';
import { formatTime } from '@/lib/utils/time';
import { Button } from '@/components/ui/button';
import { LuEye, LuPlus, LuScissorsLineDashed } from 'react-icons/lu';
import KeyboardShortcuts from './KeyboardShortcuts';
import { useMarkersContext } from '../sidebar/markers/markersContext';
import { useCreateClip } from '@/lib/hooks/useCreateClip';
import ZoomControls from './ZoomControls';
import { useTimelineContext } from '../Timeline/TimelineContext';
import usePlayer from '@/lib/hooks/usePlayer';

const Controls = () => {
  const { videoRef, isCreatingClip, setIsCreatingClip } =
    useClipContext();

  const { handlePreview } = useCreateClip();

  const {
    isAddingOrEditingMarker,
    isImportingMarkers,
    setIsAddingOrEditingMarker,
    setSelectedMarkerId,
  } = useMarkersContext();

  const { videoDuration } = useTimelineContext();

  const { currentTime } = usePlayer(videoRef);

  const [playbackRate, setPlaybackRate] = useState(1);
  const currentPlaybackRateIndexRef = useRef(1);

  // Available playback rates
  const playbackRates = [0.5, 1, 1.5, 2];

  const isDisabled =
    isImportingMarkers || isCreatingClip || isAddingOrEditingMarker;

  return (
    <div className="bg-white flex w-full justify-between border-b items-center border-t p-2 gap-4">
      <div className="space-x-6 flex flex-row items-center">
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
        <span>
          {formatTime(currentTime)} /{' '}
          {videoDuration ? formatTime(videoDuration) : '00:00:00'}
        </span>
        <ZoomControls />
        <KeyboardShortcuts
          playbackRates={playbackRates}
          setPlaybackRate={setPlaybackRate}
          currentPlaybackRateIndex={currentPlaybackRateIndexRef.current}
          playbackRate={playbackRate}
          setCurrentPlaybackRateIndex={(index) => {
            currentPlaybackRateIndexRef.current = index;
          }}
        />
      </div>

      <div className="ml-auto space-x-2 flex items-center">
        <Button
          disabled={isDisabled}
          onClick={() => {
            setIsAddingOrEditingMarker(true);
            setSelectedMarkerId('');
          }}
          variant="outline"
        >
          <LuPlus className="w-4 h-4 mr-1" />
          Add marker
        </Button>
        <div className="hidden xl:flex space-x-2">
          <Button variant={'secondary'} onClick={handlePreview} type="button">
            <LuEye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            disabled={isDisabled}
            variant="primary"
            className="bg-blue-500 text-white"
            onClick={() => setIsCreatingClip(true)}
          >
            <LuScissorsLineDashed className="w-4 h-4 mr-1" />
            Create Clip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
