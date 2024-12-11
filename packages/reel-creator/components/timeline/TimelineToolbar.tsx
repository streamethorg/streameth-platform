import React from 'react';
import { useTimeline } from '@/context/TimelineContext';

const TimelineToolbar: React.FC = () => {
  const { events, updateEvents, currentTime, selectedEvents, setSelectedEvents } = useTimeline();

  const splitEvent = () => {
    const newEvents = events.map(event => {
      if (event.start !== undefined && event.end !== undefined && currentTime > event.start && currentTime < event.end) {
        return [
          { ...event, end: currentTime },
          { ...event, id: `${event.id}-split`, start: currentTime, trimStart: currentTime, trimEnd: event.end }
        ];
      }
      // Return the original event if it's not being split
      return [event];
    }).flat();

    updateEvents(newEvents);
  };

  const handleDelete = () => {
    const updatedEvents = events.filter(event => !selectedEvents.includes(event.id));
    updateEvents(updatedEvents);
    setSelectedEvents([]);
  };

  return (
    <div className="bg-[#1e1e1e] flex justify-between items-center p-2 h-8 border-b border-gray-700">
      <div className="flex space-x-4">
        <button onClick={splitEvent} className="text-gray-300 hover:text-white">Split</button>
        <button onClick={handleDelete} className="text-gray-300 hover:text-white">Delete</button>
      </div>
    </div>
  );
};

export default TimelineToolbar;