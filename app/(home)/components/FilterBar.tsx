'use client'
import { useState, useRef } from 'react'
import SearchFilter from '@/app/[organization]/[event]/archive/components/SearchFilter'
import { ISession } from '@/server/model/session'
import { IEvent } from '@/server/model/event'

function FilterBar({ events }: { events?: IEvent[] }) {
  const inputBarRef = useRef<HTMLDivElement>(null)

  const eventFilters = events
    ? events.map((event) => {
        return {
          name: event.name,
          value: event.id,
          type: 'event',
          filterFunc: async (item: ISession) => {
            return item.eventId === event.id
          },
        }
      })
    : []

  return (
    <div
      key={1}
      className={` w-full max-w-[600px] m-auto z-50 bg-transparent rounded-xl text-white `}
      ref={inputBarRef}>
      <div className="flex flex-col justify-top items-start  w-full h-full">
        <div className="flex flex-row w-full h-full items-center justify-center">
          <SearchFilter
            filterOptions={eventFilters}
            filterName="Event name"
          />
        </div>
      </div>
    </div>
  )
}

export default FilterBar
