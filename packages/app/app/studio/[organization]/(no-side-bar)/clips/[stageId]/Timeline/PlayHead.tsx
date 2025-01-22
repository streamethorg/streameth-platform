import React, { useCallback, useEffect, useState } from 'react';
import useTimeline from './useTimeline';
import { useTimelineContext } from './TimelineContext';
import { useClipContext } from '../ClipContext';
import usePlayer from '@/lib/hooks/usePlayer';

const Playhead = () => {
  const [draggingPlayhead, setDraggingPlayhead] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState(0);
  const [initialEventStart, setInitialEventStart] = useState(0);
  const { videoDuration, timelineWidth, setPlayheadPosition, playheadPosition } = useTimelineContext();
  const { calculateTimeFromPosition, calculatePositionOnTimeline } = useTimeline();
  const { videoRef } = useClipContext();
  const { currentTime, handleSetCurrentTime } = usePlayer(videoRef);


  const handleSetPlayheadPosition = (time: number) => {
    setPlayheadPosition(time);
    handleSetCurrentTime(time);
  };

  useEffect(() => {
    setPlayheadPosition(currentTime);
  }, [currentTime]);

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingPlayhead(true);
    setInitialMousePos(e.clientX);
    setInitialEventStart(currentTime);
  };

  const handlePlayheadMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingPlayhead) {

        const newTime = calculateTimeFromPosition(
          initialMousePos,
          e.clientX,
          videoDuration,
          timelineWidth,
          initialEventStart
        );
        handleSetPlayheadPosition(newTime);
      }
    },
    [
      draggingPlayhead,
      initialMousePos,
      initialEventStart,
      videoDuration,
      timelineWidth,
      handleSetPlayheadPosition,
    ]
  );

  const handlePlayheadMouseUp = useCallback(() => {
    setDraggingPlayhead(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handlePlayheadMouseMove);
    window.addEventListener('mouseup', handlePlayheadMouseUp);
    return () => {
      window.removeEventListener('mousemove', handlePlayheadMouseMove);
      window.removeEventListener('mouseup', handlePlayheadMouseUp);
    };
  }, [handlePlayheadMouseMove, handlePlayheadMouseUp]);

  return (
    <div
      className="absolute top-0 bottom-0 w-1 bg-black border-white cursor-ew-resize z-[22]"
      style={{ left: `${calculatePositionOnTimeline(playheadPosition, videoDuration, timelineWidth)}px` }}
      onMouseDown={handlePlayheadMouseDown}
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black border border-white rounded-3xl" />
    </div>
  );
};

export default Playhead;
