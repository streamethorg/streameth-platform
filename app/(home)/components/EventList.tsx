'use client'
import { useContext } from 'react'
import { FilterContext } from '@/app/[organization]/[event]/archive/components/FilterContext'
import EventCard from './EventCard'
import { IEvent } from '@/server/model/event'

const EventList = () => {
  const { filteredItems, isLoading } = useContext(FilterContext);

  if (isLoading) {
    return <></>
  }

  return (
    <div className="h-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:overflow-scroll ">
      {filteredItems
        .sort((a: IEvent, b: IEvent) => {
          return a.start.getTime() - b.start.getTime()
        })
        .map((event: IEvent) => {
          return <EventCard key={event.id} event={event} />
        })}
    </div>
  )
}

export default EventList
