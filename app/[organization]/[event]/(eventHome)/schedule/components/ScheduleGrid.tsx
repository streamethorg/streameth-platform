'use client'
import React, { useContext } from 'react'
import { CELL_HEIGHT } from '../../utils'
import { ScheduleContext } from './ScheduleContext'
import { secondsToHHMM } from '@/utils/time'

function ScheduleGrid({ children }: { children: React.ReactNode }) {
  const { schedulePosition } = useContext(ScheduleContext)

  return (
    <div
      className="flex flex-col w-full relative my-4"
      style={{
        height: `${schedulePosition.totalSlots * CELL_HEIGHT}rem`,
      }}>
      {Array.from({ length: schedulePosition.totalSlots }, (_, i) => (
        <div key={i} className="w-full h-full border">
          <h1 className="w-full text-sm text-secondary-text mx-auto px-4">{secondsToHHMM(schedulePosition.min + i * 60 * 15)}</h1>
          {/* <div className="w-full border" /> */}
        </div>
      ))}
      {children}
    </div>
  )
}

export default ScheduleGrid
