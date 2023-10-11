'use client'

import React, { useState, useEffect, useContext } from 'react'
import { IOrganization } from '@/server/model/organization'
import { ModalContext } from '@/components/context/ModalContext'
import { apiUrl } from '@/server/utils'

interface OrganizationFormProps {
  onSuccess?: () => void
  onFailure?: (error: string) => void
  organization?: IOrganization
}

const CreateOrganizationForm: React.FC<OrganizationFormProps> = ({ onSuccess, onFailure, organization }) => {
  const { closeModal } = useContext(ModalContext)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    logo: '',
    location: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (organization) {
      setFormData({
        ...organization,
      })
    }
  }, [organization])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    fetch(`${apiUrl()}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create organisation')
        }
        return response.json()
      })
      .then((data) => {
        onSuccess?.()
      })
      .catch((err) => {
        onFailure?.('An error occurred.')
      })
      .finally(() => {
        setSubmitting(false)
        closeModal()
      })
  }

  return (
    <>
      <h1 className="font-bold text-center mb-3">Add an organization. All inputs are required</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Name
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Description
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Organization website URL
          <input
            type="url"
            name="url"
            placeholder="URL"
            value={formData.url}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Logo URL
          <input
            type="url"
            name="logo"
            placeholder="Logo URL"
            value={formData.logo}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Location
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </label>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </>
  )
}

export default CreateOrganizationForm
