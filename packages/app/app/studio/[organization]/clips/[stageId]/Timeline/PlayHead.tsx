import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useClipContext } from '../ClipContext';

interface TimelinePlayheadProps {
  maxLength: number;
  timelineWidth: number;
}

const Playhead: React.FC<TimelinePlayheadProps> = ({
  maxLength,
  timelineWidth,
}) => {
  const [draggingPlayhead, setDraggingPlayhead] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState(0);
  const [initialEventStart, setInitialEventStart] = useState(0);
  const { videoRef } = useClipContext();
  const playerTime = videoRef.current?.currentTime || 0;

  const [currentTime, setCurrentTime] = useState(
    videoRef.current?.currentTime || 0
  );

  useEffect(() => {
    if (!draggingPlayhead) {
      setCurrentTime(playerTime);
    }
  }, [draggingPlayhead, playerTime]);

  const getMarkerPosition = (time: number) =>
    (time / maxLength) * timelineWidth;
  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingPlayhead(true);
    setInitialMousePos(e.clientX);
    setInitialEventStart(currentTime);
  };

  const handlePlayheadMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingPlayhead && videoRef.current) {
        const mouseDelta = e.clientX - initialMousePos;
        const timeDelta = (mouseDelta / timelineWidth) * maxLength;
        const newTime = Math.max(
          0,
          Math.min(maxLength, initialEventStart + timeDelta)
        );
        setCurrentTime(newTime);
        videoRef.current.currentTime = newTime;
      }
    },
    [
      draggingPlayhead,
      initialMousePos,
      initialEventStart,
      maxLength,
      setCurrentTime,
      timelineWidth,
      videoRef,
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
      className="absolute top-0 bottom-0 w-1 bg-black border-white  cursor-ew-resize z-10"
      style={{ left: `${getMarkerPosition(currentTime)}px` }}
      onMouseDown={handlePlayheadMouseDown}
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black border border-white rounded-3xl" />
    </div>
  );
};

export default Playhead;
