import React from 'react';
import { useTimelineContext } from './TimelineContext';
import { EditorEvent } from 'streameth-reel-creator/types/constants';
import useTimeline from './useTimeline';
import { useEventContext } from './EventConntext';
import { UnfoldHorizontal } from 'lucide-react';
const getEventColor = (type: EditorEvent['type'], isPreviewMode: boolean) => {
  switch (type) {
    case 'media':
      return isPreviewMode ? 'rgba(255, 191, 0, 1)' : 'rgba(200, 75, 80, 1)';
    default:
      return 'bg-gray-400';
  }
};

const TimelineEvent = ({ event }: { event: EditorEvent }): React.ReactNode => {
  const { isPreviewMode, timelineRef, timelineWidth } = useTimelineContext();
  const {
    maxDuration,
    selectedEvent,
    setSelectedEvent,
    setTimelineAction,
    setInitialMousePos,
    setMovingEvent,
    setInitialEventStart,
  } = useEventContext();

  const { calculatePositionOnTimeline } = useTimeline(timelineRef);
  const height = 50;
  const left = calculatePositionOnTimeline(event.start, maxDuration, timelineWidth);
  const width = calculatePositionOnTimeline(
    event.end - event.start,
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
        height: `${height + 20}px`,
      }}
    >
      <div
        className={`rounded-xl absolute cursor-move ${selectedEvent?.id === event.id ? `border-2 border-[${backgroundColor}]` : ''}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          left: `${left}px`,
          borderWidth: '2px',
          borderColor: backgroundColor,
        }}
        onMouseDown={(e) => handleMoveStart(event.id, event.start, e)}
        onClick={() => handleEventSelect(event)}
      >
        {event.type === 'media' && (
          <div
            className={`absolute left-0 top-0 h-full cursor-ew-resize rounded-l-md flex items-center justify-center`}
            onMouseDown={(e) => handleTrimStart(event.id, event.start, e)}
            style={{
              backgroundColor: 'rgba(200, 75, 80, 0.8)',
            }}
          >
            <UnfoldHorizontal size={15} className="text-white" />
          </div>
        )}
        {event.type === 'media' && (
          <div
            className="absolute right-0 top-0 h-full cursor-ew-resize rounded-r-md flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(200, 75, 80, 0.8)',
            }}
            onMouseDown={(e) => handleTrimEnd(event.id, event.end, e)}
          >
            <UnfoldHorizontal size={15} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineEvent;
