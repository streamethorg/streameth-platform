'use client'
import React, { useContext } from 'react'
import { ScheduleContext } from './ScheduleContext'
import SessionList from '@/components/sessions/SessionList'
import { IEvent } from 'streameth-server/model/event'

const SessionsOnSchedule = ({ event }: { event: IEvent }) => {
  const { sessions } = useContext(ScheduleContext)
  return (
    <div className="flex flex-row h-full w-full">
      <div className="w-full flex flex-col relative">
        <SessionList event={event} sessions={sessions} />
      </div>
    </div>
  )
}

export default SessionsOnSchedule
