'use client'
import React from 'react'
import { IOrganization } from '@/server/model/organization'
import EditOrganizationButton from './EditOrganizationButton'
import Link from 'next/link'
interface OrganizationEntryProps {
  organization: IOrganization
}

const OrganizationEntry: React.FC<OrganizationEntryProps> = ({ organization }) => {
  const handleDelete = () => {
    fetch(`api/organizations/${organization.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('An error occurred while deleting.')
        }
        // onDeleted();
      })
      .catch((err) => {
        console.error('An error occurred:', err)
      })
  }

  return (
    <li className="border p-2 rounded flex justify-between items-center">
      <Link href={`admin/${organization.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
        <img src={organization.logo} alt={organization.name} className="w-16 h-16 rounded" />
        <div>
          <h2 className="text-xl font-bold">{organization.name}</h2>
          <p>{organization.description}</p>
          <p className="text-sm text-gray-500">{organization.location}</p>
        </div>
      </Link>
      <div className="ml-auto  flex flex-row ">
        <EditOrganizationButton organization={organization} />
        <button className="bg-red-500 text-white p-2 rounded ml-2" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default OrganizationEntry
