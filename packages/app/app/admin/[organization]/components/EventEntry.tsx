'use client'

import React, { useContext } from 'react'
import Link from 'next/link'
import AdminItemCard from '../../components/utils/AdminItemCard'
import { ModalContext } from '@/lib/context/ModalContext'
import { IEvent } from 'streameth-server/model/event'

interface EventEntryProps {
  event: IEvent
}

const EventEntry: React.FC<EventEntryProps> = ({ event }) => {
  const handleDelete = () => {
    fetch(
      `/api/admin/event?event=${event.id}&organization=${event.organizationId}`,
      {
        method: 'DELETE',
      }
    )
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
        <div className="font-bold text-center mb-2">
          <span>{`Are you sure you want to delete the event "${event.name}"?`}</span>
        </div>
        <div>
          <button
            onClick={() => handleDelete()}
            className="bg-blue-500 hover:bg-blue-800 transition-colors  p-2 rounded m-2">
            Yes
          </button>
          <button
            onClick={() => closeModal()}
            className="bg-gray-200 hover:bg-gray-500 transition-colors p-2 rounded m-2">
            No
          </button>
        </div>
      </div>
    )
  }

  return (
    <AdminItemCard>
      <Link
        href={`/admin/${event.organizationId}/${event.id}`}
        className="flex flex-col">
        <img
          src={`/events/${event.eventCover}`}
          alt={event.name}
          className="w-full object-cover"
        />
        <div>
          <h2 className="text-center mt-1 mb-0 truncate font-ubuntu">
            {event.name}
          </h2>
        </div>
      </Link>
    </AdminItemCard>
  )
}

export default EventEntry
