'use client';

import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useClipPageContext } from '../ClipPageContext';
import useTimeline from './useTimeline';
import usePlayer from '@/lib/hooks/usePlayer';

type TimelineContextType = {
  timelineRef: React.RefObject<HTMLDivElement>;
  videoDuration: number;
  setVideoDuration: React.Dispatch<React.SetStateAction<number>>;
  timelineWidth: number;
  setTimelineWidth: React.Dispatch<React.SetStateAction<number>>;
  videoRef: React.RefObject<HTMLVideoElement>;
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
  const { videoRef } = useClipPageContext();
  const { currentTime, handleSetCurrentTime } = usePlayer(videoRef);
  const { calculateTimelineScale } = useTimeline();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [pixelsPerSecond, setPixelsPerSecond] = useState(10);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playheadPosition, setPlayheadPosition] = useState<number>(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewTimeBounds, setPreviewTimeBounds] = useState<{
    startTime: number;
    endTime: number;
  }>({ startTime: 0, endTime: 0 });
  useEffect(() => {
    if (videoRef.current && timelineRef.current) {
      setVideoDuration(videoRef.current.duration);
      const scale = calculateTimelineScale({
        timelineContainerWidth: timelineRef.current.offsetWidth,
        maxLength: videoRef.current.duration,
      });
      setPixelsPerSecond(scale);
      setTimelineWidth(videoRef.current.duration * scale);
    }
  }, [videoRef.current?.duration]);

  const handleTimelineClick = (event: React.MouseEvent) => {
    if (videoRef.current) {
      const timelineElement = event.currentTarget as HTMLElement;
      const timelineRect = timelineElement.getBoundingClientRect();
      const relativeClickX = event.clientX - timelineRect.left;
      const clickTime = (relativeClickX / timelineWidth) * videoDuration;
      console.log(clickTime, previewTimeBounds);
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
        videoRef,
        timelineRef,
        pixelsPerSecond,
        setPixelsPerSecond,
        timelineWidth,
        videoDuration,
        playheadPosition,
        setPlayheadPosition,
        setTimelineWidth,
        setVideoDuration,
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
