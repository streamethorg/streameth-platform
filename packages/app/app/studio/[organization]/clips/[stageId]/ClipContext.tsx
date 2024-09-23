'use client';
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { IExtendedMarker } from '@/lib/types';

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
  markers: IExtendedMarker[];
  setMarkers: React.Dispatch<React.SetStateAction<IExtendedMarker[]>>;
  stageId: string;
  isCreatingClip: boolean;
  setIsCreatingClip: React.Dispatch<React.SetStateAction<boolean>>;
  handleMouseDown: (marker: string, event: React.MouseEvent) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseUp: () => void;
  handleMarkerClick: (marker: IExtendedMarker) => void;
  goToClickTime: (event: React.MouseEvent) => void;
};

const ClipContext = createContext<ClipContextType | null>(null);

export const useClipContext = () => useContext(ClipContext)!;

export const ClipProvider = ({
  children,
  stageId,
}: {
  children: React.ReactNode;
  stageId: string;
}) => {
  const { handleTermChange, searchParams } = useSearchParams();

  const start = searchParams.get('start');
  const end = searchParams.get('end');
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
  const [markers, setMarkers] = useState<IExtendedMarker[]>([]);
  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(false);
  const [initialMousePos, setInitialMousePos] = useState<number>(0);
  const [initialMarkerPos, setInitialMarkerPos] = useState<number>(0);
  const [updateTimeStart, setUpdateTimeStart] = useState<boolean>(false);
  const [updateTimeEnd, setUpdateTimeEnd] = useState<boolean>(false);
  const maxLength = videoRef.current?.duration || 0;
  const pixelsPerSecond = 4;
  const timelineWidth = maxLength * pixelsPerSecond;

  useEffect(() => {
    if (handleTermChange) {
      console.log(
        'startTime',
        startTime.displayTime,
        startTime.unix,
        convertSecondsToUnix(startTime.displayTime)
      );

      handleTermChange([
        { key: 'start', value: String(startTime.displayTime) },
        { key: 'end', value: String(endTime.displayTime) },
        { key: 'currentTime', value: String(videoRef.current?.currentTime) },
      ]);
    }
  }, [
    handleTermChange,
    startTime.displayTime,
    startTime.unix,
    endTime.displayTime,
  ]);

  const convertSecondsToUnix = (seconds: number) => {
    if (playbackStatus) {
      // Get the current Unix time
      const currentUnixTime = Date.now();

      // Calculate the Unix timestamp for the given seconds
      const unixTimestamp =
        currentUnixTime + seconds * 1000 - playbackStatus.offset;

      return unixTimestamp;
    } else {
    }
  };

  const updateClipBounds = (start: number, end: number) => {
    setStartTime((prevState) => ({ ...prevState, displayTime: start }));
    setEndTime((prevState) => ({ ...prevState, displayTime: end }));
  };

  useEffect(() => {
    if (updateTimeStart && !fragmentLoading && playbackStatus) {
      setStartTime({
        unix: Date.now() - playbackStatus.offset,
        displayTime: startTime.displayTime,
      });
      setUpdateTimeStart(false);
    }
    if (updateTimeEnd && !fragmentLoading && playbackStatus) {
      setEndTime({
        unix: Date.now() - playbackStatus.offset,
        displayTime: endTime.displayTime,
      });
      setUpdateTimeEnd(false);
    }
  }, [
    updateTimeStart,
    updateTimeEnd,
    videoRef,
    startTime,
    dragging,
    playbackStatus,
    setStartTime,
    setEndTime,
    endTime.displayTime,
    fragmentLoading,
  ]);

  const handleMouseDown = (marker: string, event: React.MouseEvent) => {
    setDragging(marker);
    setSelectedTooltip(marker);

    setInitialMousePos(event.clientX);
    setInitialMarkerPos(
      marker === 'start' ? startTime.displayTime : endTime.displayTime
    );
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (dragging && videoRef.current && playbackStatus) {
        const mouseDelta = event.clientX - initialMousePos;
        const timeDelta = (mouseDelta / timelineWidth) * maxLength;
        const newTime = Math.max(
          0,
          Math.min(maxLength, initialMarkerPos + timeDelta)
        );

        if (dragging === 'start') {
          if (newTime >= 0 && newTime < endTime.displayTime) {
            setStartTime({
              unix: Date.now() - playbackStatus.offset,
              displayTime: newTime,
            });
            setUpdateTimeStart(true);
          }
        } else if (dragging === 'end') {
          if (
            newTime > startTime.displayTime &&
            newTime <= videoRef.current.duration
          ) {
            setEndTime({
              unix: Date.now() - playbackStatus.offset,
              displayTime: newTime,
            });
            setUpdateTimeEnd(true);
          }
        }

        videoRef.current.currentTime = newTime;
      }
    },
    [
      dragging,
      initialMousePos,
      initialMarkerPos,
      maxLength,
      timelineWidth,
      endTime.displayTime,
      startTime.displayTime,
      setStartTime,
      setEndTime,
      videoRef,
      playbackStatus,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleMarkerClick = (marker: IExtendedMarker) => {
    if (videoRef.current) {
      videoRef.current.currentTime = marker.start;
      setStartTime({
        displayTime: marker.start,
        unix: Date.now() - playbackStatus!.offset,
      });

      setEndTime({
        displayTime: marker.end,
        unix: Date.now() - playbackStatus!.offset,
      });

      videoRef.current.play();
    }
  };

  const goToClickTime = (event: React.MouseEvent) => {
    if (videoRef.current && playbackStatus) {
      const timelineElement = event.currentTarget as HTMLElement;

      const timelineRect = timelineElement.getBoundingClientRect();
      const relativeClickX =
        event.clientX - timelineRect.left + timelineElement.scrollLeft;
      const clickTime = (relativeClickX / timelineWidth) * maxLength;
      videoRef.current.currentTime = clickTime;
    }
  };

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();

    window.addEventListener('dragstart', preventDefault);
    window.addEventListener('dragover', preventDefault);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dragstart', preventDefault);
      window.removeEventListener('dragover', preventDefault);
    };
  }, [handleMouseMove, handleMouseUp, selectedTooltip, videoRef]);

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
        stageId,
        isCreatingClip,
        setIsCreatingClip,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMarkerClick,
        goToClickTime,
      }}
    >
      {children}
    </ClipContext.Provider>
  );
};
