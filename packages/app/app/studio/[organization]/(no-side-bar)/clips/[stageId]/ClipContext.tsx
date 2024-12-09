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
import { fetchMarkers } from '@/lib/services/markerSevice';
import Hls from 'hls.js';
import { convertSecondsToUnix } from '@/lib/utils/utils';

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
  isAddingOrEditingMarker: boolean;
  setIsAddingOrEditingMarker: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAndSetMarkers: () => void;
  filteredMarkers: IExtendedMarker[];
  setFilteredMarkers: React.Dispatch<React.SetStateAction<IExtendedMarker[]>>;
  selectedMarkerId: string;
  setSelectedMarkerId: React.Dispatch<React.SetStateAction<string>>;
  isImportingMarkers: boolean;
  setIsImportingMarkers: React.Dispatch<React.SetStateAction<boolean>>;
  hls: Hls | null;
  setHls: React.Dispatch<React.SetStateAction<Hls | null>>;
  timeReference: {
    currentTime: number;
    unixTime: number;
  };
  setTimeReference: React.Dispatch<
    React.SetStateAction<{
      currentTime: number;
      unixTime: number;
    }>
  >;
  pixelsPerSecond: number;
  setPixelsPerSecond: React.Dispatch<React.SetStateAction<number>>;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  playheadPosition: number;
  setPlayheadPosition: React.Dispatch<React.SetStateAction<number>>;
  isLoadingMarkers: boolean;
  setIsLoadingMarkers: React.Dispatch<React.SetStateAction<boolean>>;
  timelineContainerWidth: number;
  setTimelineContainerWidth: React.Dispatch<React.SetStateAction<number>>;
  convertSecondsToUnix: (
    timeRef: { currentTime: number; unixTime: number },
    seconds: number
  ) => number;
};

const ClipContext = createContext<ClipContextType | null>(null);

export const useClipContext = () => useContext(ClipContext)!;

