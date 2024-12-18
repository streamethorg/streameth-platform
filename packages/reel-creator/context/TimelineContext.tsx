"use client"
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { EditorEvent } from '@/types/constants';

// Define the context value type
export interface TimelineContextType {
    events: EditorEvent[];
    addEvent: (event: EditorEvent) => void;
    removeEvent: (index: number) => void;
    updateEvents: (newEvents: EditorEvent[]) => void;
    currentTime: number;
    setCurrentTime: (time: number) => void;
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
}

// Create the context
const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

// Create a provider component
export const TimelineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<EditorEvent[]>([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [movingEvent, setMovingEvent] = useState<string | null>(null);
    const [initialMousePos, setInitialMousePos] = useState(0);
    const [initialEventStart, setInitialEventStart] = useState(0);
    const [initialEventEnd, setInitialEventEnd] = useState(0);
    const [trimmingEvent, setTrimmingEvent] = useState<string | null>(null);
    const [trimmingHandle, setTrimmingHandle] = useState<'start' | 'end' | null>(null);
    const [seekTime, setSeekTime] = useState<number | null> (null);
    const addEvent = (event: EditorEvent) => {
        setEvents(prevEvents => [...prevEvents, event].sort((a, b) => (a.start ?? 0) - (b.start ?? 0)));
    };

    const removeEvent = (index: number) => {
        setEvents(prevEvents => prevEvents.filter((_, i) => i !== index));
    };

    const updateEvents = (newEvents: EditorEvent[]) => {
        setEvents(newEvents);
    };

    const handleTrimStart = (eventId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setTrimmingEvent(eventId);
        setTrimmingHandle('start');
        setInitialMousePos(event.clientX);
        const targetEvent = events.find(e => e.id === eventId);
        if (targetEvent) {
            setInitialEventStart(targetEvent.start ?? 0);
        }
    };

    const handleTrimEnd = (eventId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setTrimmingEvent(eventId);
        setTrimmingHandle('end');
        setInitialMousePos(event.clientX);
        const targetEvent = events.find(e => e.id === eventId);
        if (targetEvent) {
            setInitialEventEnd(targetEvent.end ?? 0);
        }
    };

    const handleMoveStart = (eventId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setMovingEvent(eventId);
        setInitialMousePos(event.clientX);
        const targetEvent = events.find(e => e.id === eventId);
        if (targetEvent) {
            setInitialEventStart(targetEvent.start ?? 0);
            setInitialEventEnd(targetEvent.end ?? 0);
        }
    };

    const handleEventClick = (eventId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
            setSelectedEvents((prev) =>
                prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
            );
        } else {
            setSelectedEvents([eventId]);
        }
    };

    const handleMouseUp = useCallback(() => {
        setTrimmingEvent(null);
        setTrimmingHandle(null);
        setMovingEvent(null);
      }, []);

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseUp]);

    const value = {
        maxLength: 900,
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
        initialEventStart,
        setInitialEventStart,
        initialEventEnd,
        setInitialEventEnd,
        trimmingEvent,
        setTrimmingEvent,
        trimmingHandle,
        setTrimmingHandle,
        handleTrimStart,
        handleTrimEnd,
        handleMoveStart,
        handleEventClick,
        seekTime,
        setSeekTime
    };

    return (
        <TimelineContext.Provider value={value}>
            {children}
        </TimelineContext.Provider>
    );
};

// Custom hook to use the TimelineContext
export const useTimeline = () => {
    const context = useContext(TimelineContext);
    if (context === undefined) {
        throw new Error('useTimeline must be used within a TimelineProvider');
    }
    return context;
};
