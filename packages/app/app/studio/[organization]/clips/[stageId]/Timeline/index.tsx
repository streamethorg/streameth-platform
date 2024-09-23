'use client';
import React from 'react';
import { useClipContext } from '../ClipContext';
import TrimmControls, { TrimmOverlay } from './TrimmControls';
import Playhead from './PlayHead';
import { formatTime } from '@/lib/utils/time';

const Timeline = () => {
  const {
    videoRef,
    dragging,
    isLoading,
    markers,
    handleMouseDown,
    handleMarkerClick,
    goToClickTime,
  } = useClipContext();

  const maxLength = videoRef.current?.duration || 0;
  const pixelsPerSecond = 4;
  const timelineWidth = maxLength * pixelsPerSecond;

  if (!maxLength || !timelineWidth || !videoRef.current)
    return (
      // loading state
      <div className="relative flex flex-col w-full bg-white p-2 h-[200px] overflow-scroll">
        <div className="h-full w-full bg-slate-200 animate-pulse rounded-xl"></div>
      </div>
    );

  return (
    <div
      className="relative flex flex-col w-full bg-white h-[200px] overflow-scroll"
      onClick={(e) => goToClickTime(e)}
    >
      <div
        className="h-[100px] relative"
        style={{ width: `${timelineWidth}px` }}
      >
        {markers &&
          markers.map((marker) => {
            if (marker.start > maxLength) return null;
            return (
              <div
                key={marker._id}
                className={`absolute h-[20px] border bg-opacity-20 rounded`}
                onClick={() => handleMarkerClick(marker)}
                style={{
                  backgroundColor: marker.color,
                  border: `3px solid ${marker.color}`,
                  left: `${(marker.start / maxLength) * timelineWidth}px`,
                  width: `${((marker.end - marker.start) / maxLength) * timelineWidth}px`,
                }}
              />
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
            handleMouseDown,
            marker: 'start',
            blocked: isLoading && dragging !== 'start',
          }}
        />
        <TrimmOverlay />
        <TrimmControls
          {...{
            handleMouseDown,
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

  const markers = [];
  for (let i = 0; i <= maxLength; i += 3) {
    const position = getMarkerPosition(i);

    if (i % 30 === 0) {
      markers.push(
        <div
          key={i}
          className="absolute h-full top-6"
          style={{ left: `${position}px` }}
        >
          <div className="absolute bottom-0 left-0 transform -translate-x-1/2 text-xs text-gray-400 ">
            {`${formatTime(i)}`}
          </div>
          <div className="absolute  h-[calc(100%-17px)] border-l border-gray-600"></div>
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
