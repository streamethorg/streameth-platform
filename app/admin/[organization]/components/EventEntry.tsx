'use client'

import React, { useContext } from 'react'
import { IEvent } from '@/server/model/event'
import EditEventButton from './EditEventButton'
import Link from 'next/link'
import { ModalContext } from '@/components/context/ModalContext'

interface EventEntryProps {
  event: IEvent
}

const EventEntry: React.FC<EventEntryProps> = ({ event }) => {
  const handleDelete = () => {
    fetch(`/api/events?event=${event.id}&organization=${event.organizationId}`, {
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
      .finally(() => {
        closeModal()
      })
  }

  const { openModal, closeModal } = useContext(ModalContext)

  const handleModalOpen = (event: IEvent) => {
    openModal(
      <div className="flex flex-col items-center">
        <div className="font-bold mb-2">
          <span>{`Are you sure you want to delete the event "${event.name}"?`}</span>
        </div>
        <div>
          <button onClick={() => handleDelete()} className="bg-blue-500 hover:bg-blue-800 transition-colors text-white p-2 rounded m-2">
            Yes
          </button>
          <button onClick={() => closeModal()} className="bg-gray-200 hover:bg-gray-500 transition-colors p-2 rounded m-2">
            No
          </button>
        </div>
      </div>
    )
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
      <div className="ml-auto flex flex-row">
        <EditEventButton event={event} />
        <button className="bg-red-500 text-white p-2 rounded ml-2" onClick={() => handleModalOpen(event)}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default EventEntry
