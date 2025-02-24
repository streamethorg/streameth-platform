'use client';
import React, { createContext, useContext, useState, useRef } from 'react';
import { IMetadata, PlaybackStatus } from '@/lib/types';
import { PlayerRef } from '@remotion/player';

export type ClipPageContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  videoRef: React.RefObject<PlayerRef>;
  dragging: string | null;
  setDragging: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTooltip: string | null;
  setSelectedTooltip: React.Dispatch<React.SetStateAction<string | null>>;
  stageId?: string;
  isCreatingClip: boolean;
  setIsCreatingClip: React.Dispatch<React.SetStateAction<boolean>>;
  playbackStatus: PlaybackStatus | null;
  setPlaybackStatus: React.Dispatch<
    React.SetStateAction<PlaybackStatus | null>
  >;
  isInputFocused: boolean;
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  sessionId: string;
  aspectRatio: string | null;
  setAspectRatio: React.Dispatch<React.SetStateAction<string | null>>;
  captionsOptions: {
    enabled: boolean;
    linesPerPage: string;
    position: string;
    font: string;
    color: string;
  } | null;
  setCaptionsOptions: React.Dispatch<
    React.SetStateAction<{
      enabled: boolean;
      linesPerPage: string;
      position: string;
      font: string;
      color: string;
    } | null>
  >;
  metadata: IMetadata;
};

const ClipPageContext = createContext<ClipPageContextType | null>(null);

export const useClipPageContext = () => useContext(ClipPageContext)!;

export const ClipPageProvider = ({
  children,
  stageId,
  sessionId,
  metadata,
}: {
  children: React.ReactNode;
  stageId: string;
  sessionId: string;
  metadata: IMetadata;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<PlayerRef>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [selectedTooltip, setSelectedTooltip] = useState<string | null>(null);
  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(false);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>(
    null
  );
  const [aspectRatio, setAspectRatio] = useState<string | null>('16:9');
  const [captionsOptions, setCaptionsOptions] = useState<{
    enabled: boolean;
    linesPerPage: string;
    position: string;
    font: string;
    color: string;
  } | null>(null);

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
        playbackStatus,
        setPlaybackStatus,
        isInputFocused,
        setIsInputFocused,
        sessionId,
        aspectRatio,
        setAspectRatio,
        captionsOptions,
        setCaptionsOptions,
        metadata,
      }}
    >
      {children}
    </ClipPageContext.Provider>
  );
};
