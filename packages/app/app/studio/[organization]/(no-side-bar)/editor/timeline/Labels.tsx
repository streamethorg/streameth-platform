import React from 'react';
import { useTimelineContext } from '../context/TimelineContext';

const TimelineLabels: React.FC = () => {
  const { events } = useTimelineContext();

  return (
    <div className="w-full mt-8">
      {events.map((event) => (
        <div
          key={event.id}
          className="py-2 px-3 border-b border-t border-gray-700 text-sm h-[58px] flex items-center justify-center"
        >
          <span className="truncate block">{ event.id}</span>
        </div>
      ))}
    </div>
  );
};

export default TimelineLabels;
