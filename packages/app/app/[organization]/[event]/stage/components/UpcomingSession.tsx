'use client';
import React, { useState, useEffect } from 'react';
import { CardTitle } from '@/components/ui/card';
import ScheduleCard from '../../schedule/components/ScheduleCard';
import { IExtendedEvent, IExtendedSession } from '@/lib/types';

const UpcomingSession = ({
  event,
  currentSession,
}: {
  event: IExtendedEvent;
  currentSession?: IExtendedSession;
}) => {
  // State to control the visibility of the component
  const [isVisible, setIsVisible] = useState(true);

  if (!currentSession) return;

  // Early return if the component is not visible

  return (
    <div className="relative rounded-lg border border-white border-opacity-10 bg-white bg-opacity-10">
      <div className="10 flex flex-row p-2">
        <CardTitle className="text-lg text-white">Happening now</CardTitle>
        <button
          className="ml-auto text-white text-opacity-50 hover:text-opacity-100"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? 'Close' : 'Show'}
        </button>
      </div>
      {isVisible && (
        <div className="p-1">
          <ScheduleCard
            event={event}
            session={currentSession}
            showTime
            speakers
          />
        </div>
      )}
      {/* Close button */}
    </div>
  );
};

export default UpcomingSession;
