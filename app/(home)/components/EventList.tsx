'use client'
import { useContext, useEffect, useState } from 'react'
import { FilterContext } from '@/components/context/FilterContext'
import EventCard from './EventCard'
import { IEvent } from '@/server/model/event'
import FilterBar from './FilterBar'

const EventList = ({ events }: { events: IEvent[] }) => {
  const { filteredItems } = useContext(FilterContext)

  return (
    <>
      <div className=" mx-4 items-center flex flex-col md:flex-row mt-8 gap-5">
        <p className="font-ubuntu font-bold text-blue text-2xl md:text-4xl">
          Past Events
        </p>
        <FilterBar events={events} />
      </div>
      <div className="h-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-scroll ">
        {filteredItems.length === 0 ? (
          <div className=" p-4 text-blue m-4">No events found</div>
        ) : (
          filteredItems
            .sort((a: IEvent, b: IEvent) => {
              return b.start.getTime?.() - a.start.getTime?.()
            })
            .map((event: IEvent) => {
              return <EventCard key={event.id} event={event} />
            })
        )}
      </div>
    </>
  )
}

export default EventList
