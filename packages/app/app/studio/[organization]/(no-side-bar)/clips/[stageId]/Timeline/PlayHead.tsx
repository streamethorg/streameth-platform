import React, { useCallback, useEffect, useState } from 'react';
import useTimeline from './useTimeline';
import { useTimelineContext } from './TimelineContext';
import { useClipPageContext } from '../ClipPageContext';
import { useRemotionPlayer } from '@/lib/hooks/useRemotionPlayer';
import { useEventContext } from './EventConntext';
const Playhead = () => {
  const {
    setPlayheadPosition,
    playheadPosition,
    playHeadEvent,
    initialEventStart,
    timelineRef,
    timelineWidth,
    setPlayHeadEvent,
    setInitialEventStart,
  } = useTimelineContext();
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const { isTimeInEventRange, getEventsBounds } = useEventContext();
  const { metadata, videoRef } = useClipPageContext();
  const {
    calculateTimeFromPositionDelta,
    calculatePositionOnTimeline,
    calculateTimeFromPosition,
  } = useTimeline(timelineRef);
  const { currentTime, handleSetCurrentTime } = useRemotionPlayer(
    videoRef,
    metadata.fps
  );

  const handleSetPlayheadPosition = (time: number) => {
    setPlayheadPosition(time);
    handleSetCurrentTime(time);
  };

  useEffect(() => {
    if (!isTimeInEventRange(currentTime)) {
      handleSetCurrentTime(getEventsBounds(currentTime).minStart + 0.1);
      setPlayheadPosition(getEventsBounds(currentTime).minStart + 0.1);
    }
    setPlayheadPosition(currentTime);
  }, [currentTime]);

  const handlePlayheadMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!timelineRef.current) return;
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const scrollLeft = timelineRef.current.scrollLeft || 0;
      const pos = timelineRect.left;

      if (playHeadEvent === 'drag') {
        const newTime = calculateTimeFromPositionDelta(
          e.clientX - pos + scrollLeft,
          metadata.duration,
          initialEventStart,
          timelineWidth
        );
        if (!isTimeInEventRange(newTime)) {
          return;
        }
        handleSetPlayheadPosition(newTime);
      }
      if (playHeadEvent === 'hover') {
        const newTime = calculateTimeFromPosition(
          e.clientX - pos + scrollLeft,
          metadata.duration,
          timelineWidth
        );
        setHoverPosition(newTime);
      }
    },
    [playHeadEvent, initialEventStart, metadata.duration, timelineWidth]
  );

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayHeadEvent('drag');
    if (!timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = timelineRef.current.scrollLeft || 0;
    const pos = timelineRect.left;

    setInitialEventStart(
      calculateTimeFromPosition(
        e.clientX - pos + scrollLeft,
        metadata.duration,
        timelineWidth
      )
    );
  };

  const handlePlayheadMouseUp = () => {
    if (playHeadEvent === 'drag') {
      setPlayHeadEvent(null);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handlePlayheadMouseMove);
    return () => {
      window.removeEventListener('mousemove', handlePlayheadMouseMove);
    };
  }, [handlePlayheadMouseMove]);

  useEffect(() => {
    if (playHeadEvent === null) {
      setHoverPosition(null);
    }
  }, [playHeadEvent]);

  return (
    <>
      <div
        id="playhead-drag-handle"
        className="absolute top-0 bottom-0 w-[2px] bg-gray-600 cursor-ew-resize z-[22]"
        style={{
          left: `${calculatePositionOnTimeline(
            playheadPosition,
            metadata.duration,
            timelineWidth
          )}px`,
        }}
        onMouseDown={handlePlayheadMouseDown}
        onMouseUp={handlePlayheadMouseUp}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-600 rounded-b-xl" />
      </div>
      {playHeadEvent === 'hover' && hoverPosition !== null && (
        <div
          id="playhead-hover-handle"
          className="absolute top-0 bottom-0 w-[2px] bg-gray-600 cursor-ew-resize"
          style={{
            left: `${calculatePositionOnTimeline(
              hoverPosition,
              metadata.duration,
              timelineWidth
            )}px`,
          }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-600 rounded-b-xl" />
        </div>
      )}
    </>
  );
};

export default Playhead;
