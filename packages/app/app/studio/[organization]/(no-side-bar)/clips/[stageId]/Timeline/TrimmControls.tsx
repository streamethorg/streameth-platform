'use client';
import React, { useCallback, useEffect } from 'react';
import { ArrowLeftSquare, ArrowRightSquare } from 'lucide-react';
import { useClipContext } from '../ClipContext';
import { formatTime } from '@/lib/utils/time';
import { debounce } from 'lodash';

const debouncedUpdate = debounce((callback: (data: any) => void, data: any) => {
  callback(data);
}, 100);

const TrimmControls = ({
  marker,
  blocked,
}: {
  marker: string;
  blocked: boolean;
}) => {
  const {
    startTime,
    endTime,
    videoRef,
    selectedTooltip,
    playbackStatus,
    setStartTime,
    setEndTime,
    handleMouseDown,
  } = useClipContext();

  const getMarkerPosition = (time: number) => {
    if (videoRef.current && videoRef.current.duration) {
      // Ensure the initial position is within the video duration
      const adjustedTime = Math.min(time, videoRef.current.duration);
      return (adjustedTime / videoRef.current.duration) * 100;
    }
    return 0;
  };
  return (
    <div
      className={`absolute h-[calc(100%-20px)] w-[10px] top-6 z-40`}
      style={{
        left: `${getMarkerPosition(
          marker === 'start' ? startTime.displayTime : endTime.displayTime
        )}%`,
      }}
      onMouseDown={(e) => {
        !blocked && handleMouseDown(marker, e);
      }}
    >
      <div className="relative h-full w-full z-50">
        <div
          id={marker}
          className={` h-full cursor-pointer ${
            marker !== 'start'
              ? 'translate-x-[-100%] rounded-r-xl'
              : 'rounded-l-xl'
          } `}
          style={{
            background: 'rgba(200, 75, 80, 1)',
          }}
        />
        {/* {selectedTooltip === marker && (
          <div className="absolute left-[-55px] top-[-50px] flex flex-col items-center justify-center rounded-xl bg-primary p-1 text-xs text-white z-[9999]">
            <p className="flex w-[120px] flex-row items-center justify-center space-x-1">
              <span>Use</span> <ArrowLeftSquare width={15} height={15} />
              <ArrowRightSquare width={15} height={15} /> <span>to trim</span>
            </p>
            {formatTime(
              marker === 'start' ? startTime.displayTime : endTime.displayTime
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default TrimmControls;

export const TrimmOverlay = () => {
  const {
    startTime,
    endTime,
    videoRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useClipContext();

  const getMarkerPosition = (time: number) => {
    if (videoRef.current && videoRef.current.duration) {
      return (time / videoRef.current.duration) * 100;
    }
    return 0;
  };

  // currently disabled because slider jumps when dragging
  const handleMouseDownOverlay = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    handleMouseDown('overlay', e); // Start dragging as overlay

    // Attach mouse move and up events
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="absolute flex rounded-xl h-[calc(100%-20px)] top-6"
      style={{
        background: 'rgba(200, 75, 80, 0.4)',
        left: `${+getMarkerPosition(startTime.displayTime)}%`,
        right: `${100 - getMarkerPosition(endTime.displayTime)}%`,
      }}
      // onMouseDown={handleMouseDownOverlay} // Add mouse down event
    ></div>
  );
};
