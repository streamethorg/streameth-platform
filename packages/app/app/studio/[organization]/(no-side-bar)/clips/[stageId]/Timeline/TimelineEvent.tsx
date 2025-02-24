import React from 'react';
import { useTimelineContext } from './TimelineContext';
import { EditorEvent } from 'streameth-reel-creator/types/constants';
import useTimeline from './useTimeline';
import { useEventContext } from './EventConntext';

const getEventColor = (type: EditorEvent['type'], isPreviewMode: boolean) => {
  switch (type) {
    case 'media':
      return isPreviewMode ? 'rgba(255, 191, 0, 1)' : 'rgba(200, 75, 80, 1)';
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
  const { isPreviewMode } = useTimelineContext();
  const {
    maxDuration,
    selectedEvent,
    setSelectedEvent,
    setTimelineAction,
    setInitialMousePos,
    setMovingEvent,
    setInitialEventStart,
  } = useEventContext();

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
  const backgroundColor = getEventColor(event.type, isPreviewMode);

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

  const handleTrimStart = (
    eventId: string,
    start: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setMovingEvent(eventId);
    setInitialMousePos(event.clientX);
    setInitialEventStart(start);
    setTimelineAction('trimStart');
  };

  const handleTrimEnd = (
    eventId: string,
    end: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setMovingEvent(eventId);
    setInitialMousePos(event.clientX);
    setInitialEventStart(end);
    setTimelineAction('trimEnd');
  };

  const handleEventSelect = (event: EditorEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div
      key={event.id}
      className="flex relative z-50"
      style={{
        height: `${height + 18}px`,
      }}
    >
      <div
        className={`rounded-xl absolute cursor-move ${selectedEvent?.id === event.id ? 'ring-2 ring-white' : ''}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          left: `${left}px`,
          background: isPreviewMode ? 'rgba(255, 191, 0, 0.35)' : 'rgba(200, 75, 80, 0.4)',
        }}
        onMouseDown={(e) => handleMoveStart(event.id, event.timeLineStart, e)}
        onClick={() => handleEventSelect(event)}
      >
        {event.type === 'media' && (
          <div
            className="absolute left-0 top-0 w-1 h-full cursor-ew-resize rounded-l-xl"
            style={{
              background: backgroundColor,
            }}
            onMouseDown={(e) =>
              handleTrimStart(event.id, event.timeLineStart, e)
            }
          />
        )}
        {event.type === 'media' && (
          <div
            className="absolute right-0 top-0 w-1 h-full cursor-ew-resize rounded-r-xl"
            style={{
              background: backgroundColor,
            }}
            onMouseDown={(e) => handleTrimEnd(event.id, event.timeLineEnd, e)}
          />
        )}
      </div>
    </div>
  );
};

export default TimelineEvent;
