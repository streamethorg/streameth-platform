import React, { useState, useCallback, useEffect } from 'react';
import { useTimeline } from '@/context/TimelineContext';
import { MediaEvent } from '@/types/constants';

type EditorEvent = MediaEvent;

interface TimelineEventsProps {
  timelineWidth: number;
}

const getEventColor = (type: EditorEvent['type']) => {
  switch (type) {
    case 'media': return 'bg-blue-400';
    default: return 'bg-gray-400';
  }
};

const TimelineEvents: React.FC<TimelineEventsProps> = ({ timelineWidth }) => {
  const { events, maxLength, selectedEvents, handleMoveStart, handleEventClick, handleTrimEnd, handleTrimStart } = useTimeline();

  const getMarkerPosition = (time: number) => {
    return (time / maxLength) * timelineWidth;
  };

  const getEventStyle = (event: EditorEvent) => {
    const height = 40;
    const left = event.start !== undefined ? getMarkerPosition(event.start) : 0;
    const width = event.end !== undefined && event.start !== undefined ? getMarkerPosition(event.end - event.start) : 0; // Adjust width calculation
    const backgroundColor = getEventColor(event.type);
    return { height, left, width, backgroundColor };
  };

  return (
    <>
      {events.map((event, index) => {
        const { height, left, width, backgroundColor } = getEventStyle(event);
        return (
          <div key={event.id} className="flex border-b border-t py-2 bg-opacity-5 bg-white border-black relative" 
            style={{
              height: `${height + 18}px`
            }}
          >
            <div
              className={`rounded-xl absolute ${backgroundColor} cursor-move ${selectedEvents.includes(event.id) ? 'ring-2 ring-white' : ''}`}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                left: `${left}px`, // Ensure left position is set
              }}
              onMouseDown={(e) => handleMoveStart(event.id, e)}
              onClick={(e) => handleEventClick(event.id, e)}
            >
              {event.type === 'media' && (
                <div
                  className="absolute left-0 top-0 w-1 h-full cursor-ew-resize"
                  onMouseDown={(e) => handleTrimStart(event.id, e)}
                />
              )}
              {event.type === 'media' &&  (
                <div
                  className="absolute right-0 top-0 w-1 h-full cursor-ew-resize rounded"
                  onMouseDown={(e) => handleTrimEnd(event.id, e)}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TimelineEvents;