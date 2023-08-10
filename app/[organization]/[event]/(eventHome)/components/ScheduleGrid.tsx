import { CELL_HEIGHT, getEarliestTime, getTotalSlots } from '../utils'
import { FilterContext } from '../../archive/components/FilterContext'
import { useContext, useMemo } from 'react'

export default function ScheduleGrid({ children }: { children: React.ReactNode }) {
  const { filteredItems: sessions } = useContext(FilterContext)
  const earliestTime = useMemo(() => getEarliestTime(sessions), [sessions])
  const totalSlots = useMemo(() => getTotalSlots(sessions, earliestTime), [sessions, earliestTime]) + 11

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
