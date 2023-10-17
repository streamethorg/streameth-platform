'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@/app/utils/Button'
import CreateEditEventStepOne from './CreateEditEventStepOne'
import { IDataImporter, IEvent } from '@/server/model/event'
import axios from 'axios'
import { apiUrl } from '@/server/utils'
import CreateEditEventStepTwo from './CreateEditEventStepTwo'
import EventPreview from './EventPreview'
import { ModalContext } from '@/components/context/ModalContext'

const CreateEditEvent = ({ event, organizationId }: { event: IEvent; organizationId: string }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const { openModal, closeModal, modalWidth } = useContext(ModalContext)
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

  const handleDataImporterChange = (importer: IDataImporter) => {
    setFormData({
      ...formData,
      dataImporter: [importer],
    })
  }

  const handleSubmit = async () => {
    try {
      await axios.post(`${apiUrl()}/organizations/${event.organizationId}/events`, formData)
    } catch (err) {
      setError('An error occurred.')
    }
  }

  const onFileUpload = (fileName: string, key: string) => {
    setFormData({
      ...formData,
      [key]: fileName,
    })
  }
  return (
    <div>
      <div>
        <div className="flex justify-between">
          <h3 className="font-ubuntu text-accent w-3/5 text-3xl">Welcome to the Event Page Setup!</h3>
          <div className="flex gap-2 lg:gap-4 lg:flex-row flex-col">
            <Button variant="outline" onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button
              onClick={() => {
                openModal(<EventPreview closeModal={closeModal} handleSubmit={handleSubmit} formData={formData} />)
                modalWidth('w-full')
              }}>
              Preview
            </Button>
          </div>
        </div>
      </div>
      {currentStep == 1 && (
        <CreateEditEventStepOne
          handleChange={handleChange}
          formData={formData}
          setFormData={setFormData}
          setCurrentStep={setCurrentStep}
          organizationId={organizationId}
          onFileUpload={onFileUpload}
        />
      )}
      {currentStep == 2 && (
        <CreateEditEventStepTwo
          handleChange={handleChange}
          formData={formData}
          setFormData={setFormData}
          handleDataImporterChange={handleDataImporterChange}
          setCurrentStep={setCurrentStep}
        />
      )}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  )
}

export default CreateEditEvent
