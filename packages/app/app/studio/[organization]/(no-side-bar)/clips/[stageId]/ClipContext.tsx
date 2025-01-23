'use client';
import React, {
  createContext,
  useContext,
  useState,
  useRef,
} from 'react';
import Hls from 'hls.js';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [selectedTooltip, setSelectedTooltip] = useState<string | null>(null);
  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(false);
  const [hls, setHls] = useState<Hls | null>(null);

  return (
    <ClipContext.Provider
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
        organizationId,
      }}
    >
      {children}
    </ClipContext.Provider>
  );
};
