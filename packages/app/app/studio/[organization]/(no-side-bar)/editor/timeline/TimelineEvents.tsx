import React from 'react';
import { useTimelineContext } from '../context/TimelineContext';
import TimelineEvent from './TimelineEvent';

const TimelineEvents = ({
  timelineWidth,
}: {
  timelineWidth: number;
}): React.ReactNode => {
  const { events } = useTimelineContext();

  return (
    <>
      {events.map((event) => {
        return (
          <TimelineEvent
            key={event.id}
            timelineWidth={timelineWidth}
            event={event}
          />
        );
      })}
    </>
  );
};

export default TimelineEvents;
