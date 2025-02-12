'use client';
import React, { createContext, useContext, useState, useRef } from 'react';
import Hls from 'hls.js';
import { ClipPageContextType, PlaybackStatus } from '@/lib/types';
const ClipPageContext = createContext<ClipPageContextType | null>(null);

export const useClipPageContext = () => useContext(ClipPageContext)!;

export const ClipPageProvider = ({
  children,
  stageId,
  clipUrl,
  sessionId,
}: {
  children: React.ReactNode;
  stageId: string;
  clipUrl: string;
  sessionId: string;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [selectedTooltip, setSelectedTooltip] = useState<string | null>(null);
  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(false);
  const [hls, setHls] = useState<Hls | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>(
    null
  );

  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  return (
    <ClipPageContext.Provider
      value={{
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
        clipUrl,
        playbackStatus,
        setPlaybackStatus,
        isInputFocused,
        setIsInputFocused,
        sessionId,
      }}
    >
      {children}
    </ClipPageContext.Provider>
  );
};
