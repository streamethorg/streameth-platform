'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { EditorEvent } from '../types';
import { useEditorContext } from './EditorContext';
// Define the context value type
export interface TimelineContextType {
  events: EditorEvent[];
  addEvent: (event: EditorEvent) => void;
  removeEvent: (eventId: string) => void;
  updateEvents: (newEvents: EditorEvent[]) => void;
  selectedEvents: string[];
  setSelectedEvents: (eventIds: string[]) => void;
  movingEvent: string | null;
  setMovingEvent: (eventId: string | null) => void;
  initialMousePos: number;
  setInitialMousePos: (position: number) => void;
  initialEventStart: number;
  setInitialEventStart: (start: number) => void;
  initialEventEnd: number;
  setInitialEventEnd: (end: number) => void;
  maxLength: number;
  trimmingEvent: string | null;
  setTrimmingEvent: (eventId: string | null) => void;
  trimmingHandle: 'start' | 'end' | null;
  setTrimmingHandle: (handle: 'start' | 'end' | null) => void;
  handleTrimStart: (eventId: string, event: React.MouseEvent) => void;
  handleTrimEnd: (eventId: string, event: React.MouseEvent) => void;
  handleMoveStart: (eventId: string, event: React.MouseEvent) => void;
  handleEventClick: (eventId: string, e: React.MouseEvent) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  timelineAction: 'trimStart' | 'trimEnd' | 'move' | 'playheadDrag' | null;
  setTimelineAction: (
    action: 'trimStart' | 'trimEnd' | 'move' | 'playheadDrag' | null
  ) => void;
  timelineRef: React.RefObject<HTMLDivElement>;
  pixelsPerSecond: number;
  timelineWidth: number;
  maxDuration: number;
}

// Create the context
const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined
);

// Update the provider props type
interface TimelineProviderProps {
  children: ReactNode;
  initialEvents?: EditorEvent[];
}

// Update the provider component
export const TimelineProvider: React.FC<TimelineProviderProps> = ({
  children,
  initialEvents,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { playerRef, fps } = useEditorContext();
  const maxDuration = 60 * 30;
  const pixelsPerSecond = 2;
  const timelineWidth = maxDuration * pixelsPerSecond;

  const [events, setEvents] = useState<EditorEvent[]>(
    initialEvents ? [...initialEvents] : []
  );

  const [timelineAction, setTimelineAction] = useState<
    'trimStart' | 'trimEnd' | 'move' | 'playheadDrag' | null
  >(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [movingEvent, setMovingEvent] = useState<string | null>(null);
  const [initialMousePos, setInitialMousePos] = useState(0);
  const [initialEventStart, setInitialEventStart] = useState(0);

  const addEvent = (event: EditorEvent) => {
    setEvents((prevEvents) =>
      [...prevEvents, event].sort((a, b) => (a.start ?? 0) - (b.start ?? 0))
    );
  };

  const removeEvent = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };

  const updateEvents = (newEvents: EditorEvent[]) => {
    setEvents(newEvents);
  };

  const handleEventClick = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      setSelectedEvents((prev) =>
        prev.includes(eventId)
          ? prev.filter((id) => id !== eventId)
          : [...prev, eventId]
      );
    } else {
      setSelectedEvents([eventId]);
    }
  };

  const handleMouseUp = useCallback(() => {
    setTimelineAction(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const mousePos = e.clientX - rect.left;
      const timePosition = mousePos / pixelsPerSecond;
      const mouseDelta = mousePos - (initialMousePos - rect.left);
      const timeDelta = mouseDelta / pixelsPerSecond;
      const activeEvent = events.find((event) => event.id === movingEvent);

      switch (timelineAction) {
        case 'move':
          if (!activeEvent) return;
          const duration = activeEvent.timeLineEnd - activeEvent.timeLineStart;
          const newStartMove = Math.max(0, initialEventStart + timeDelta);
          const newEndMove = newStartMove + duration;

          updateEvents(
            events.map((event) =>
              event.id === movingEvent
                ? {
                    ...event,
                    timeLineStart: newStartMove,
                    timeLineEnd: newEndMove,
                  }
                : event
            )
          );
          break;

        case 'trimStart':
          if (!activeEvent) return;
          const newStart = Math.max(0, initialEventStart + timeDelta);
          if (newStart > activeEvent.timeLineEnd) return;
          updateEvents(
            events.map((event) =>
              event.id === movingEvent &&
              event.timeLineEnd - newStart < event.duration
                ? {
                    ...event,
                    timeLineStart: newStart,
                    start: newStart,
                    timeLineEnd: event.timeLineEnd,
                  }
                : event
            )
          );
          break;

        case 'trimEnd':
          if (!activeEvent) return;
          const newEnd = Math.min(maxDuration, initialEventStart + timeDelta);
          if (newEnd < activeEvent.timeLineStart) return;
          updateEvents(
            events.map((event) =>
              event.id === movingEvent &&
              newEnd - event.timeLineStart < event.duration
                ? {
                    ...event,
                    timeLineEnd: newEnd,
                  }
                : event
            )
          );
          break;

        case 'playheadDrag':
          const newTime = Math.max(0, Math.min(maxDuration, timePosition));
          setCurrentTime(newTime);
          playerRef.current?.seekTo(newTime * fps);
          break;
      }
    },
    [events, movingEvent, timelineAction, pixelsPerSecond, maxDuration]
  );
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const value = {
    maxDuration,
    pixelsPerSecond,
    timelineWidth,
    events,
    addEvent,
    removeEvent,
    updateEvents,
    currentTime,
    setCurrentTime,
    selectedEvents,
    setSelectedEvents,
    movingEvent,
    setMovingEvent,
    initialMousePos,
    setInitialMousePos,
    handleEventClick,
    timelineAction,
    setTimelineAction,
    timelineRef,
    setInitialEventStart,
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};

// Custom hook to use the TimelineContext
export const useTimelineContext = (): TimelineContextType => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
};
