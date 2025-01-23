'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard } from '@radix-ui/react-hover-card';
import { HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { useTimelineContext } from '../Timeline/TimelineContext';
import useTimeline from '../Timeline/useTimeline';
import { useClipContext } from '../ClipContext';
const ZoomControls = () => {
  const { videoRef } = useClipContext();
  const {
    pixelsPerSecond,
    setPixelsPerSecond,
    timelineRef,
    videoDuration,
    setTimelineWidth,
    playheadPosition
  } = useTimelineContext();

  const { calculateTimelineScale } = useTimeline();
  const [isFit, setIsFit] = useState(false);

  const isMaxZoom = pixelsPerSecond >= 10;
  const isMinZoom = pixelsPerSecond <= 0.1 || isFit;

  const handleZoomOut = () => {
    if (!timelineRef.current || !videoRef.current) return;

    // Calculate new zoom level
    const newPixelsPerSecond = Math.max(pixelsPerSecond / 1.2, 0.1);


    // Update pixels per second
    setPixelsPerSecond(newPixelsPerSecond);

    // Update timeline width
    const newTimelineWidth = videoDuration * newPixelsPerSecond;
    setTimelineWidth(newTimelineWidth);

    // Adjust scroll position to center on current time
    if (timelineRef.current) {
      const newScrollPosition =
        playheadPosition * newPixelsPerSecond - timelineRef.current.clientWidth / 2;
      timelineRef.current.scrollLeft = newScrollPosition;
    }
  };

  const handleZoomIn = () => {
    if (!timelineRef.current || !videoRef.current) return;

    setIsFit(false);

    // Calculate new zoom level
    const newPixelsPerSecond = Math.min(pixelsPerSecond * 1.2, 10);


    // Update pixels per second
    setPixelsPerSecond(newPixelsPerSecond);

    // Update timeline width
    const newTimelineWidth = videoDuration * newPixelsPerSecond;
    setTimelineWidth(newTimelineWidth);

    // Adjust scroll position to center on current time
    if (timelineRef.current) {
      const newScrollPosition =
        playheadPosition * newPixelsPerSecond - timelineRef.current.clientWidth / 2;
      timelineRef.current.scrollLeft = newScrollPosition;
    }
  };

  const handleFit = () => {
    if (!timelineRef.current || !videoRef.current) return;
    const scale = calculateTimelineScale({
      timelineContainerWidth: timelineRef.current.offsetWidth,
      maxLength: videoRef.current.duration,
    });
    
    // Update pixels per second
    setPixelsPerSecond(scale);
    
    // Update timeline width
    const newTimelineWidth = videoDuration * scale;
    setTimelineWidth(newTimelineWidth);

    // Adjust scroll position to center on current time
    const newScrollPosition =
      playheadPosition * scale - timelineRef.current.clientWidth / 2;
    timelineRef.current.scrollLeft = newScrollPosition;

    setIsFit(true);
  };

  const keyboardShortcuts = (e: KeyboardEvent) => {
    switch (e.key) {
      case '-':
        if (!isFit) handleZoomOut();
        break;
      case '+':
        handleZoomIn();
        break;
      case '0':
        if (!isFit) handleFit();
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyboardShortcuts);
    return () => {
      window.removeEventListener('keydown', keyboardShortcuts);
    };
  }, [keyboardShortcuts]);

  return (
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
            </Badge>
          </p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            className="disabled:pointer-events-auto"
            onClick={handleFit}
            disabled={isFit}
            variant={'ghost'}
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
    </div>
  );
};

export default ZoomControls;
