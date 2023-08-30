'use client'
import React, { useContext } from 'react'
import { CELL_HEIGHT } from '../utils'
import { ScheduleContext } from './ScheduleContext'
import { secondsToHHMM } from '@/utils/time'
export default function ScheduleGrid({ children }: { children: React.ReactNode }) {
  const { totalSlots, earliestTime } = useContext(ScheduleContext)
  return (
    <div className="flex flex-col w-full relative " style={{ height: totalSlots * CELL_HEIGHT + 'rem' }}>
      {Array.from({ length: totalSlots }, (_, i) => (
        <div key={i} className="w-full h-full border-t p-4">
          <h1 className="w-full text-sm text-secondary-text">{secondsToHHMM(earliestTime + i * 60 * 15)}</h1>
        </div>
      ))}
      {children}
    </div>
  )
}
