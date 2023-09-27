'use client'
import React, { useContext } from 'react'
import CreateOrganizationModal from './CreateOrganizationForm' // Assuming you have this component
import { ModalContext } from '@/components/context/ModalContext'
const AddOrganizationButton: React.FC = () => {
  const { openModal } = useContext(ModalContext)
  return (
    <div>
      <button className="mb-4 p-2 bg-blue-500 text-white rounded" onClick={() => openModal(<CreateOrganizationModal />)}>
        Add Organization
      </button>
    </div>
  )
}

export default AddOrganizationButton
