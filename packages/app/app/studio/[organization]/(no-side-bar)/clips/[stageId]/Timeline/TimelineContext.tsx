'use client';

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import { useClipContext } from '../ClipContext';
import  useTimeline  from './useTimeline';

type TimelineContextType = {
  timelineRef: React.RefObject<HTMLDivElement>;
  videoDuration: number;
  setVideoDuration: React.Dispatch<React.SetStateAction<number>>;
  timelineWidth: number;
  setTimelineWidth: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  videoRef: React.RefObject<HTMLVideoElement>;
  isCreatingClip: boolean;
  setIsCreatingClip: React.Dispatch<React.SetStateAction<boolean>>;
  pixelsPerSecond: number;
  setPixelsPerSecond: React.Dispatch<React.SetStateAction<number>>;
  currentTime: number;
  playheadPosition: number;
  setPlayheadPosition: React.Dispatch<React.SetStateAction<number>>;
  handleSetCurrentTime: (time: number) => void;
};

const TimelineContext = createContext<TimelineContextType | null>(null);

export const useTimelineContext = () => useContext(TimelineContext)!;

export const TimelineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { videoRef } = useClipContext();
  const {calculateTimelineScale} = useTimeline();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [pixelsPerSecond, setPixelsPerSecond] = useState(10);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

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

  const handleSetCurrentTime = (time: number) => {
    videoRef.current!.currentTime = time;
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(false);
  const [playheadPosition, setPlayheadPosition] = useState<number>(0);




  return (
    <TimelineContext.Provider
      value={{
        isLoading,
        setIsLoading,
        videoRef,
        timelineRef,
        isCreatingClip,
        setIsCreatingClip,
        currentTime: videoRef.current?.currentTime || 0,
        handleSetCurrentTime,
        pixelsPerSecond,
        setPixelsPerSecond,
        timelineWidth,
        videoDuration,
        playheadPosition,
        setPlayheadPosition,
        setTimelineWidth,
        setVideoDuration,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
