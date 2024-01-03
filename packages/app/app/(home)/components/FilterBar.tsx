'use client'
import { useRef } from 'react'
import SearchFilter from '@/app/[organization]/archive/components/SearchFilter'
import { IEvent } from 'streameth-server/model/event'

function FilterBar({ events }: { events: IEvent[] }) {
  const inputBarRef = useRef<HTMLDivElement>(null)

  const eventFilters = events.map((event) => {
    return {
      name: event.name,
      value: event.name,
      type: 'name',
      filterFunc: async (item: IEvent) => {
        return item.name === event.name
      },
    }
  })

  return (
    <div
      key={1}
      className={` w-full max-w-[400px] z-50 bg-transparent rounded-xl text-white `}
      ref={inputBarRef}>
      <div className="flex flex-col justify-top items-start  w-full h-full">
        <div className="flex flex-row w-full h-full items-center justify-center">
          <SearchFilter
            items={events}
            filterOptions={eventFilters}
            filterName="Event name"
          />
        </div>
      </div>
    </div>
  )
}

export default FilterBar
