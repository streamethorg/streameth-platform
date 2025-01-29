'use client';
import React from 'react';
import { useTrimmControlsContext } from './TrimmControlsContext';
import { useTimelineContext } from './TimelineContext';
import useTimeline from './useTimeline';

const TrimmControls = ({
  marker,
  blocked,
}: {
  marker: string;
  blocked: boolean;
}) => {
  const { startTime, endTime, handleMouseDown } = useTrimmControlsContext();
  const { videoDuration, timelineWidth, pixelsPerSecond, isPreviewMode } =
    useTimelineContext();
  const { calculatePositionOnTimeline } = useTimeline();

  const position = calculatePositionOnTimeline(
    marker === 'start' ? startTime : endTime,
    videoDuration,
    timelineWidth
  );

  return (
    <div
      className={`absolute h-[calc(100%-20px)] w-[5px] top-6 z-40`}
      style={{ left: `${position}px` }}
      onMouseDown={(e) => {
        !blocked && handleMouseDown(marker, e);
      }}
    >
      <div className="relative h-full w-full z-50">
        <div
          id={marker}
          className={` h-full cursor-pointer ${
            marker !== 'start'
              ? 'translate-x-[-100%] rounded-r-xl'
              : 'rounded-l-xl'
          } `}
          style={{
            background: isPreviewMode ? 'rgba(255, 191, 0, 1)' : 'rgba(200, 75, 80, 1)',
          }}
        />
      </div>
    </div>
  );
};

export const TrimmOverlay = () => {
  const { startTime, endTime } = useTrimmControlsContext();
  const { videoDuration, timelineWidth, isPreviewMode } = useTimelineContext();
  const { calculatePositionOnTimeline } = useTimeline();

  const startPosition = calculatePositionOnTimeline(
    startTime,
    videoDuration,
    timelineWidth
  );
  const endPosition = calculatePositionOnTimeline(
    endTime,
    videoDuration,
    timelineWidth
  );

  return (
    <div
      className="absolute flex rounded-xl h-[calc(100%-20px)] top-6"
      style={{
        background: isPreviewMode ? 'rgba(255, 191, 0, 0.35)' : 'rgba(200, 75, 80, 0.4)',
        left: `${startPosition}px`,
        width: `${endPosition - startPosition}px`,
      }}
    ></div>
  );
};

export default TrimmControls;
