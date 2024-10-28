'use client';
import React, { useEffect, useState } from 'react';
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
import { LuInfo } from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';

const Controls = () => {
  const {
    videoRef,
    isAddingOrEditingMarker,
    setIsAddingOrEditingMarker,
    isImportingMarkers,
    setIsImportingMarkers,
    setSelectedMarkerId,
    isCreatingClip,
    setIsCreatingClip,
    pixelsPerSecond,
    setPixelsPerSecond,
    currentTime,
    timelineContainerWidth,
  } = useClipContext();
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

    // New keyboard shortcuts for zooming and fitting
    if (e.key === '-') {
      if (!isFit) handleZoomOut();
    } else if (e.key === '+' || e.key === '=') {
      handleZoomIn();
    } else if (e.key === '0') {
      if (!isFit) handleFit();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', spaceBarHandler);

    return () => {
      window.removeEventListener('keydown', spaceBarHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, timelineContainerWidth, isFit]);

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
            <HoverCardContent className="z-[9999]">
              <div className="text-xs text-gray-700">
                <p className="font-semibold pb-2">Keyboard shortcuts</p>
                <p>
                  <Badge variant="outline">
                    <code>Space</code>
                  </Badge>{' '}
                  Play/Pause
                </p>
                <p>
                  <Badge variant="outline">
                    <code>+</code>
                  </Badge>{' '}
                  Zoom in
                </p>
                <p>
                  <Badge variant="outline">
                    <code>-</code>
                  </Badge>{' '}
                  Zoom out
                </p>
                <p>
                  <Badge variant="outline">
                    <code>0</code>
                  </Badge>{' '}
                  Zoom to fit
                </p>
                <p>
                  <Badge variant="outline">
                    <code>i</code>
                  </Badge>{' '}
                  Slider start
                </p>
                <p>
                  <Badge variant="outline">
                    <code>o</code>
                  </Badge>{' '}
                  Slider end
                </p>
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
          Add marker
        </Button>
        <div className="hidden xl:flex space-x-2">
          <Button
            disabled={isDisabled}
            variant="outline"
            onClick={() => setIsImportingMarkers(true)}
          >
            Import Markers
          </Button>
          <Button
            disabled={isDisabled}
            variant="primary"
            className="bg-blue-500 text-white"
            onClick={() => setIsCreatingClip(true)}
          >
            Create Clip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
