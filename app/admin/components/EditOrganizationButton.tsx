'use client'
import React, { useContext } from 'react'
import CreateOrganizationModal from './CreateOrganizationForm' // Assuming you have this component
import { ModalContext } from '@/components/context/ModalContext'
import { IOrganization } from '@/server/model/organization'
const EditOrganizationButton = ({ organization }: { organization: IOrganization }) => {
  const { openModal } = useContext(ModalContext)
  return (
    <div>
      <button className=" p-2 bg-yellow-500 text-white rounded" onClick={() => openModal(<CreateOrganizationModal organization={organization} />)}>
        Edit
      </button>
    </div>
  )
}

export default EditOrganizationButton
