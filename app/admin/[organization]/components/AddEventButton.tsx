'use client'
import React, { useContext } from 'react'
import CreateEventForm from './CreateEventForm' // Assuming you have this component
import { ModalContext } from '@/components/context/ModalContext'
import { Button } from '@/app/utils/Button'
const AddOrganizationButton = ({ organization }: { organization: string }) => {
  const { openModal } = useContext(ModalContext)
  return (
    <Button variant="green" onClick={() => openModal(<CreateEventForm organizationId={organization} />)}>
      Create a new Event
    </Button>
  )
}

export default AddOrganizationButton
