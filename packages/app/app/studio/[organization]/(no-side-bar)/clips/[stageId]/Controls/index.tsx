'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ZoomInIcon,
  ZoomOutIcon,
  InfoIcon,
} from 'lucide-react';
import { useClipContext } from '../ClipContext';
import { formatTime } from '@/lib/utils/time';
import { Button } from '@/components/ui/button';
import { calculateTimelineScale } from '@/lib/utils/utils';
import { HoverCard } from '@radix-ui/react-hover-card';
import { HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  LuArrowBigUp,
  LuArrowLeft,
  LuArrowRight,
  LuEye,
  LuImport,
  LuInfo,
  LuPlus,
  LuScissorsLineDashed,
} from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';
import KeyboardShortcuts from './KeyboardShortcuts';
import { useMarkersContext } from '../sidebar/markers/markersContext';
import { useCreateClip } from '@/lib/hooks/useCreateClip';

const Controls = () => {
  const {
    videoRef,
    isCreatingClip,
    setIsCreatingClip,
    pixelsPerSecond,
    setPixelsPerSecond,
    currentTime,
    timelineContainerWidth,
  } = useClipContext();

  const { handlePreview } = useCreateClip();

  const {
    isAddingOrEditingMarker,
    isImportingMarkers,
    setIsAddingOrEditingMarker,
    setSelectedMarkerId,
  } = useMarkersContext();

  const [playbackRate, setPlaybackRate] = useState(1);
  const currentPlaybackRateIndexRef = useRef(1);

  const [isFit, setIsFit] = useState(false);
  const isMaxZoom = pixelsPerSecond >= 10;
  const isMinZoom = pixelsPerSecond <= 0.1 || isFit;

  const handleZoomOut = () => {
    setPixelsPerSecond((prev) => Math.max(prev / 1.2, 0.1));
  };

  const handleZoomIn = () => {
    setIsFit(false); // Reset fit state when zooming out
    setPixelsPerSecond((prev) => Math.min(prev * 1.2, 10));
  };

  const handleFit = () => {
    const scale = calculateTimelineScale({ videoRef, timelineContainerWidth });
    setPixelsPerSecond(scale);
    setIsFit(true);
  };

  // Available playback rates
  const playbackRates = [0.5, 1, 1.5, 2];

  useEffect(() => {
    if (
      pixelsPerSecond <=
      calculateTimelineScale({ videoRef, timelineContainerWidth })
    ) {
      setIsFit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixelsPerSecond]);

  const isDisabled =
    isImportingMarkers || isCreatingClip || isAddingOrEditingMarker;

  return (
    <>
      <KeyboardShortcuts
        isFit={isFit}
        handleZoomOut={handleZoomOut}
        handleZoomIn={handleZoomIn}
        handleFit={handleFit}
        playbackRates={playbackRates}
        setPlaybackRate={setPlaybackRate}
        currentPlaybackRateIndex={currentPlaybackRateIndexRef.current}
        playbackRate={playbackRate}
        setCurrentPlaybackRateIndex={(index) => {
          currentPlaybackRateIndexRef.current = index;
        }}
      />
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
            {videoRef?.current?.duration
              ? formatTime(videoRef.current.duration)
              : '00:00:00'}
          </span>
          <div className="flex items-center gap-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                  aria-label="Zoom out -"
                  disabled={isMinZoom || isFit}
                >
                  <ZoomOutIcon size={22} />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="text-xs w-fit px-2 py-1 rounded-lg">
                <p>
                  Zoom out
                  <Badge
                    className="px-1 py-0.5 ml-2 bg-gray-400 text-white"
                    variant="outline"
                  >
                    <code>-</code>
                  </Badge>{' '}
                </p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  className="disabled:pointer-events-auto"
                  onClick={handleFit}
                  disabled={isFit}
                  variant={'outline'}
                  size={'icon'}
                >
                  Fit
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="text-xs w-fit px-2 py-1 rounded-lg">
                <p>
                  Zoom to fit
                  <Badge
                    className="px-1 py-0.5 ml-2 bg-gray-400 text-white"
                    variant="outline"
                  >
                    <code>0</code>
                  </Badge>{' '}
                </p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger asChild>
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom in +"
                  disabled={isMaxZoom}
                >
                  <ZoomInIcon size={22} />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="text-xs w-fit px-2 py-1 rounded-lg">
                <p>
                  Zoom in
                  <Badge
                    className="px-1 py-0.5 ml-2 bg-gray-400 text-white"
                    variant="outline"
                  >
                    <code>+</code>
                  </Badge>{' '}
                </p>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger>
                <LuInfo />
              </HoverCardTrigger>
              <HoverCardContent className="z-[9999] w-[400px] overflow-auto">
                <div className="text-xs text-gray-700">
                  <p className="font-semibold pb-2">Keyboard shortcuts</p>

                  <div>
                    <Badge variant="outline">
                      <code>k</code>
                    </Badge>{' '}
                    Pause/Play in player.
                  </div>
                  <div>
                    <Badge variant="outline">
                      <code>+</code>
                    </Badge>{' '}
                    Zoom in.
                  </div>
                  <div>
                    <Badge variant="outline">
                      <code>-</code>
                    </Badge>{' '}
                    Zoom out.
                  </div>
                  <div>
                    <Badge variant="outline">
                      <code>0</code>
                    </Badge>{' '}
                    Zoom to fit.
                  </div>
                  <div>
                    <Badge variant="outline">
                      <code>i</code>
                    </Badge>{' '}
                    Slider start.
                  </div>
                  <div>
                    <Badge variant="outline">
                      <code>o</code>
                    </Badge>{' '}
                    Slider end.
                  </div>
                  {/* <div>
                    <Badge variant="outline">
                      <code>r</code>
                    </Badge>{' '}
                    Reset slider.
                  </div> */}
                  <div>
                    <Badge variant="outline">
                      <code>j</code>
                    </Badge>{' '}
                    Speed up the video playback rate.
                  </div>
                  <div>
                    <Badge variant="outline">
                      <code>l</code>
                    </Badge>{' '}
                    Slow down the video playback rate.
                  </div>
                  <div>
                    <Badge variant="outline">
                      <LuArrowLeft size={12} />
                    </Badge>{' '}
                    Seek backward one second.
                  </div>
                  <div>
                    <Badge variant="outline">
                      <LuArrowRight size={12} />
                    </Badge>{' '}
                    Seek forward one second.
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline">
                      <code className="text-xs flex items-center">
                        <LuArrowBigUp size={12} className="mr-1" /> +
                        <LuArrowLeft size={12} className="ml-1" />
                      </code>
                    </Badge>
                    Seek backward 10 seconds.
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline">
                      <code className="text-xs flex items-center">
                        <LuArrowBigUp size={12} className="mr-1" /> +
                        <LuArrowRight size={12} className="ml-1" />
                      </code>
                    </Badge>
                    Seek forward 10 seconds.
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
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
    </>
  );
};

export default Controls;
