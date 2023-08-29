'use client'
import React, { useContext } from 'react'
import { CELL_HEIGHT } from '../utils'
import { ScheduleContext } from './ScheduleContext'
export default function ScheduleGrid({ children }: { children: React.ReactNode }) {
  const { totalSlots, earliestTime } = useContext(ScheduleContext)

  return (
    <div className="flex flex-col w-full relative " style={{ height: totalSlots * CELL_HEIGHT + 'rem' }}>
      {Array.from({ length: totalSlots }, (_, i) => (
        <div key={i} className="w-full h-full border-t p-4">
          <h1 className="w-full text-sm text-secondary-text">
            {new Date(earliestTime + i * 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
        </div>
      ))}
      {children}
    </div>
  )
}
