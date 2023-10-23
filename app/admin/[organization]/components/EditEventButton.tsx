'use client'

import React, { useContext } from 'react'
import EditEventForm from './EditEventForm'
import { ModalContext } from '@/components/context/ModalContext'
import { IEvent } from '@/server/model/event'

const EditOrganizationButton = ({ event }: { event: IEvent }) => {
  const { openModal } = useContext(ModalContext)
  return (
    <div>
      <button
        className="p-2 ml-2 bg-yellow-500 text-white rounded"
        onClick={() => openModal(<EditEventForm organizationId={event.organizationId} event={event} />)}>
        Edit
      </button>
    </div>
  )
}

export default EditOrganizationButton
