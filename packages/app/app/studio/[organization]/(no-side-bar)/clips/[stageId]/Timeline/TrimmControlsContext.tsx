'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import useTimeline from './useTimeline';
import { useTimelineContext } from './TimelineContext';
import usePlayer from '@/lib/hooks/usePlayer';
interface TrimmControlsContextType {
  startTime: number;
  endTime: number;
  setStartTime: (startTime: number) => void;
  setEndTime: (endTime: number) => void;
  handleMouseDown: (marker: string, event: React.MouseEvent) => void;
}

export const TrimmControlsContext =
  createContext<TrimmControlsContextType | null>(null);

export const useTrimmControlsContext = () => useContext(TrimmControlsContext)!;

export const TrimmControlsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { calculateTimeFromPosition } = useTimeline();
  const { timelineWidth, videoRef, isPreviewMode } = useTimelineContext();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [initialMousePos, setInitialMousePos] = useState(0);
  const [dragging, setDragging] = useState<string | null>(null);
  const [initialEventStart, setInitialEventStart] = useState(0);
  const { videoDuration } = usePlayer(videoRef);
  const handleMouseDown = (marker: string, event: React.MouseEvent) => {
    setDragging(marker);
    // setSelectedTooltip(marker);
    setInitialMousePos(event.clientX);
    setInitialEventStart(marker === 'start' ? startTime : endTime);
  };

  useEffect(() => {
    if (endTime === 0 || isNaN(endTime)) {
      setEndTime(videoDuration);
    }
  }, [videoDuration]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (dragging && !isPreviewMode) {
        switch (dragging) {
          case 'start':
            const newStartTime = calculateTimeFromPosition(
              initialMousePos,
              event.clientX,
              videoDuration,
              timelineWidth,
              initialEventStart
            );
            if (newStartTime > videoDuration || newStartTime < 0) {
              return;
            }
            setStartTime(newStartTime);
            break;
          case 'end':
            const newEndTime = calculateTimeFromPosition(
              initialMousePos,
              event.clientX,
              videoDuration,
              timelineWidth,
              initialEventStart
            );
            if (newEndTime > videoDuration) {
              setEndTime(videoDuration);
            }
            if (newEndTime < 0 || newEndTime < startTime) {
              return;
            }
            setEndTime(newEndTime);
            break;
          // case 'overlay':
          //   const newStartTime = calculateTimeFromPosition(initialMousePos, event.clientX, maxLength, timelineWidth);
          //   setStartTime(newStartTime);
          //   break;
        }
      }
    },
    [
      dragging,
      initialMousePos,
      videoDuration,
      timelineWidth,
      setStartTime,
      setEndTime,
      isPreviewMode,
      initialEventStart,
      calculateTimeFromPosition,
      startTime,
    ]
  );

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    <TrimmControlsContext.Provider
      value={{ startTime, endTime, setStartTime, setEndTime, handleMouseDown }}
    >
      {children}
    </TrimmControlsContext.Provider>
  );
};
