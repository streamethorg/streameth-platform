import React from 'react';
import { useTimelineContext } from '../context/TimelineContext';
import { EditorEvent } from '../types';
import useTimeline from '../../clips/[stageId]/Timeline/useTimeline';

const getEventColor = (type: EditorEvent['type']) => {
  switch (type) {
    case 'media':
      return 'bg-blue';
    default:
      return 'bg-gray-400';
  }
};

const TimelineEvent = ({
  timelineWidth,
  event,
}: {
  timelineWidth: number;
  event: EditorEvent;
}): React.ReactNode => {
  const {
    maxDuration,
    selectedEvents,
    handleEventClick,
    setTimelineAction,
    setInitialMousePos,
    setMovingEvent,
    setInitialEventStart,
  } = useTimelineContext();

  const { calculatePositionOnTimeline } = useTimeline();
  const height = 40;
  const left = calculatePositionOnTimeline(
    event.timeLineStart,
    maxDuration,
    timelineWidth
  );
  const width = calculatePositionOnTimeline(
    event.timeLineEnd - event.timeLineStart,
    maxDuration,
    timelineWidth
  );
  const backgroundColor = getEventColor(event.type);

  const handleMoveStart = (
    eventId: string,
    start: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setMovingEvent(eventId);
    setInitialMousePos(event.clientX);
    setInitialEventStart(start);
    setTimelineAction('move');
  };

  const handleTrimStart = (eventId: string, start: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setMovingEvent(eventId);
    setInitialMousePos(event.clientX);
    setInitialEventStart(start);
    setTimelineAction('trimStart');
  };

  const handleTrimEnd = (eventId: string, end: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setMovingEvent(eventId);
    setInitialMousePos(event.clientX);
    setInitialEventStart(end);
    setTimelineAction('trimEnd');
  };

  return (
    <div
      key={event.id}
      className="flex border-b border-t py-2 bg-opacity-5 bg-white border-black relative"
      style={{
        height: `${height + 18}px`,
      }}
    >
      <div
        className={`rounded-xl absolute ${backgroundColor} cursor-move ${selectedEvents.includes(event.id) ? 'ring-2 ring-white' : ''}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          left: `${left}px`, // Ensure left position is set
        }}
        onMouseDown={(e) => handleMoveStart(event.id, event.timeLineStart, e)}
        onClick={(e) => handleEventClick(event.id, e)}
      >
        {event.type === 'media' && (
          <div
            className="absolute left-0 top-0 w-1 h-full cursor-ew-resize"
            onMouseDown={(e) => handleTrimStart(event.id, event.timeLineStart, e)}
          />
        )}
        {event.type === 'media' && (
          <div
            className="absolute right-0 top-0 w-1 h-full cursor-ew-resize rounded"
            onMouseDown={(e) => handleTrimEnd(event.id, event.timeLineEnd, e)}
          />
        )}
      </div>
    </div>
  );
};

export default TimelineEvent;
