'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { IMarker, useClipContext } from './ClipContext';
import {
  ArrowLeftSquare,
  ArrowRightSquare,
  PlayIcon,
  PauseIcon,
} from 'lucide-react';
import { debounce } from 'lodash';

const debouncedUpdate = debounce((callback: (data: any) => void, data: any) => {
  callback(data);
}, 100);

const ClipSlider = () => {
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
    markers,
    setMarkers,
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
    };
  }, [
    handle1SecondIncrementDecrement,
    handleMouseMove,
    handleMouseUp,
    selectedTooltip,
    videoRef,
  ]);

  const getMarkerPosition = (time: number) => {
    if (videoRef.current && videoRef.current.duration) {
      return (time / videoRef.current.duration) * 100;
    }
    return 0;
  };

  const generateTimeStamps = (duration: number): number[] => {
    const timestamps = [];
    for (let i = 0; i < duration; i += 1800) {
      timestamps.push(i);
    }
    return timestamps;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '00:00:00';

    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  const updateMarker = (id: string, updates: Partial<IMarker>) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, ...updates } : marker
      )
    );
  };

  const handleMarkerDrag = useCallback(
    (
      markerId: string,
      isStart: boolean,
      e: React.MouseEvent<HTMLDivElement>
    ) => {
      e.preventDefault();
      const startX = e.clientX;
      const marker = markers.find((m) => m.id === markerId);
      if (!marker || !videoRef.current) return;

      const initialPosition = isStart ? marker.start : marker.end;
      const timelineWidth = videoRef.current.getBoundingClientRect().width;
      const videoDuration = videoRef.current.duration;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaTime = (deltaX / timelineWidth) * videoDuration;
        const newPosition = Math.max(
          0,
          Math.min(videoDuration, initialPosition + deltaTime)
        );

        setMarkers((prevMarkers) =>
          prevMarkers.map((m) => {
            if (m.id === markerId) {
              if (isStart) {
                return { ...m, start: Math.min(newPosition, m.end - 0.1) };
              } else {
                return { ...m, end: Math.max(newPosition, m.start + 0.1) };
              }
            }
            return m;
          })
        );
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [markers, setMarkers, videoRef]
  );

  return (
    <div className="flex h-[200px] flex-col">
      <div className="flex w-full flex-row items-center justify-center space-x-6 border-b border-t p-2">
        {videoRef.current?.paused ? (
          <button onClick={() => videoRef.current?.play()}>
            <PlayIcon />
          </button>
        ) : (
          <button onClick={() => videoRef.current?.pause()}>
            <PauseIcon />
          </button>
        )}
        <label>
          Speed:
          <select
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.playbackRate = parseFloat(e.target.value);
              }
            }}
          >
            <option value="0.5">0.5x</option>
            <option value="1" selected>
              1x
            </option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </label>
        <span>
          {videoRef.current
            ? formatTime(videoRef.current.currentTime)
            : '00:00:00'}
          /{' '}
          {videoRef.current
            ? formatTime(videoRef.current.duration)
            : '00:00:00'}
        </span>
      </div>
      <div className="p-4">
        <div className="relative mb-4 h-5" onClick={handleSeek}>
          {videoRef.current &&
            videoRef.current.duration &&
            generateTimeStamps(videoRef.current.duration).map((time) => {
              if (!videoRef || !videoRef.current) return 0;
              return (
                <div
                  key={time}
                  className={`absolute flex flex-col`}
                  style={{
                    left: `${(time / videoRef.current.duration) * 100}%`,
                  }}
                >
                  <p className={`text-xs ${time !== 0 && 'ml-[-25px]'}`}>
                    {new Date(time * 1000).toISOString().substr(11, 8)}
                  </p>
                  <div
                    className={`h-2 w-[1px] bg-black ${
                      time !== 0 && 'ml-[-0.5px]'
                    }`}
                  />
                </div>
              );
            })}
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="absolute flex flex-col"
              style={{
                left: `${(marker.start / (videoRef.current?.duration || 1)) * 100}%`,
                width: `${((marker.end - marker.start) / (videoRef.current?.duration || 1)) * 100}%`,
              }}
            >
              <div
                className="h-4 cursor-pointer"
                style={{ backgroundColor: marker.color }}
                title={marker.title}
              >
                <div
                  className="absolute left-0 h-full w-2 cursor-ew-resize"
                  onMouseDown={(e) => handleMarkerDrag(marker.id, true, e)}
                />
                <div
                  className="absolute right-0 h-full w-2 cursor-ew-resize"
                  onMouseDown={(e) => handleMarkerDrag(marker.id, false, e)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="relative flex h-10 rounded-full">
          <div className="my-auto h-2 w-full rounded-xl bg-gray-400" />
          <div
            className="absolute flex h-10 rounded-xl border-2 border-primary"
            style={{
              left: `${getMarkerPosition(startTime.displayTime)}%`,
              right: `${100 - getMarkerPosition(endTime.displayTime)}%`,
            }}
          >
            <div className="my-auto h-2 w-full bg-gray-200" />
          </div>
          <Marker
            {...{
              startTime,
              endTime,
              handleMouseDown,
              getMarkerPosition,
              formatTime,
              marker: 'start',
              setSelectedTooltip,
              selectedTooltip,
              handle1SecondIncrementDecrement,
              blocked: isLoading && dragging !== 'start',
            }}
          />
          <Marker
            {...{
              startTime,
              endTime,
              handleMouseDown,
              getMarkerPosition,
              formatTime,
              marker: 'end',
              setSelectedTooltip,
              selectedTooltip,
              handle1SecondIncrementDecrement,
              blocked: isLoading && dragging !== 'end',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Marker = ({
  startTime,
  endTime,
  handleMouseDown,
  getMarkerPosition,
  formatTime,
  marker,
  selectedTooltip,
  blocked,
}: {
  startTime: { displayTime: number; unix: number };
  endTime: { displayTime: number; unix: number };
  handleMouseDown: (marker: string, event: React.MouseEvent) => void;
  getMarkerPosition: (time: number) => number;
  formatTime: (seconds: number) => string;
  selectedTooltip: string | null;
  marker: string;
  handle1SecondIncrementDecrement: (increment: boolean, marker: string) => void;
  blocked: boolean;
}) => {
  return (
    <div
      className={`absolute h-full w-[15px]`}
      style={{
        left: `${getMarkerPosition(
          marker === 'start' ? startTime.displayTime : endTime.displayTime
        )}%`,
      }}
      onMouseDown={(e) => {
        !blocked && handleMouseDown(marker, e);
      }}
    >
      <div className="relative h-full w-full">
        <div
          id={marker}
          className={`h-full cursor-pointer bg-primary bg-opacity-10 ${
            marker !== 'start'
              ? 'translate-x-[-100%] rounded-r-xl'
              : 'rounded-l-xl'
          } `}
        />
        {selectedTooltip === marker && (
          <div className="absolute left-[-55px] top-[-50px] flex flex-col items-center justify-center rounded-xl bg-primary p-1 text-xs text-white">
            <p className="flex w-[120px] flex-row items-center justify-center space-x-1">
              <span>Use</span> <ArrowLeftSquare width={15} height={15} />
              <ArrowRightSquare width={15} height={15} /> <span>to trim</span>
            </p>
            {formatTime(
              marker === 'start' ? startTime.displayTime : endTime.displayTime
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClipSlider;
