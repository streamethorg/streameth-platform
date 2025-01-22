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
  const { timelineWidth, videoDuration } = useTimelineContext();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(1000);
  const [initialMousePos, setInitialMousePos] = useState(0);
  const [dragging, setDragging] = useState<string | null>(null);
  const [initialEventStart, setInitialEventStart] = useState(0);

  const handleMouseDown = (marker: string, event: React.MouseEvent) => {
    setDragging(marker);
    // setSelectedTooltip(marker);
    setInitialMousePos(event.clientX);
    setInitialEventStart(marker === 'start' ? startTime : endTime);
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (dragging) {
        switch (dragging) {
          case 'start':
            const newStartTime = calculateTimeFromPosition(
              initialMousePos,
              event.clientX,
              videoDuration,
              timelineWidth,
              initialEventStart
            );
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
