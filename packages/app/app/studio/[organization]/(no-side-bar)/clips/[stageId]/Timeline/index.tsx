'use client';
import React from 'react';
import { useClipContext } from '../ClipContext';
import TrimmControls, { TrimmOverlay } from './TrimmControls';
import Playhead from './PlayHead';
import { formatTime } from '@/lib/utils/time';
import { useMarkersContext } from '../sidebar/markers/markersContext';
import { useTimelineContext } from './TimelineContext';
import TimelineMarker from '../sidebar/markers/TimelineMarker';
import useTimeline from './useTimeline';
const Timeline = () => {
  const { dragging, isLoading } = useClipContext();

  const {
    timelineRef,
    timelineWidth,
    handleTimelineClick,
  } = useTimelineContext();

  const { markers } =
    useMarkersContext();

  return (
    <div
      ref={timelineRef}
      className={`relative flex flex-col w-full bg-white h-[200px] overflow-x-scroll overflow-y-hidden`}
    >
      {timelineWidth ? (
        <div
          className="h-[100px] relative"
          style={{ width: `${timelineWidth}px` }}
        >
          {markers &&
            markers.map((marker) => {
              return <TimelineMarker marker={marker} />;
            })}
          <Playhead />
          <div
            onClick={handleTimelineClick}
            className="absolute top-0 left-0 w-full h-full z-[20]"
          >
            <TimelineDrawing />
          </div>
          <TrimmControls
            {...{
              marker: 'start',
              blocked: isLoading && dragging !== 'start',
            }}
          />
          <TrimmOverlay />
          <TrimmControls
            {...{
              marker: 'end',
              blocked: isLoading && dragging !== 'end',
            }}
          />
        </div>
      ) : (
        <div className="h-[100px] relative">
          <div className="h-full w-full bg-slate-200 animate-pulse rounded-xl"></div>
        </div>
      )}
    </div>
  );
};

export default Timeline;

const TimelineDrawing = () => {
  const {
    videoDuration,
    timelineWidth,
    pixelsPerSecond: scale,
  } = useTimelineContext();

  const { calculatePositionOnTimeline } = useTimeline();
  // Function to calculate intervals based on scale
  const calculateIntervals = (scale: number) => {
    if (scale >= 10) return { major: 10, minor: 3 };
    if (scale >= 5) return { major: 15, minor: 5 };
    if (scale >= 2) return { major: 50, minor: 10 };
    if (scale >= 1.5) return { major: 30, minor: 20 };
    if (scale >= 1) return { major: 50, minor: 30 };
    if (scale >= 0.5) return { major: 200, minor: 50 };
    if (scale >= 0.2) return { major: 400, minor: 100 };
    return { major: 500, minor: 200 };
  };

  const { major: majorInterval, minor: minorInterval } =
    calculateIntervals(scale);

  const markers = [];
  for (let i = 0; i <= videoDuration; i += minorInterval) {
    const position = calculatePositionOnTimeline(i, videoDuration, timelineWidth);

    if (i % majorInterval === 0) {
      markers.push(
        <div
          key={i}
          className="absolute h-full top-6"
          style={{ left: `${position}px` }}
        >
          <div className="absolute bottom-0 left-0 transform -translate-x-1/2 text-xs text-gray-400">
            {formatTime(i)}
          </div>
          <div className="absolute h-[calc(100%-17px)] border-l border-gray-600"></div>
        </div>
      );
    } else {
      markers.push(
        <div
          key={i}
          className="absolute h-full"
          style={{ left: `${position}px` }}
        >
          <div className="absolute top-6 h-1/2 border-l border-gray-600"></div>
        </div>
      );
    }
  }
  return markers;
};
