import { useTimelineContext } from '../context/TimelineContext';
import React, { useCallback, useEffect, useState } from 'react';
import useTimeline from '../../clips/[stageId]/Timeline/useTimeline';

const TimelinePlayhead: React.FC = () => {
  const {
    currentTime,
    maxDuration,
    timelineWidth,
    setTimelineAction,
    setInitialMousePos,
  } = useTimelineContext();

  const { calculatePositionOnTimeline } = useTimeline();

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimelineAction('playheadDrag');
    setInitialMousePos(e.clientX);
  };

  return (
    <div
      className="absolute top-0 bottom-0 w-1 bg-red-500 cursor-ew-resize z-10"
      style={{
        left: `${calculatePositionOnTimeline(currentTime, maxDuration, timelineWidth)}px`,
      }}
      onMouseDown={handlePlayheadMouseDown}
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
    </div>
  );
};

export default TimelinePlayhead;
