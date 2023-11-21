'use client'
import { useContext, useEffect, useState } from 'react'
import { FilterContext } from '@/components/context/FilterContext'
import EventCard from './EventCard'
import { IEvent } from '@/server/model/event'

const EventList = ({ events }: { events: IEvent[] }) => {
  const { filteredItems, setItems } = useContext(FilterContext)
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    const filteredEvents = events.filter((event) => {
      return event.name
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    })

    setItems(filteredEvents)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, filterValue])

  return (
    <>
      <div className="px-4 mx-4 items-center flex flex-col md:flex-row mt-4 gap-5">
        <p className="font-ubuntu font-bold text-blue text-2xl md:text-4xl">
          Past Events
        </p>

        <input
          type="text"
          placeholder="Event Name"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className={`p-2 italic  w-full bg-base ${
            filterValue && filteredItems.length === 0
              ? 'rounded-t-xl'
              : 'rounded-xl'
          }  text-main-text w-full md:w-[50%] placeholder:text-main-text placeholder:text-sm`}
        />
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
