'use client';

import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useClipPageContext } from '../ClipPageContext';
import useTimeline from './useTimeline';
import usePlayer from '@/lib/hooks/usePlayer';
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
  const { calculateTimelineScale } = useTimeline();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [pixelsPerSecond, setPixelsPerSecond] = useState(10);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [playheadPosition, setPlayheadPosition] = useState<number>(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
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
    if (videoRef.current) {
      const timelineElement = event.currentTarget as HTMLElement;
      const timelineRect = timelineElement.getBoundingClientRect();
      const relativeClickX = event.clientX - timelineRect.left;
      const clickTime = (relativeClickX / timelineWidth) * duration;
      if (
        isPreviewMode &&
        (clickTime < previewTimeBounds.startTime ||
          clickTime > previewTimeBounds.endTime)
      ) {
        return;
      }
      handleSetCurrentTime(clickTime);
      setPlayheadPosition(clickTime);
    }
  };

  useEffect(() => {
    if (isPreviewMode) {
      if (currentTime >= previewTimeBounds.endTime) {
        handleSetCurrentTime(previewTimeBounds.startTime);
      }
      if (currentTime < previewTimeBounds.startTime) {
        handleSetCurrentTime(previewTimeBounds.startTime + 0.1);
      }
    }
  }, [currentTime, isPreviewMode, previewTimeBounds]);

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
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
