'use client'
import React, { useState, useEffect } from 'react'
import { CardContent, CardTitle } from '@/components/ui/card'
import ScheduleCard from '../../schedule/components/ScheduleCard'
import { IExtendedEvent, IExtendedSession } from '@/lib/types'

const UpcomingSession = ({
  event,
  currentSession,
}: {
  event: IExtendedEvent
  currentSession?: IExtendedSession
}) => {
  // State to control the visibility of the component
  const [isVisible, setIsVisible] = useState(true)

  if (!currentSession) return

  // Early return if the component is not visible

  return (
    <div className="relative bg-white bg-opacity-10 rounded-lg border border-white border-opacity-10">
      <div className="flex flex-row p-2 10">
        <CardTitle className=" text-white text-lg">
          Happening now
        </CardTitle>
        <button
          className="ml-auto text-white text-opacity-50 hover:text-opacity-100"
          onClick={() => setIsVisible(!isVisible)}>
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
  )
}

export default UpcomingSession
