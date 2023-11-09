'use client'
import React, { useContext } from 'react'
import { ScheduleContext } from './ScheduleContext'
import SessionList from '@/components/sessions/SessionList'

const SessionsOnSchedule = () => {
  const { sessions } = useContext(ScheduleContext)
  return (
    <div className="flex flex-row h-full w-full">
      <div className="w-full flex flex-col relative">
        <SessionList sessions={sessions} />
      </div>
    </div>
  )
}

export default SessionsOnSchedule
