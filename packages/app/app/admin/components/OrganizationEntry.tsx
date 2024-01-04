'use client'

import React, { useContext } from 'react'
import EditOrganizationButton from './EditOrganizationButton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModalContext } from '@/lib/context/ModalContext'
import { IOrganization } from 'streameth-server/model/organization'

interface OrganizationEntryProps {
  organization: IOrganization
}

const OrganizationEntry: React.FC<OrganizationEntryProps> = ({
  organization,
}) => {
  const handleDelete = (organization: IOrganization) => {
    fetch(`/api/admin/organization?organization=${organization.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            'Failed to delete organization and / or event(s)'
          )
        }
      })
      .catch((err) => {
        console.error('An error occurred', err)
      })
      .finally(() => {
        closeModal()
      })
  }

  const { openModal, closeModal } = useContext(ModalContext)

  const handleModalOpen = (organization: IOrganization) => {
    openModal(
      <div className="flex flex-col items-center">
        <div className="font-bold text-center mb-2">
          <span>{`Are you sure you want to delete the event "${organization.name}" and its events?`}</span>
        </div>
        <div>
          <button
            onClick={() => handleDelete(organization)}
            className="bg-blue-500 hover:bg-blue-800 transition-colors text-white p-2 rounded m-2">
            Yes
          </button>
          <button
            onClick={() => closeModal()}
            className="bg-gray-200 hover:bg-gray-500 transition-colors p-2 rounded m-2">
            No
          </button>
        </div>
      </div>
    )
  }

  return (
    <li className="border p-4 flex flex-col rounded bg-background">
      <div className="flex justify-between">
        <Link
          href={`admin/${organization.id}`}
          className="flex items-center flex-1 gap-4">
          <img
            src={organization.logo}
            alt={organization.name}
            className="w-16 h-16 object-contain rounded"
          />
          <h2 className="text-xl font-bold">{organization.name}</h2>
        </Link>
        <div className=" flex flex-row gap-2">
          <EditOrganizationButton organization={organization} />
          <Button onClick={() => handleModalOpen(organization)}>
            Delete
          </Button>
        </div>
      </div>
      <Link href={`admin/${organization.id}`}>
        <p className="text-ellipsis ... overflow-auto max-h-[50px]">
          {organization.description}
        </p>
        <p className="text-sm text-gray-500">
          {organization.location}
        </p>
      </Link>
    </li>
  )
}

export default OrganizationEntry
