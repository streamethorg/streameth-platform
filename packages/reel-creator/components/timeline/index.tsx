"use client";
import React, { useCallback, useRef, useEffect } from "react";
import { useTimeline } from "@/context/TimelineContext";
import TimelineToolbar from "./TimelineToolbar";
import TimelineMarkers from "./TimelineMarkers";
import TimelineEvents from "./TimelineEvents";
import TimelinePlayhead from "./TimelinePlayhead";
import { EditorEvent } from "@/types/constants";
import TimelineLabels from "../Labels";
const Timeline: React.FC = () => {
    const {
        events,
        updateEvents,
        maxLength,
        movingEvent,
        initialMousePos,
        initialEventStart,
        initialEventEnd,
        trimmingEvent,
        trimmingHandle,
    } = useTimeline();
    const pixelsPerSecond = 2;
    const timelineWidth = maxLength * pixelsPerSecond;
    const timelineRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!timelineRef.current) return;

            const rect = timelineRef.current.getBoundingClientRect();
            const mousePos = e.clientX - rect.left;
            const newTime = mousePos / pixelsPerSecond;

            if (trimmingEvent && trimmingHandle) {
                const targetEvent = events.find(
                    (event) => event.id === trimmingEvent,
                );
                if (!targetEvent) return;

                if (trimmingHandle === "start") {
                    const newStart =
                        targetEvent.end !== undefined
                            ? Math.max(
                                  0,
                                  Math.min(targetEvent.end - 0.1, newTime),
                              )
                            : newTime;
                    updateEvents(
                        events.map((event) =>
                            event.id === trimmingEvent
                                ? { ...event, start: newStart }
                                : event,
                        ),
                    );
                } else if (
                    trimmingHandle === "end" &&
                    "duration" in targetEvent
                ) {
                    const newEnd =
                        targetEvent.start !== undefined
                            ? Math.max(
                                  targetEvent.start + 0.1,
                                  Math.min(maxLength, newTime),
                              )
                            : Math.min(maxLength, newTime);
                    if (
                        targetEvent.duration !== undefined &&
                        newEnd >= targetEvent.duration
                    )
                        return;
                    updateEvents(
                        events.map((event) =>
                            event.id === trimmingEvent
                                ? { ...event, end: newEnd }
                                : event,
                        ),
                    );
                }
            } else if (movingEvent) {
                const targetEvent = events.find(
                    (event) => event.id === movingEvent,
                );
                if (!targetEvent) return;

                const duration =
                    (targetEvent.end ?? 0) - (targetEvent.start ?? 0);
                const newStart = Math.max(
                    0,
                    Math.min(
                        maxLength - duration,
                        newTime - initialMousePos / pixelsPerSecond,
                    ),
                );
                const newEnd = newStart + duration;

                updateEvents(
                    events.map((event) =>
                        event.id === movingEvent
                            ? { ...event, start: newStart, end: newEnd }
                            : event,
                    ),
                );
            }
        },
        [
            events,
            trimmingEvent,
            trimmingHandle,
            movingEvent,
            initialMousePos,
            maxLength,
            updateEvents,
            pixelsPerSecond,
        ],
    );
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove]);

    return (
        <div className="bg-[#1e1e1e] text-white h-full flex flex-col">
            <TimelineToolbar />
            <div className="flex-1 overflow-hidden">
                <div className="flex h-full">
                    <div className="w-64 border-r border-gray-700 overflow-y-auto">
                        <TimelineLabels />
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <div
                            className="h-full"
                            style={{ width: `${timelineWidth}px` }}
                        >
                            <TimelineMarkers
                                maxLength={maxLength}
                                timelineWidth={timelineWidth}
                            />
                            <div
                                className="relative h-[calc(100%-32px)]"
                                ref={timelineRef}
                            >
                                <TimelinePlayhead
                                    maxLength={maxLength}
                                    timelineWidth={timelineWidth}
                                />
                                <TimelineEvents timelineWidth={timelineWidth} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
