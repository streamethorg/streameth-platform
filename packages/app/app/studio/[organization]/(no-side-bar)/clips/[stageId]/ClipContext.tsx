'use client';
import React, {
  createContext,
  useContext,
  useState,
  useRef,
} from 'react';
import Hls from 'hls.js';

type PlaybackStatus = {
  progress: number;
  offset: number;
};

type PlaybackTime = {
  displayTime: number;
};

type ClipContextType = {
  playbackStatus: PlaybackStatus | null;
  setPlaybackStatus: React.Dispatch<
    React.SetStateAction<PlaybackStatus | null>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  videoRef: React.RefObject<HTMLVideoElement>;
  dragging: string | null;
  setDragging: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTooltip: string | null;
  setSelectedTooltip: React.Dispatch<React.SetStateAction<string | null>>;
  stageId: string;
  isCreatingClip: boolean;
  setIsCreatingClip: React.Dispatch<React.SetStateAction<boolean>>;
  hls: Hls | null;
  setHls: React.Dispatch<React.SetStateAction<Hls | null>>;
  pixelsPerSecond: number;
  setPixelsPerSecond: React.Dispatch<React.SetStateAction<number>>;
  clipUrl: string;
  organizationId: string;
};

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
      }}
    >
      {children}
    </ClipContext.Provider>
  );
};
