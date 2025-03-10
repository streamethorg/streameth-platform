'use client';
import React from 'react';
import Playhead from './PlayHead';
import { formatTime } from '@/lib/utils/time';
import { useMarkersContext } from '../sidebar/markers/markersContext';
import { useTimelineContext } from './TimelineContext';
import TimelineMarker from '../sidebar/markers/TimelineMarker';
import useTimeline from './useTimeline';

import { useClipPageContext } from '../ClipPageContext';
import { useEventContext } from './EventConntext';
import TimelineEvent from './TimelineEvent';
import Waveform from './Waveform';

const Timeline = () => {
  const {
    timelineRef,
    handleTimelineClick,
    isPreviewMode,
    setPlayHeadEvent,
    setInitialEventStart,
    timelineWidth,
    playHeadEvent,
  } = useTimelineContext();
  const { calculateTimeFromPosition } = useTimeline(timelineRef);
  const { events } = useEventContext();
  const { videoRef, metadata } = useClipPageContext();
  const { markers } = useMarkersContext();

  const handlePlayheadMouseEnter = (e: React.MouseEvent) => {
    if (playHeadEvent === 'drag') {
      return;
    }
    e.stopPropagation();
    setPlayHeadEvent('hover');
    setInitialEventStart(
      calculateTimeFromPosition(e.clientX, metadata.duration)
    );
  };

  const handlePlayheadMouseLeave = () => {
    if (playHeadEvent === 'drag') {
      return;
    }
    setPlayHeadEvent(null);
  };

  return (
    <div
      ref={timelineRef}
      className={`relative flex flex-col w-full ${
        isPreviewMode ? 'bg-muted' : 'bg-white'
      } h-[200px] overflow-x-scroll overflow-y-hidden`}
    >
      {timelineWidth ? (
        <div
          className="h-[150px] relative"
          style={{ width: `${timelineWidth}px` }}
        >
          <Playhead />
          <div
            onClick={handleTimelineClick}
            onMouseEnter={handlePlayheadMouseEnter}
            onMouseLeave={handlePlayheadMouseLeave}
            className="absolute top-0 left-0 w-full h-[20px] z-[20]"
          >
            <TimelineDrawing />
          </div>
          {markers &&
            markers.map((marker) => {
              return <TimelineMarker key={marker._id} marker={marker} />;
            })}
          <div className="absolute top-[60px] left-0 w-full h-[50px] z-[20]">
            {events &&
              events.map((event) => {
                return <TimelineEvent key={event.id} event={event} />;
              })}
            <Waveform />
          </div>
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
  const { pixelsPerSecond: scale, timelineRef } = useTimelineContext();
  const { metadata } = useClipPageContext();
  const { calculatePositionOnTimeline } = useTimeline(timelineRef);
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
  for (let i = 0; i <= metadata.duration; i += minorInterval) {
    const position = calculatePositionOnTimeline(i, metadata.duration);

    if (i % majorInterval === 0) {
      markers.push(
        <div
          key={i}
          className="absolute h-full top-0"
          style={{ left: `${position}px` }}
        >
          <div className="absolute top-0 left-0 transform -translate-x-1/2 text-xs text-gray-400">
            {formatTime(i)}
          </div>
          <div className="absolute h-[calc(10px)] top-4 border-l-2 border-gray-400"></div>
        </div>
      );
    }
  }
  return markers;
};
