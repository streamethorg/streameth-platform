'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useClipContext } from '../ClipContext';
import {
  ArrowLeftSquare,
  ArrowRightSquare,
  PlayIcon,
  PauseIcon,
} from 'lucide-react';
import { debounce } from 'lodash';
import Marker, { MarkerOverlay } from './Marker';
import Playhead from './PlayHead';
const debouncedUpdate = debounce((callback: (data: any) => void, data: any) => {
  callback(data);
}, 100);

const Timeline = () => {
  const {
    playbackStatus,
    setStartTime,
    startTime,
    endTime,
    setEndTime,
    videoRef,
    dragging,
    setDragging,
    setSelectedTooltip,
    selectedTooltip,
    isLoading,
    fragmentLoading,
  } = useClipContext();

  const [initialMousePos, setInitialMousePos] = useState<number>(0);
  const [initialMarkerPos, setInitialMarkerPos] = useState<number>(0);
  const [updateTimeStart, setUpdateTimeStart] = useState<boolean>(false);
  const [updateTimeEnd, setUpdateTimeEnd] = useState<boolean>(false);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.id === 'increment' || e.target.id === 'decrement')
      ) {
        return;
      }
      if (selectedTooltip) {
        const tooltipElement = document.getElementById(selectedTooltip);
        if (tooltipElement && !tooltipElement.contains(e.target as Node)) {
          setSelectedTooltip(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedTooltip, setSelectedTooltip]);

  const handle1SecondIncrementDecrement = useCallback(
    (increment: boolean, marker: string) => {
      if (videoRef.current && playbackStatus) {
        const time =
          marker === 'start' ? startTime.displayTime : endTime.displayTime;
        const newTime = increment ? time + 1 : time - 1;
        if (marker === 'start') {
          if (newTime >= 0 && newTime < endTime.displayTime) {
            debouncedUpdate(setStartTime, {
              unix: Date.now() - playbackStatus.offset,
              displayTime: newTime,
            });
          }
        } else if (marker === 'end') {
          if (
            newTime > startTime.displayTime &&
            newTime <= videoRef.current.duration
          ) {
            debouncedUpdate(setEndTime, {
              unix: Date.now() - playbackStatus.offset,
              displayTime: newTime,
            });
          }
        }
        videoRef.current.currentTime = newTime;
      }
    },
    [
      videoRef,
      playbackStatus,
      startTime.displayTime,
      endTime.displayTime,
      setStartTime,
      setEndTime,
    ]
  );

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
        const rect = videoRef.current.getBoundingClientRect();
        const mouseDelta = event.clientX - initialMousePos;
        const pos =
          initialMarkerPos +
          (mouseDelta / rect.width) * videoRef.current.duration;
        videoRef.current.currentTime = pos;
        if (dragging === 'start') {
          if (pos >= 0 && pos < endTime.displayTime) {
            setStartTime({
              unix: Date.now() - playbackStatus.offset,
              displayTime: pos,
            });
            setUpdateTimeStart(true);
          }
        } else if (dragging === 'end') {
          if (pos > startTime.displayTime && pos <= videoRef.current.duration) {
            setEndTime({
              unix: Date.now() - playbackStatus.offset,
              displayTime: pos,
            });
            setUpdateTimeEnd(true);
          }
        }
      }
    },
    [
      dragging,
      initialMousePos,
      initialMarkerPos,
      endTime.displayTime,
      startTime.displayTime,
      playbackStatus,
      setStartTime,
      setEndTime,
      videoRef,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();

    window.addEventListener('dragstart', preventDefault);
    window.addEventListener('dragover', preventDefault);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', (e) => {
      if (selectedTooltip) {
        if (e.key === 'ArrowRight') {
          handle1SecondIncrementDecrement(true, selectedTooltip);
        } else if (e.key === 'ArrowLeft') {
          handle1SecondIncrementDecrement(false, selectedTooltip);
        }
      }

      if (e.key == ' ' || e.code == 'Space' || e.keyCode == 32) {
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      }
    });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dragstart', preventDefault);
      window.removeEventListener('dragover', preventDefault);
    };
  }, [
    handle1SecondIncrementDecrement,
    handleMouseMove,
    handleMouseUp,
    selectedTooltip,
    videoRef,
  ]);

  const maxLength = videoRef.current?.duration || 0;
  const pixelsPerSecond = 4;
  const timelineWidth = maxLength * pixelsPerSecond;

  return (
    <div className="relative flex flex-col w-full bg-white p-2 h-[200px] overflow-scroll">
      <div
        className="h-[100px] relative"
        style={{ width: `${timelineWidth}px` }}
      >
        <Playhead maxLength={maxLength} timelineWidth={timelineWidth} />
        <TimelineMarkers
          maxLength={maxLength}
          timelineWidth={timelineWidth}
          scale={pixelsPerSecond}
        />
        <Marker
          {...{
            handleMouseDown,
            marker: 'start',
            handle1SecondIncrementDecrement,
            blocked: isLoading && dragging !== 'start',
          }}
        />
        <MarkerOverlay />
        <Marker
          {...{
            handleMouseDown,
            marker: 'end',
            blocked: isLoading && dragging !== 'end',
          }}
        />
      </div>
    </div>
  );
};

export default Timeline;

const formatTime = (seconds: number) => {
  if (!seconds) return '00:00:00';

  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

const TimelineMarkers = ({
  maxLength,
  timelineWidth,
  scale,
}: {
  maxLength: number;
  timelineWidth: number;
  scale: number;
}) => {
  const getMarkerPosition = (time: number) =>
    (time / maxLength) * timelineWidth;

  const markers = [];
  for (let i = 0; i <= maxLength; i += 3) {
    const position = getMarkerPosition(i);

    if (i % 30 === 0) {
      markers.push(
        <div
          key={i}
          className="absolute h-full top-4"
          style={{ left: `${position}px` }}
        >
          <div className="absolute bottom-0 left-0 transform -translate-x-1/2 text-xs text-gray-400 ">
            {`${formatTime(i)}`}
          </div>
          <div className="absolute  h-[calc(100%-17px)] border-l border-gray-600"></div>
        </div>
      );
    } else {
      markers.push(
        <div
          key={i}
          className="absolute h-full"
          style={{ left: `${position}px` }}
        >
          <div className="absolute top-4 h-1/2 border-l border-gray-600"></div>
        </div>
      );
    }
  }
  return markers;
};
