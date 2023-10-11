'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/app/utils/Button'
import CreateEditEventStepOne from './CreateEditEventStepOne'
import { IEvent } from '@/server/model/event'
import axios from 'axios'
import { apiUrl } from '@/server/utils'

const CreateEditEvent = ({ event }: { event: IEvent }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<IEvent, 'id'>>({
    organizationId: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async () => {
    try {
      await axios.post(`${apiUrl()}/organizations/${event.organizationId}/events`, formData)
    } catch (err) {
      setError('An error occurred.')
    }
  }
  return (
    <div>
      <div>
        <div className="flex justify-between">
          <h3 className="font-ubuntu text-accent text-3xl">Welcome to the Event Page Setup!</h3>
          <div className="flex gap-5">
            <Button variant="outline" onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button>Preview</Button>
          </div>
        </div>
        <p className="font-ubuntu text-lg pt-3 text-grey">
          Welcome to the first step in creating your event on StreamETH! Here, you{`'`}ll provide essential details like your event{`'`}s title,
          description, location, and dates. Additionally, you can upload your event{`'`}s digital assets, setting the foundation for a visually
          engaging event page that will captivate your audience.
        </p>
      </div>
      {currentStep == 1 && <CreateEditEventStepOne handleChange={handleChange} formData={formData} setFormData={setFormData} />}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  )
}

export default CreateEditEvent
