'use client'
import { useContext, useEffect } from 'react'
import { FilterContext } from '@/components/context/FilterContext'
import EventCard from './EventCard'
import { IEvent } from '@/server/model/event'

const EventList = ({ events }: { events: IEvent[] }) => {
  const { filteredItems, setItems } = useContext(FilterContext)

  useEffect(() => {
    setItems(events)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events])

  return (
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
  )
}

export default EventList
