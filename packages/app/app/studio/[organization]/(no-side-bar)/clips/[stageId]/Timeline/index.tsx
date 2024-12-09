'use client';
import React from 'react';
import { useClipContext } from '../ClipContext';
import TrimmControls, { TrimmOverlay } from './TrimmControls';
import Playhead from './PlayHead';
import { formatTime } from '@/lib/utils/time';
import { useEffect, useRef } from 'react';
import { calculateTimelineScale } from '@/lib/utils/utils';

const Timeline = () => {
  const {
    videoRef,
    dragging,
    isLoading,
    filteredMarkers,
    handleMouseDown,
    handleMarkerClick,
    selectedMarkerId,
    pixelsPerSecond,
    setPixelsPerSecond,
    setTimelineContainerWidth,
    setCurrentTime,
  } = useClipContext();

  const timelineRef = useRef<HTMLDivElement>(null);

  const maxLength = videoRef.current?.duration || 0;
  const timelineWidth = maxLength * pixelsPerSecond;

  // Get the width of the timeline container
  const timelineContainerWidth = timelineRef.current?.offsetWidth || 0;

  useEffect(() => {
    const updateTimelineContainerWidth = () => {
      setTimelineContainerWidth(timelineRef.current?.offsetWidth || 0);
    };

    updateTimelineContainerWidth(); // Set initial width on mount
    window.addEventListener('resize', updateTimelineContainerWidth); // Update on resize

    return () => {
      window.removeEventListener('resize', updateTimelineContainerWidth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineContainerWidth]);

  useEffect(() => {
    const calculateScale = () => {
      const scale = calculateTimelineScale({
        videoRef,
        timelineContainerWidth,
      });
      setPixelsPerSecond(scale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);

    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, [maxLength, setPixelsPerSecond, videoRef, timelineContainerWidth]);

  const handleTimelineClick = (event: React.MouseEvent) => {
    if (videoRef.current) {
      const timelineElement = event.currentTarget as HTMLElement;
      const timelineRect = timelineElement.getBoundingClientRect();
      const relativeClickX = event.clientX - timelineRect.left;
      const clickTime = (relativeClickX / timelineWidth) * maxLength;
      videoRef.current.currentTime = clickTime;
      setCurrentTime(clickTime);
    }
  };

  if (!maxLength || !timelineWidth || !videoRef.current)
    return (
      // loading state
      <div className="relative flex flex-col w-full bg-white p-2 h-[200px] overflow-auto">
        <div className="h-full w-full bg-slate-200 animate-pulse rounded-xl"></div>
      </div>
    );

  return (
    <div
      ref={timelineRef}
      className={`relative flex flex-col w-full bg-white h-[200px] overflow-x-scroll overflow-y-hidden`}
    >
      <div
        className="h-[100px] relative"
        style={{ width: `${timelineWidth}px` }}
      >
        {filteredMarkers &&
          filteredMarkers.map((marker) => {
            if (
              marker.startClipTime > maxLength ||
              marker.endClipTime > maxLength
            )
              return null;
            return (
              <div
                key={marker._id}
                className={`absolute h-[20px] border bg-opacity-20 rounded z-[21]`}
                onClick={() => handleMarkerClick(marker)}
                style={{
                  backgroundColor: marker.color,
                  border: `2px solid ${
                    selectedMarkerId === marker._id ? '#066FF9' : marker.color
                  }`,
                  left: `${(marker.startClipTime / maxLength) * timelineWidth}px`,
                  width: `${((marker.endClipTime - marker.startClipTime) / maxLength) * timelineWidth}px`,
                }}
              >
                <p className="text-[10px] text-white truncate">
                  {marker.name.length > 20
                    ? `${marker.name.substring(0, 20)}...`
                    : marker.name}
                </p>
              </div>
            );
          })}
        <Playhead maxLength={maxLength} timelineWidth={timelineWidth} />
        <div
          onClick={handleTimelineClick}
          className="absolute top-0 left-0 w-full h-full z-[20]"
        >
          <TimelineDrawing
            maxLength={maxLength}
            timelineWidth={timelineWidth}
            scale={pixelsPerSecond}
          />
        </div>
        <TrimmControls
          {...{
            handleMouseDown: (e: React.MouseEvent) =>
              handleMouseDown('start', e),
            marker: 'start',
            blocked: isLoading && dragging !== 'start',
          }}
        />
        <TrimmOverlay />
        <TrimmControls
          {...{
            handleMouseDown: (e: React.MouseEvent) => handleMouseDown('end', e),
            marker: 'end',
            blocked: isLoading && dragging !== 'end',
          }}
        />
      </div>
    </div>
  );
};

export default Timeline;

const TimelineDrawing = ({
  maxLength,
  timelineWidth,
  scale,
}: {
  maxLength: number;
  timelineWidth: number;
  scale: number;
}) => {
  const getMarkerPosition = (time: number) =>
    (time / maxLength) * timelineWidth;

  // Function to calculate intervals based on scale
  const calculateIntervals = (scale: number) => {
    if (scale >= 10) return { major: 10, minor: 3 };
    if (scale >= 5) return { major: 15, minor: 5 };
    if (scale >= 2) return { major: 50, minor: 10 };
    if (scale >= 1.5) return { major: 30, minor: 20 };
    if (scale >= 1) return { major: 50, minor: 30 };
    if (scale >= 0.5) return { major: 200, minor: 50 };
    if (scale >= 0.2) return { major: 400, minor: 100 };
    return { major: 500, minor: 200 };
  };

  const { major: majorInterval, minor: minorInterval } =
    calculateIntervals(scale);

  const markers = [];
  for (let i = 0; i <= maxLength; i += minorInterval) {
    const position = getMarkerPosition(i);

    if (i % majorInterval === 0) {
      markers.push(
        <div
          key={i}
          className="absolute h-full top-6"
          style={{ left: `${position}px` }}
        >
          <div className="absolute bottom-0 left-0 transform -translate-x-1/2 text-xs text-gray-400">
            {formatTime(i)}
          </div>
          <div className="absolute h-[calc(100%-17px)] border-l border-gray-600"></div>
        </div>
      );
    } else {
      markers.push(
        <div
          key={i}
          className="absolute h-full"
          style={{ left: `${position}px` }}
        >
          <div className="absolute top-6 h-1/2 border-l border-gray-600"></div>
        </div>
      );
    }
  }
  return markers;
};
