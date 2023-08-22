'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IOrganization } from '@/server/model/organization'

interface EventFormProps {
  organizationId: string
}

interface FormData {
  name: string
  description: string
  start: Date | string
  end: Date | string
  location: string
  eventCover?: string
  archiveMode?: boolean
  website?: string
}

const EventForm: React.FC<EventFormProps> = ({ organizationId }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    start: new Date(),
    end: new Date(),
    location: '',
  })

  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'start' || name === 'end') {
      setFormData({
        ...formData,
        [name]: new Date(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`organizations/${organizationId}/events`, formData)
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (err) {
      setError('An error occurred.')
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="date"
          name="start"
          value={formData.start instanceof Date ? formData.start.toISOString().split('T')[0] : formData.start}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="date"
          name="end"
          value={formData.end instanceof Date ? formData.end.toISOString().split('T')[0] : formData.end}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        {/* Add other fields similarly */}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  )
}

export default EventForm
