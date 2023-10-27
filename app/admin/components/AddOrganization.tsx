'use client'
import React, { useContext } from 'react'
import CreateOrganizationModal from './CreateOrganizationForm' // Assuming you have this component
import { ModalContext } from '@/components/context/ModalContext'
import { Button } from '@/app/utils/Button'

const AddOrganizationButton: React.FC = () => {
  const { openModal } = useContext(ModalContext)
  return (
    <Button onClick={() => openModal(<CreateOrganizationModal />)}>
      Create Organization
    </Button>
  )
}

export default AddOrganizationButton
