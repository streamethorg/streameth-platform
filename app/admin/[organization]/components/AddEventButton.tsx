'use client'
import React, { useContext } from 'react'
import CreateEventForm from './CreateEventForm' // Assuming you have this component
import { ModalContext } from '@/components/context/ModalContext'
const AddOrganizationButton = ({ organization }: { organization: string }) => {
  const { openModal } = useContext(ModalContext)
  return (
    <div>
      <button className="mb-4 p-2 bg-blue-500 text-white rounded" onClick={() => openModal(<CreateEventForm organizationId={organization} />)}>
        Create a New Event
      </button>
    </div>
  )
}

export default AddOrganizationButton
