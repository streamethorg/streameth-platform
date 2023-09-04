'use client'
import React, { useContext } from 'react'
import { CELL_HEIGHT, getSlotRange } from '../utils'
import ScheduleCard from '@/components/schedule/ScheduleCard'
import { ScheduleContext } from './ScheduleContext'
const SessionsOnSchedule = () => {
  const { earliestTime, data } = useContext(ScheduleContext)

  if (!data) return <div>Error</div>
  return (
    <div className="flex flex-row right-0 h-full absolute top-0 w-[calc(100%-5rem)]">
      {data.stages.map((stage) => (
        <div key={stage.stage.id} className="w-full flex flex-col relative">
          {stage.sessions.map((session) => {
            const range = getSlotRange(session, earliestTime)
            return (
              <div
                key={session.id}
                className="absolute right-0 h-full w-full p-1"
                style={{
                  top: range.start * CELL_HEIGHT + 'rem',
                  height: (range.end - range.start) * CELL_HEIGHT + 'rem',
                }}>
                {session.name !== 'Blank' && <ScheduleCard session={session} />}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default SessionsOnSchedule
