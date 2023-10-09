'use client'
import React, { useContext } from 'react'
import { IEvent } from '@/server/model/event'
import EditEventButton from './EditEventButton'
import Link from 'next/link'
interface EventEntryProps {
  event: IEvent
}

const EventEntry: React.FC<EventEntryProps> = ({ event }) => {
  const handleDelete = () => {
    fetch(`api/events/${event.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete event')
        }
      })
      .catch((err) => {
        console.error('An error occurred', err)
      })
  }

  return (
    <li className="border p-2 rounded flex justify-between items-center">
      <Link href={`/${event.organizationId}/${event.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
        <img src={`/events/${event.eventCover}`} alt={event.name} className="w-16 h-16 rounded" />
        <div>
          <h2 className="text-xl font-bold">{event.name}</h2>
          <p>{event.description}</p>
          <p className="text-sm text-gray-500">{event.location}</p>
        </div>
      </Link>
      <div className="ml-auto  flex flex-row ">
        <EditEventButton event={event} />
        <button className="bg-red-500 text-white p-2 rounded ml-2" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default EventEntry
