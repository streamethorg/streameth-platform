'use client'

import React, { useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'
import { IOrganization } from '@/server/model/organization'
import EditOrganizationForm from './EditOranizationForm'

const EditOrganizationButton = ({ organization }: { organization: IOrganization }) => {
  const { openModal } = useContext(ModalContext)
  return (
    <div>
      <button className=" p-2 bg-yellow-500 text-white rounded" onClick={() => openModal(<EditOrganizationForm organization={organization} />)}>
        Edit
      </button>
    </div>
  )
}

export default EditOrganizationButton
