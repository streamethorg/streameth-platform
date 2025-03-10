'use client';

import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useClipPageContext } from '../ClipPageContext';
import useTimeline from './useTimeline';
import { useRemotionPlayer } from '@/lib/hooks/useRemotionPlayer';

type TimelineContextType = {
  timelineRef: React.RefObject<HTMLDivElement>;
  timelineWidth: number;
  setTimelineWidth: React.Dispatch<React.SetStateAction<number>>;
  pixelsPerSecond: number;
  setPixelsPerSecond: React.Dispatch<React.SetStateAction<number>>;
  playheadPosition: number;
  setPlayheadPosition: React.Dispatch<React.SetStateAction<number>>;
  handleTimelineClick: (event: React.MouseEvent) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  previewTimeBounds: {
    startTime: number;
    endTime: number;
  };
  setPreviewTimeBounds: React.Dispatch<
    React.SetStateAction<{ startTime: number; endTime: number }>
  >;
  playHeadEvent: 'drag' | 'hover' | null;
  setPlayHeadEvent: React.Dispatch<React.SetStateAction<'drag' | 'hover' | null>>;
  initialEventStart: number;
  setInitialEventStart: React.Dispatch<React.SetStateAction<number>>;
};

const TimelineContext = createContext<TimelineContextType | null>(null);

export const useTimelineContext = () => useContext(TimelineContext)!;

export const TimelineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { videoRef, metadata } = useClipPageContext();
  const { duration, fps } = metadata;
  const { currentTime, handleSetCurrentTime } = useRemotionPlayer(
    videoRef,
    fps
  );
  const timelineRef = useRef<HTMLDivElement>(null);
  const { calculateTimelineScale, calculateTimeFromPosition } = useTimeline(timelineRef);
  const [pixelsPerSecond, setPixelsPerSecond] = useState(10);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [playheadPosition, setPlayheadPosition] = useState<number>(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [playHeadEvent, setPlayHeadEvent] = useState<'drag' | 'hover' | null>(null);
  const [initialEventStart, setInitialEventStart] = useState(0);
  const [previewTimeBounds, setPreviewTimeBounds] = useState<{
    startTime: number;
    endTime: number;
  }>({ startTime: 0, endTime: 0 });
  useEffect(() => {
    if (videoRef.current && timelineRef.current) {
      const scale = calculateTimelineScale({
        timelineContainerWidth: timelineRef.current.offsetWidth,
        maxLength: duration,
      });
      setPixelsPerSecond(scale);
      setTimelineWidth(duration * scale);
    }
  }, [duration]);

  const handleTimelineClick = (event: React.MouseEvent) => {
    const clickTime = calculateTimeFromPosition(event.clientX, duration);
    handleSetCurrentTime(clickTime);
    setPlayheadPosition(clickTime);
  };

  return (
    <TimelineContext.Provider
      value={{
        timelineRef,
        pixelsPerSecond,
        setPixelsPerSecond,
        timelineWidth,
        playheadPosition,
        setPlayheadPosition,
        setTimelineWidth,
        handleTimelineClick,
        isPreviewMode,
        setIsPreviewMode,
        previewTimeBounds,
        setPreviewTimeBounds,
        playHeadEvent,
        setPlayHeadEvent,
        initialEventStart,
        setInitialEventStart,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
