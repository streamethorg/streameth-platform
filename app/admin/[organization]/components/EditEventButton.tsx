'use client'
import React, { useContext } from 'react'
import CreateEventForm from './CreateEventForm' // Assuming you have this component
import { ModalContext } from '@/components/context/ModalContext'
import { IEvent } from '@/server/model/event'
const EditOrganizationButton = ({ event }: { event: IEvent }) => {
  const { openModal } = useContext(ModalContext)
  return (
    <div>
      <button
        className="p-2 bg-yellow-500 text-white rounded"
        onClick={() => openModal(<CreateEventForm organizationId={event.organizationId} event={event} />)}>
        Edit
      </button>
    </div>
  )
}

export default EditOrganizationButton
