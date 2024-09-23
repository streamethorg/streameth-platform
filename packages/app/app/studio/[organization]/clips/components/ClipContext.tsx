'use client';
import React, { createContext, useContext, useState, useRef } from 'react';

export interface IMarker {
  id: string;
  start: number;
  end: number;
  color: string;
  title: string;
}
type PlaybackStatus = {
  progress: number;
  offset: number;
};

type PlaybackTime = {
  displayTime: number;
  unix: number;
};

type ClipContextType = {
  playbackStatus: PlaybackStatus | null;
  setPlaybackStatus: React.Dispatch<
    React.SetStateAction<PlaybackStatus | null>
  >;
  startTime: PlaybackTime;
  setStartTime: React.Dispatch<React.SetStateAction<PlaybackTime>>;
  endTime: PlaybackTime;
  setEndTime: React.Dispatch<React.SetStateAction<PlaybackTime>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  videoRef: React.RefObject<HTMLVideoElement>;
  dragging: string | null;
  setDragging: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTooltip: string | null;
  setSelectedTooltip: React.Dispatch<React.SetStateAction<string | null>>;
  fragmentLoading: boolean;
  setFragmentLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateClipBounds: (start: number, end: number) => void;
  markers: IMarker[];
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>;
};

const ClipContext = createContext<ClipContextType | null>(null);

export const useClipContext = () => useContext(ClipContext)!;

export const ClipProvider = ({ children }: { children: React.ReactNode }) => {
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>(
    null
  );
  const [startTime, setStartTime] = useState<PlaybackTime>({
    displayTime: 0,
    unix: 0,
  });
  const [endTime, setEndTime] = useState<PlaybackTime>({
    displayTime: 0,
    unix: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fragmentLoading, setFragmentLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [selectedTooltip, setSelectedTooltip] = useState<string | null>(null);
  const [markers, setMarkers] = useState<IMarker[]>([]);

  const updateClipBounds = (start: number, end: number) => {
    setStartTime((prevState) => ({ ...prevState, displayTime: start }));
    setEndTime((prevState) => ({ ...prevState, displayTime: end }));
  };

  return (
    <ClipContext.Provider
      value={{
        playbackStatus,
        setPlaybackStatus,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        isLoading,
        setIsLoading,
        videoRef,
        dragging,
        setDragging,
        selectedTooltip,
        setSelectedTooltip,
        fragmentLoading,
        setFragmentLoading,
        updateClipBounds,
        markers,
        setMarkers,
      }}
    >
      {children}
    </ClipContext.Provider>
  );
};
