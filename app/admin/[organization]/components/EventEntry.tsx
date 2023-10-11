'use client'
import React, { useContext } from 'react'
import axios from 'axios'
import { IEvent } from '@/server/model/event'
import EditEventButton from './EditEventButton'
import Link from 'next/link'
import AdminItemCard from '../../components/utils/AdminItemCard'
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
  console.log(event)

  return (
    <AdminItemCard>
      <Link href={`/admin/${event.organizationId}/${event.id}`} target="_blank" rel="noopener noreferrer" className="flex flex-col">
        <img src={`/events/${event.eventCover}`} alt={event.name} className="w-full min-h-[140px]" />
        <div>
          <h2 className="text-center mt-1 mb-0 truncate font-ubuntu">{event.name}</h2>
        </div>
      </Link>
    </AdminItemCard>
  )
}

export default EventEntry
