'use client';
import React  from 'react';
import { useTimelineContext } from '../context/TimelineContext';
import TimelineToolbar from './TimelineToolbar';
import TimelineMarkers from './TimelineMarkers';
import TimelinePlayhead from './TimelinePlayhead';
import TimelineLabels from './Labels';
import TimelineEvent from './TimelineEvent';
const Timeline: React.FC = () => {
  const { timelineRef, timelineWidth, events } = useTimelineContext();

  return (
    <div className="bg-[#1e1e1e] text-white h-full flex flex-col">
      <TimelineToolbar />
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <div className="w-64 border-r border-gray-700 overflow-y-auto">
            <TimelineLabels />
          </div>
          <div className="flex-1 overflow-x-auto">
            <div className="h-full" style={{ width: `${timelineWidth}px` }}>
              <TimelineMarkers />
              <div className="relative h-[calc(100%-32px)]" ref={timelineRef}>
                <TimelinePlayhead />
                {events.map((event) => {
                  return (
                    <TimelineEvent
                      key={event.id}
                      timelineWidth={timelineWidth}
                      event={event}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
