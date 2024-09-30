'use client';
import React from 'react';
import { useClipContext } from '../ClipContext';
import TrimmControls, { TrimmOverlay } from './TrimmControls';
import Playhead from './PlayHead';
import { formatTime } from '@/lib/utils/time';
import { useEffect, useState, useRef, useCallback } from 'react';

const Timeline = () => {
  const {
    videoRef,
    dragging,
    isLoading,
    filteredMarkers,
    handleMouseDown: handleTrimmControlsMouseDown, // Rename this to avoid confusion
    handleMarkerClick,
    goToClickTime,
    selectedMarkerId,
    pixelsPerSecond,
    setPixelsPerSecond,
  } = useClipContext();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, marker?: string) => {
      if (marker) {
        // This is a TrimmControls mousedown event
        handleTrimmControlsMouseDown(marker, e);
      } else {
        // This is a Timeline mousedown event
        if (!timelineRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - timelineRef.current.offsetLeft);
        setScrollLeft(timelineRef.current.scrollLeft);
      }
    },
    [handleTrimmControlsMouseDown]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !timelineRef.current) return;
      e.preventDefault();
      const x = e.pageX - timelineRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Adjust scrolling speed
      timelineRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const maxLength = videoRef.current?.duration || 0;
  const timelineWidth = maxLength * pixelsPerSecond;

  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;
      const minScale = 0.1; // Further reduced minimum pixels per second
      const maxScale = 10; // Maximum pixels per second
      const targetWidth = screenWidth * 0.7; // Increased target timeline width to 70% of screen width

      // Calculate initial scale
      let scale = targetWidth / maxLength;

      // Adjust scale for longer videos
      if (maxLength > 10800) {
        // More than 3 hours
        scale = Math.min(scale, 0.15); // Limit scale to 0.2 pixels per second for extremely long videos
      } else if (maxLength > 7200) {
        // 2 to 3 hours
        scale = Math.min(scale, 0.5); // Limit scale to 0.5 pixels per second
      } else if (maxLength > 3600) {
        // 1 to 2 hours
        scale = Math.min(scale, 1); // Limit scale to 1 pixel per second
      } else if (maxLength > 1800) {
        // 30 minutes to 1 hour
        scale = Math.min(scale, 2); // Limit scale to 2 pixels per second
      }

      scale = Math.max(minScale, Math.min(maxScale, scale));

      setPixelsPerSecond(scale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);

    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, [maxLength]);

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
      className={`relative flex flex-col w-full bg-white h-[200px] overflow-x-scroll overflow-y-hidden ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onClick={(e) => !isDragging && goToClickTime(e)}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className="h-[100px] relative"
        style={{ width: `${timelineWidth}px` }}
      >
        {filteredMarkers &&
          filteredMarkers.map((marker) => {
            if (marker.startClipTime > maxLength) return null;
            return (
              <div
                key={marker._id}
                className={`absolute h-[20px] border bg-opacity-20 rounded`}
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
        <TimelineDrawing
          maxLength={maxLength}
          timelineWidth={timelineWidth}
          scale={pixelsPerSecond}
        />
        <TrimmControls
          {...{
            handleMouseDown: (e: React.MouseEvent) =>
              handleMouseDown(e, 'start'),
            marker: 'start',
            blocked: isLoading && dragging !== 'start',
          }}
        />
        <TrimmOverlay />
        <TrimmControls
          {...{
            handleMouseDown: (e: React.MouseEvent) => handleMouseDown(e, 'end'),
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
