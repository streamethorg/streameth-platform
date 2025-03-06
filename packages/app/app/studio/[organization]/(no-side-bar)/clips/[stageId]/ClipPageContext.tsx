'use client';
import React, { createContext, useContext, useState, useRef } from 'react';
import { IMetadata, PlaybackStatus } from '@/lib/types';
import { PlayerRef } from '@remotion/player';
import { ITranscript } from 'streameth-new-server/src/interfaces/transcribe.interface';
import { ICaptionOptions } from 'streameth-reel-creator/types/constants';

export type ClipPageContextType = {
  transcript: ITranscript | null;
  setTranscript: React.Dispatch<React.SetStateAction<ITranscript | null>>;
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
  captionsOptions: ICaptionOptions | null;
  setCaptionsOptions: React.Dispatch<
    React.SetStateAction<ICaptionOptions | null>
  >;
  metadata: IMetadata;
  selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  setSelection: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>
  >;
};

const ClipPageContext = createContext<ClipPageContextType | null>(null);

export const useClipPageContext = () => useContext(ClipPageContext)!;

export const ClipPageProvider = ({
  children,
  stageId,
  sessionId,
  metadata,
  transcript: initialTranscript,
}: {
  children: React.ReactNode;
  stageId: string;
  sessionId: string;
  metadata: IMetadata;
  transcript: ITranscript | null;
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
  const [captionsOptions, setCaptionsOptions] =
    useState<ICaptionOptions | null>(null);

  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<ITranscript | null>(
    initialTranscript
  );
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
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
        transcript,
        setTranscript,
        selection,
        setSelection,
      }}
    >
      {children}
    </ClipPageContext.Provider>
  );
};