export const ClipProvider = ({
  children,
  stageId,
  organizationId,
}: {
  children: React.ReactNode;
  stageId: string;
  organizationId: string;
}) => {
  const { handleTermChange, searchParams } = useSearchParams();

  const start = searchParams?.get('start');
  const end = searchParams?.get('end');
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [selectedTooltip, setSelectedTooltip] = useState<string | null>(null);
  const [markers, setMarkers] = useState<IExtendedMarker[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<IExtendedMarker[]>([]);
  const [isCreatingClip, setIsCreatingClip] = useState<boolean>(false);
  const [initialMousePos, setInitialMousePos] = useState<number>(0);
  const [initialMarkerPos, setInitialMarkerPos] = useState<number>(0);
  const [isAddingOrEditingMarker, setIsAddingOrEditingMarker] =
    useState<boolean>(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>('');
  const [isImportingMarkers, setIsImportingMarkers] = useState<boolean>(false);
  const maxLength = videoRef.current?.duration || 0;
  const [pixelsPerSecond, setPixelsPerSecond] = useState(3);
  const timelineWidth = maxLength * pixelsPerSecond;
  const [hls, setHls] = useState<Hls | null>(null);
  const [hasMouseMoved, setHasMouseMoved] = useState<boolean>(false); // New state to track mouse movement

  const [timeReference, setTimeReference] = useState<{
    currentTime: number;
    unixTime: number;
  }>({
    currentTime: 0,
    unixTime: 0,
  });
  const [startTime, setStartTime] = useState({
    unix: convertSecondsToUnix(timeReference, 0),
    displayTime: 0,
  });

  const [endTime, setEndTime] = useState({
    unix: convertSecondsToUnix(timeReference, 60),
    displayTime: 60,
  });
  const [isLoadingMarkers, setIsLoadingMarkers] = useState<boolean>(false);
  const [timelineContainerWidth, setTimelineContainerWidth] =
    useState<number>(0);

  // We create a state for currentTime to trigger re-renders when the video time changes.
  // This allows components using this context to update based on the current playback time.
  // By using requestAnimationFrame, we limit updates to the browser's refresh rate,
  // preventing excessive re-renders and improving performance.
  const [currentTime, setCurrentTime] = useState(0);
  const requestRef = useRef<number>();

  const [playheadPosition, setPlayheadPosition] = useState<number>(0);

  const animate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  const fetchAndSetMarkers = async () => {
    if (stageId) {
      setIsLoadingMarkers(true);
      try {
        const markers = await fetchMarkers({
          organizationId,
          stageId,
        });
        const sortedMarkers = markers.sort(
          (a, b) => a.startClipTime - b.startClipTime
        );
        setMarkers(sortedMarkers);
        setFilteredMarkers(sortedMarkers);
      } catch (error) {
        console.error('Error fetching markers:', error);
      } finally {
        setIsLoadingMarkers(false);
      }
    }
  };

  useEffect(() => {
    fetchAndSetMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  // Track if the effect has set end time
  const hasSetEndTimeRef = useRef(false);

  useEffect(() => {
    console.log(timeReference);
    if (
      timeReference.currentTime !== 0 &&
      videoRef.current?.duration &&
      !hasSetEndTimeRef.current
    ) {
      const duration = videoRef.current.duration;
      setStartTime({
        unix: convertSecondsToUnix(timeReference, 0),
        displayTime: 0,
      });
      setEndTime({
        unix: convertSecondsToUnix(timeReference, duration * 1),
        displayTime: duration * 1,
      });
      hasSetEndTimeRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef.current?.duration, timeReference.currentTime]);

  const updateClipBounds = (start: number, end: number) => {
    setStartTime((prevState) => ({ ...prevState, displayTime: start }));
    setEndTime((prevState) => ({ ...prevState, displayTime: end }));
  };

  const handleMouseDown = (marker: string, event: React.MouseEvent) => {
    setDragging(marker);
    setSelectedTooltip(marker);

    // const updateTime = (newTime: number) => {
    //   if (marker === 'start') {
    //     setStartTime({
    //       unix: Date.now() - (playbackStatus?.offset ?? 0),
    //       displayTime: Math.max(0, Math.min(newTime, endTime.displayTime - 1)),
    //     });
    //   } else if (marker === 'end') {
    //     setEndTime({
    //       unix: Date.now() - (playbackStatus?.offset ?? 0),
    //       displayTime: Math.min(
    //         videoRef.current?.duration || Infinity,
    //         Math.max(newTime, startTime.displayTime + 1)
    //       ),
    //     });
    //   }
    // };
    setInitialMousePos(event.clientX);
    setInitialMarkerPos(
      marker === 'start' ? startTime.displayTime : endTime.displayTime
    );

    // Reset the hasMouseMoved flag
    setHasMouseMoved(false);

    // Capture the current playhead position
    // if (videoRef.current) {
    //   setPlayheadPosition(videoRef.current.currentTime);
    // }
    // Calculate the initial position based on the marker type
    if (marker === 'overlay') {
      const timelineRect = event.currentTarget.getBoundingClientRect();
      const relativeClickX = event.clientX - timelineRect.left; // Get the click position relative to the timeline
      const clickTime = (relativeClickX / timelineWidth) * maxLength; // Convert to time
      setInitialMarkerPos(clickTime); // Set the initial marker position based on the click
    }
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (dragging && videoRef.current && playbackStatus) {
        // Set hasMouseMoved to true if the mouse has moved
        setHasMouseMoved(true);
        const mouseDelta = event.clientX - initialMousePos;
        const timeDelta = (mouseDelta / timelineWidth) * maxLength;
        const newTime = Math.max(
          0,
          Math.min(maxLength, initialMarkerPos + timeDelta)
        ); // Calculate new time

        if (dragging === 'start') {
          if (newTime >= 0 && newTime < endTime.displayTime) {
            setStartTime({
              unix: convertSecondsToUnix(timeReference, newTime),
              displayTime: newTime,
            });
          }
        } else if (dragging === 'end') {
          if (
            newTime > startTime.displayTime &&
            newTime <= videoRef.current.duration
          ) {
            setEndTime({
              unix: convertSecondsToUnix(timeReference, newTime),
              displayTime: newTime,
            });
          }
        } else if (dragging === 'overlay') {
          const newStartTime = Math.max(
            0,
            Math.min(newTime, endTime.displayTime)
          );
          const newEndTime = Math.max(
            newStartTime,
            Math.min(
              newTime + (endTime.displayTime - startTime.displayTime),
              videoRef.current.duration
            )
          );

          setStartTime({
            unix: convertSecondsToUnix(timeReference, newStartTime),
            displayTime: newStartTime,
          });
          setEndTime({
            unix: convertSecondsToUnix(timeReference, newEndTime),
            displayTime: newEndTime,
          });
        }
        // Update currentTime state without changing video's currentTime
        // setCurrentTime(newTime);
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
      hls,
      playbackStatus,
      setCurrentTime,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    // Set the video's currentTime to match the dragged position
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleMarkerClick = (marker: IExtendedMarker) => {
    if (videoRef.current) {
      videoRef.current.currentTime = marker.startClipTime;
      setStartTime({
        displayTime: marker.startClipTime,
        unix: convertSecondsToUnix(timeReference, marker.startClipTime),
      });

      setEndTime({
        displayTime: marker.endClipTime,
        unix: convertSecondsToUnix(timeReference, marker.endClipTime),
      });

      setSelectedMarkerId(marker._id);

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
  }, [handleMouseMove, handleMouseUp]);

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
        isAddingOrEditingMarker,
        setIsAddingOrEditingMarker,
        fetchAndSetMarkers,
        filteredMarkers,
        setFilteredMarkers,
        selectedMarkerId,
        setSelectedMarkerId,
        isImportingMarkers,
        setIsImportingMarkers,
        hls,
        setHls,
        timeReference,
        setTimeReference,
        pixelsPerSecond,
        setPixelsPerSecond,
        currentTime,
        setCurrentTime,
        playheadPosition,
        setPlayheadPosition,
        isLoadingMarkers,
        setIsLoadingMarkers,
        timelineContainerWidth,
        setTimelineContainerWidth,
        convertSecondsToUnix,
      }}
    >
      {children}
    </ClipContext.Provider>
  );
};
