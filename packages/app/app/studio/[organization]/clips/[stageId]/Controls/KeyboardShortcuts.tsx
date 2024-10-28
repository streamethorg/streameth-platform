import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useClipContext } from '../ClipContext';
import { toast } from 'sonner';

const KeyboardShortcuts = ({
  setPlaybackRate,
  isFit,
  handleZoomOut,
  handleZoomIn,
  handleFit,
  playbackRates,
  playbackRate,
  currentPlaybackRateIndex,
  setCurrentPlaybackRateIndex,
}: {
  setPlaybackRate: Dispatch<SetStateAction<number>>;
  setCurrentPlaybackRateIndex: Dispatch<SetStateAction<number>>;
  isFit: boolean;
  handleZoomOut: () => void;
  handleZoomIn: () => void;
  handleFit: () => void;
  playbackRates: number[];
  playbackRate: number;
  currentPlaybackRateIndex: number;
}) => {
  const {
    videoRef,
    isLoading,
    currentTime,
    setStartTime,
    playbackStatus,
    setEndTime,
    startTime,
    endTime,
    setCurrentTime,
    timelineContainerWidth,
    isAddingOrEditingMarker,
    isCreatingClip,
  } = useClipContext();
  const isCreatingClipOrMarker = isCreatingClip || isAddingOrEditingMarker;
  const maxLength = videoRef.current?.duration || 0;

  const handleKeyDown = (event: KeyboardEvent) => {
    // disable shortcuts when creating clip or markers
    if (!isCreatingClipOrMarker) {
      // Pause/play in player
      if (
        event.key == ' ' ||
        event.code == 'Space' ||
        event.keyCode == 32 ||
        event.key === 'k'
      ) {
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            setPlaybackRate(1);
            setCurrentPlaybackRateIndex(1);
            videoRef.current.pause();
          }
        }
      }
      // Slider shortcuts
      if (playbackStatus) {
        if (event.key === 'i') {
          if (endTime.displayTime > currentTime) {
            setStartTime({
              unix: Date.now() - playbackStatus.offset,
              displayTime: currentTime,
            });
          } else {
            toast.error('Start time must be less than end time');
          }
        } else if (event.key === 'o') {
          if (startTime.displayTime < currentTime) {
            setEndTime({
              unix: Date.now() - playbackStatus.offset,
              displayTime: currentTime,
            });
          } else {
            toast.error('End time must be greater than start time');
          }
        }
        // } else if (event.key === 'r') {
        //   // Reset start and end times
        //   setStartTime({
        //     unix: Date.now() - playbackStatus.offset,
        //     displayTime: currentTime,
        //   });
        //   setEndTime({
        //     unix: Date.now() - playbackStatus.offset,
        //     displayTime: currentTime,
        //   });
        // }
      }

      // keyboard shortcuts for zooming and fitting
      if (event.key === '-') {
        if (!isFit) handleZoomOut();
      } else if (event.key === '+' || event.key === '=') {
        handleZoomIn();
      } else if (event.key === '0') {
        if (!isFit) handleFit();
      }

      // Video Seek shortcuts
      if (event.key === 'ArrowLeft' && event.shiftKey && videoRef.current) {
        // Decrease current time by 5 seconds
        const newTime = Math.max(currentTime - 5, 0);
        setCurrentTime(newTime);
        videoRef.current.currentTime = newTime;
      } else if (
        event.key === 'ArrowRight' &&
        event.shiftKey &&
        videoRef.current
      ) {
        // Increase current time by 5 seconds
        const newTime = Math.min(currentTime + 5, maxLength);
        setCurrentTime(newTime);
        videoRef.current.currentTime = newTime;
      } else if (event.key === 'ArrowLeft' && videoRef.current) {
        // Decrease current time by 1 second
        const newTime = Math.max(currentTime - 1, 0);
        setCurrentTime(newTime);
        videoRef.current.currentTime = newTime;
      } else if (event.key === 'ArrowRight' && videoRef.current) {
        // Increase current time by 1 second
        const newTime = Math.min(currentTime + 1, maxLength);
        setCurrentTime(newTime);
        videoRef.current.currentTime = newTime;
      }

      // keyboard shortcuts for playback rate control
      if (event.key === 'j') {
        // Decrease speed
        const newIndex = Math.max(currentPlaybackRateIndex - 1, 0);
        if (videoRef.current) {
          videoRef.current.playbackRate = playbackRates[newIndex];
          setPlaybackRate(playbackRates[newIndex]);
          setCurrentPlaybackRateIndex(newIndex);
        }
      } else if (event.key === 'l') {
        // Increase speed
        const newIndex = Math.min(
          currentPlaybackRateIndex + 1,
          playbackRates.length - 1
        );

        if (videoRef.current) {
          videoRef.current.playbackRate = playbackRates[newIndex];
          setCurrentPlaybackRateIndex(newIndex);
          setPlaybackRate(playbackRates[newIndex]);
        }
      } else if (event.key === 'h') {
        // Reset to 1x (index of 1)
        const newIndex = 1;
        if (videoRef.current) {
          videoRef.current.playbackRate = playbackRates[newIndex];
          setPlaybackRate(1);
          setCurrentPlaybackRateIndex(1);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentTime,
    playbackStatus,
    startTime,
    endTime,
    videoRef,
    timelineContainerWidth,
    isFit,
  ]);

  return null;
};

export default KeyboardShortcuts;
