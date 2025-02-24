'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import useTimeline from './useTimeline';
import { useTimelineContext } from './TimelineContext';
import usePlayer from '@/lib/hooks/usePlayer';
import { EditorEvent } from 'streameth-reel-creator/types/constants';
import { useClipPageContext } from '../ClipPageContext';

interface EventContextType {
  timelineAction: string | null;
  movingEvent: string | null;
  initialMousePos: number;
  initialEventStart: number;
  maxDuration: number;
  selectedEvent: EditorEvent | null;
  events: EditorEvent[];
  addEvent: (event: EditorEvent) => void;
  removeEvent: (eventId: string) => void;
  setTimelineAction: (action: string | null) => void;
  setMovingEvent: (event: string | null) => void;
  setInitialMousePos: (pos: number) => void;
  setInitialEventStart: (start: number) => void;
  setMaxDuration: (duration: number) => void;
  setSelectedEvent: (event: EditorEvent | null) => void;
  getEventsBounds: () => { minStart: number; maxEnd: number };
}

export const EventContext = createContext<EventContextType | null>(null);

export const useEventContext = () => useContext(EventContext)!;

export const TrimmControlsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    timelineWidth,
    isPreviewMode,
    timelineRef,
    pixelsPerSecond,
  } = useTimelineContext();

  const { videoRef, metadata } = useClipPageContext();
  const { duration, fps } = metadata;

  const [timelineAction, setTimelineAction] = useState<string | null>(null);
  const [movingEvent, setMovingEvent] = useState<string | null>(null);
  const [initialMousePos, setInitialMousePos] = useState<number>(0);
  const [maxDuration, setMaxDuration] = useState<number>(0);
  const [initialEventStart, setInitialEventStart] = useState<number>(0);
  const [events, setEvents] = useState<EditorEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EditorEvent | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      setEvents([
        {
          id: 'start',
          label: 'Start',
          type: 'media',
          url: '',
          start: 0,
          end: duration,
          timeLineStart: 0,
          timeLineEnd: duration,
          duration: duration,
        },
      ]);
      setMaxDuration(duration);
    }
  }, [duration]);

  const addEvent = (event: EditorEvent) => {
    setEvents((prevEvents) =>
      [...prevEvents, event].sort((a, b) => (a.start ?? 0) - (b.start ?? 0))
    );
  };

  const removeEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  const updateEvents = (newEvents: EditorEvent[]) => {
    setEvents(newEvents);
  };

  const handleMouseUp = useCallback(() => {
    setTimelineAction(null);
  }, []);

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
              event.timeLineEnd - newStart < maxDuration
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
              newEnd - event.timeLineStart < maxDuration
                ? {
                    ...event,
                    timeLineEnd: newEnd,
                  }
                : event
            )
          );
          break;
      }
    },
    [events, movingEvent, timelineAction, pixelsPerSecond, maxDuration]
  );

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const getEventsBounds = () => {
    // get min start and max end of all events
    const minStart = Math.min(...events.map((event) => event.timeLineStart));
    const maxEnd = Math.max(...events.map((event) => event.timeLineEnd));
    return { minStart, maxEnd };
  };

  return (
    <EventContext.Provider
      value={{
        timelineAction,
        movingEvent,
        initialMousePos,
        initialEventStart,
        maxDuration,
        events,
        addEvent,
        removeEvent,
        setTimelineAction,
        setMovingEvent,
        setInitialMousePos,
        setInitialEventStart,
        setMaxDuration,
        setSelectedEvent,
        selectedEvent,
        getEventsBounds,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
