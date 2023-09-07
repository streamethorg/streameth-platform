'use client'
import React, { useContext, useEffect, useState } from 'react'
import { CELL_HEIGHT, getSlotRange, sessionsSchedulePosition, addBlankSessions } from '../utils'
import ScheduleCard from '@/components/schedule/ScheduleCard'
import { ScheduleContext } from './ScheduleContext'
import { getSessions } from '@/utils/api'
import { ISession } from '@/server/model/session'
import { IStage } from '@/server/model/stage'

const StageSessions = ({ stage }: { stage: IStage }) => {
  const { schedulePosition, setSchedulePositions, event, date } = useContext(ScheduleContext)
  const [sessions, setSessions] = useState<ISession[]>([])

  useEffect(() => {
    const fetchSessions = async () => {
      if (!event) return
      const sessions = await getSessions({
        event,
        stage: stage.id,
        date,
      })
      setSessions(sessions)
    }
    fetchSessions()
  }, [date])

  useEffect(() => {
    if (!sessions.length) {
      return
    }
    setSchedulePositions(sessionsSchedulePosition(sessions))
  }, [sessions])

  return (
    <div key={stage.id} className="w-full flex flex-col relative">
      {addBlankSessions(sessions, schedulePosition.min).map((session) => {
        const range = getSlotRange(session, schedulePosition.min)
        console.log(range)

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
  )
}

const SessionsOnSchedule = () => {
  const { stages } = useContext(ScheduleContext)

  return (
    <div className="flex flex-row right-0 h-full absolute top-0 w-[calc(100%-5rem)]">
      {stages.map((stage: IStage) => (
        <StageSessions key={stage.id} stage={stage} />
      ))}
    </div>
  )
}

export default SessionsOnSchedule
