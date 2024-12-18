import { useTimeline } from '@/context/TimelineContext';
import React, { useCallback, useEffect, useState } from 'react';

interface TimelinePlayheadProps {
  maxLength: number;
  timelineWidth: number;
}

const TimelinePlayhead: React.FC<TimelinePlayheadProps> = ({ maxLength, timelineWidth }) => {
  const [draggingPlayhead, setDraggingPlayhead] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState(0);
  const [initialEventStart, setInitialEventStart] = useState(0);
  const { setCurrentTime, currentTime } = useTimeline()

  const getMarkerPosition = (time: number) => (time / maxLength) * timelineWidth;
  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingPlayhead(true);
    setInitialMousePos(e.clientX);
    setInitialEventStart(currentTime);
  };

  const handlePlayheadMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingPlayhead) {
        const mouseDelta = e.clientX - initialMousePos;
        const timeDelta = (mouseDelta / timelineWidth) * maxLength;
        const newTime = Math.max(0, Math.min(maxLength, initialEventStart + timeDelta));
        setCurrentTime(newTime);
      }
    },
    [draggingPlayhead, initialMousePos, initialEventStart, maxLength, setCurrentTime, timelineWidth]
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
      className="absolute top-0 bottom-0 w-1 bg-red-500 cursor-ew-resize z-10" 
      style={{ left: `${getMarkerPosition(currentTime)}px` }}
      onMouseDown={handlePlayheadMouseDown}
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
    </div>
  );
};

export default TimelinePlayhead;