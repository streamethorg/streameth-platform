'use client'
import React, { useContext } from 'react'
import CreateOrganizationModal from './CreateOrganizationForm' // Assuming you have this component
import { ModalContext } from '@/lib/context/ModalContext'
import { Button } from '@/components/ui/button'

const AddOrganizationButton: React.FC = () => {
  const { openModal } = useContext(ModalContext)
  return (
    <Button onClick={() => openModal(<CreateOrganizationModal />)}>
      Create Organization
    </Button>
  )
}

export default AddOrganizationButton
