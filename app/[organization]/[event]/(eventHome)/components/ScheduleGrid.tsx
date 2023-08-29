import { CELL_HEIGHT } from '../utils'

export default function ScheduleGrid({
  children,
  totalSlots,
  earliestTime,
}: {
  children: React.ReactNode
  totalSlots: number
  earliestTime: number
}) {
  console.log(new Date(earliestTime).toLocaleTimeString())
  
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
