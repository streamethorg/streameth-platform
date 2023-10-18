'use client'
import React, { useContext } from 'react'
import CreateOrganizationModal from './CreateOrganizationForm' // Assuming you have this component
import { ModalContext } from '@/components/context/ModalContext'
import { IOrganization } from '@/server/model/organization'
import { Button } from '@/app/utils/Button'
const EditOrganizationButton = ({ organization }: { organization: IOrganization }) => {
  const { openModal } = useContext(ModalContext)
  return (
    <div>
      <Button variant="yellow" onClick={() => openModal(<CreateOrganizationModal organization={organization} />)}>
        Edit
      </Button>
    </div>
  )
}

export default EditOrganizationButton
