"use client"
import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { PlayerRef } from '@remotion/player';

// Define the shape of the context state
export interface EditorState {
  addCaptions: boolean;
  addBranding: boolean;
  selectedAspectRatio: string;
  aspectRatios: string[];
  captionEnabled: boolean;
  captionLinesPerPage: string;
  captionPosition: string;
  animation: string;
  setAddCaptions: (value: boolean) => void;
  setAddBranding: (value: boolean) => void;
  setSelectedAspectRatio: (value: string) => void;
  setCaptionEnabled: (value: boolean) => void;
  setCaptionLinesPerPage: (value: string) => void;
  setCaptionPosition: (value: string) => void;
  setAnimation: (value: string) => void;
  captionFont: string;
  captionColor: string;
  setCaptionFont: (font: string) => void;
  setCaptionColor: (color: string) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  fps: number;
  setFps: (fps: number) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  transcript: string;
  setTranscript: (transcript: string) => void;
  playerRef: React.RefObject<PlayerRef>;
}

// Create the context with default values
export const EditorContext = createContext<EditorState | undefined>(undefined);

// Create a provider component
export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [addCaptions, setAddCaptions] = useState(false);
  const [addBranding, setAddBranding] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  const [captionEnabled, setCaptionEnabled] = useState(false);
  const [captionLinesPerPage, setCaptionLinesPerPage] = useState('Three');
  const [captionPosition, setCaptionPosition] = useState('Auto');
  const [animation, setAnimation] = useState('None');
  const aspectRatios = ['9:16', '1:1', '16:9'];
  const [captionFont, setCaptionFont] = useState("Arial");
  const [captionColor, setCaptionColor] = useState("#FFFFFF");
  const [currentTime, setCurrentTime] = useState(0);
  const [fps, setFps] = useState(30);
  const [transcript, setTranscript] = useState('');
  const [videoUrl, setVideoUrl] = useState<string>("https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/0b9furirfbkz2qlx/1080p0.mp4");
  // const [videoUrl, setVideoUrl] = useState<string>("/video.mp4");

  const playerRef = useRef<PlayerRef>(null);

  return (
    <EditorContext.Provider
      value={{
        addCaptions,
        addBranding,
        selectedAspectRatio,
        aspectRatios,
        captionEnabled,
        captionLinesPerPage,
        captionPosition,
        animation,
        setAddCaptions,
        setAddBranding,
        setSelectedAspectRatio,
        setCaptionEnabled,
        setCaptionLinesPerPage,
        setCaptionPosition,
        setAnimation,
        captionFont,
        captionColor,
        setCaptionFont,
        setCaptionColor,
        currentTime,
        setCurrentTime,
        fps,
        setFps,
        videoUrl,
        setVideoUrl,
        transcript,
        setTranscript,
        playerRef,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

// Custom hook to use the EditorContext
export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};