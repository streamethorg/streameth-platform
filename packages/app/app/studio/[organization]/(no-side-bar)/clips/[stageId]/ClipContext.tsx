'use client';
import React, {
  createContext,
  useContext,
  useState,
  useRef,
} from 'react';
import Hls from 'hls.js';
import { PlaybackStatus, TimeSettings } from '@/lib/types';
import { ClipContextType } from '@/lib/types';

const ClipContext = createContext<ClipContextType | null>(null);

export const useClipContext = () => useContext(ClipContext)!;

export const ClipProvider = ({
  children,
  stageId,
  organizationId,
  clipUrl,
}: {
  children: React.ReactNode;
  stageId: string;
  organizationId: string;
  clipUrl: string;
}) => {
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [selectedTooltip, setSelectedTooltip] = useState<string | null>(null);
  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(false);
  const [pixelsPerSecond, setPixelsPerSecond] = useState(3);
  const [hls, setHls] = useState<Hls | null>(null);
  const [startTime, setStartTime] = useState<TimeSettings>({ unix: 0, displayTime: 0 });
  const [endTime, setEndTime] = useState<TimeSettings>({ unix: 0, displayTime: 0 });
  const [timeReference, setTimeReference] = useState(0);

  const convertSecondsToUnix = (reference: number, seconds: number) => {
    return reference + seconds;
  };

  return (
    <ClipContext.Provider
      value={{
        playbackStatus,
        setPlaybackStatus,
        isLoading,
        setIsLoading,
        videoRef,
        dragging,
        setDragging,
        selectedTooltip,
        setSelectedTooltip,
        stageId,
        isCreatingClip,
        setIsCreatingClip,
        hls,
        setHls,
        pixelsPerSecond,
        setPixelsPerSecond,
        clipUrl,
        organizationId,
        startTime,
        endTime,
        setStartTime,
        setEndTime,
        timeReference,
        convertSecondsToUnix,
      }}
    >
      {children}
    </ClipContext.Provider>
  );
};
