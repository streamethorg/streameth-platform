'use client'
import React, { useContext } from 'react'
import axios from 'axios'
import { IEvent } from '@/server/model/event'
import EditEventButton from './EditEventButton'
import Link from 'next/link'
interface EventEntryProps {
  event: IEvent
}

const EventEntry: React.FC<EventEntryProps> = ({ event }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`api/events/${event.id}`)
      // onDeleted()
    } catch (err) {
      console.error('An error occurred.')
    }
  }

  return (
    <li className="border p-2 rounded flex justify-between items-center">
      <Link href={`admin/${event.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
        <img src={event.eventCover} alt={event.name} className="w-16 h-16 rounded" />
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
