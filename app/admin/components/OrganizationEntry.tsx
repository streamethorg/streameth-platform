'use client'
import React, { useContext } from 'react'
import axios from 'axios'
import { IOrganization } from '@/server/model/organization'
import EditOrganizationButton from './EditOrganizationButton'
import Link from 'next/link'
import { Button } from '@/app/utils/Button'
interface OrganizationEntryProps {
  organization: IOrganization
}

const OrganizationEntry: React.FC<OrganizationEntryProps> = ({ organization }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`api/organizations/${organization.id}`)
      // onDeleted()
    } catch (err) {
      console.error('An error occurred.')
    }
  }

  return (
    <li className="border p-4 flex flex-col drop-shadow-card bg-background">
      <div className="flex justify-between">
        <Link href={`admin/${organization.id}`} className="flex items-center flex-1 gap-4">
          <img src={organization.logo} alt={organization.name} className="w-16 h-16 object-contain rounded" />
          <h2 className="text-xl font-bold">{organization.name}</h2>
        </Link>

        <div className=" flex flex-row gap-2">
          <EditOrganizationButton organization={organization} />
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <Link href={`admin/${organization.id}`}>
        <p className="text-ellipsis ... overflow-auto max-h-[50px]">{organization.description}</p>
        <p className="text-sm text-gray-500">{organization.location}</p>
      </Link>
    </li>
  )
}

export default OrganizationEntry
