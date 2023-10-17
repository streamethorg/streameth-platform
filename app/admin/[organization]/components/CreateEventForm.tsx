// 'use client'
import React, { useEffect, useState } from 'react'
import { IEvent } from '@/server/model/event'
import DataImporterSelect from './DataImporterInput'
import UploadFileInput from './UploadFileInput'
import { IDataImporter } from '@/server/model/event'

interface EventFormProps {
  organizationId: string
  event?: IEvent
}

const CreateEventForm: React.FC<EventFormProps> = ({ organizationId, event }) => {
  const [formData, setFormData] = useState<Omit<IEvent, 'id'>>({
    organizationId: organizationId,
    name: '',
    description: '',
    start: new Date(),
    end: new Date(),
    location: '',
    archiveMode: false,
    website: '',
    eventCover: '',
    timezone: '',
    accentColor: '',
  })

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
      })
    }
  }, [event])

  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleDataImporterChange = (importer: IDataImporter) => {
    setFormData({
      ...formData,
      dataImporter: [importer],
    })
  }

  const onFileUpload = (fileName: string) => {
    setFormData({
      ...formData,
      eventCover: fileName,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    fetch(`api/organizations/${organizationId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create event')
        }
        return response.json()
      })
      .then(() => {
        window.location.reload()
      })
      .catch((err) => {
        setError('An error occurred')
      })
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
        <input
          type="text"
          name="timezone"
          placeholder="Timezone"
          value={formData.timezone}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          name="accentColor"
          placeholder="Accent Color"
          value={formData.accentColor}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <UploadFileInput organizationId={organizationId} onFileUpload={onFileUpload} />
        <DataImporterSelect onChange={handleDataImporterChange} />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  )
}

export default CreateEventForm
