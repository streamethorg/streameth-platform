'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@/app/utils/Button'
import CreateEditEventStepOne from './CreateEditEventStepOne'
import {
  IDataExporter,
  IDataImporter,
  IEvent,
} from '@/server/model/event'
import CreateEditEventStepTwo from './CreateEditEventStepTwo'
import CreateEditEventStepThree from './CreateEditEventStepThree'
import EventPreview from './EventPreview'
import { ModalContext } from '@/components/context/ModalContext'
import SuccessErrorModal from './SuccessErrorModal'
import CreateEditFooter from './CreateEditFooter'
import useValidateForm from '@/app/hooks/useValidateForm'
import { EventFormSchema } from '@/app/constants/event'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { generateId } from '@/server/utils'

const CreateEditEvent = ({
  event,
  organizationId,
}: {
  event?: IEvent
  organizationId: string
}) => {
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const { openModal, closeModal } = useContext(ModalContext)
  const [formData, setFormData] = useState<Omit<IEvent, 'id'>>({
    organizationId,
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
    dataExporter: [],
    dataImporter: [],
  })
  const router = useRouter()
  const {
    validationErrors,
    validateForm,
    setHasAttemptedFormSubmit,
  } = useValidateForm(formData, EventFormSchema)

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
      })
    }
  }, [event])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
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

  const handleDataExporterChange = (exporter: IDataExporter) => {
    setFormData({
      ...formData,
      dataExporter: [exporter],
    })
  }

  const handleDataImporterChange = (importer: IDataImporter) => {
    setFormData({
      ...formData,
      dataImporter: [importer],
    })
  }

  const handleSubmit = () => {
    const isValidForm = validateForm()
    if (true) {
      fetch(
        `/api/organizations/${organizationId}/events/${formData.name}`,
        {
          method: event ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create event')
          }
          return response.json()
        })
        .then(() => {
          setHasAttemptedFormSubmit(false)
          openModal(<SuccessErrorModal success />)
          !event &&
            startTransition(() =>
              router.push(
                `/admin/${organizationId}/${generateId(
                  formData.name
                )}`
              )
            )
          !event && startTransition(() => router.refresh())
          if (isPending) {
            return <div>Loading...</div>
          }
        })
        .catch((err) => {
          setError('An error occurred')
          openModal(<SuccessErrorModal success={false} />)
        })
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
          <h3 className="font-ubuntu text-accent w-3/5 text-3xl">
            Welcome to the Event Page Setup!
          </h3>
          <div className="flex gap-2 lg:gap-4 lg:flex-row flex-col">
            <Button variant="outline" onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button
              onClick={() => {
                openModal(
                  <EventPreview
                    closeModal={closeModal}
                    handleSubmit={handleSubmit}
                    formData={formData}
                  />
                )
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
          organizationId={organizationId}
          onFileUpload={onFileUpload}
          handleSubmit={handleSubmit}
          validationErrors={validationErrors}
        />
      )}
      {currentStep == 2 && (
        <CreateEditEventStepTwo
          formData={formData}
          setFormData={setFormData}
          handleDataImporterChange={handleDataImporterChange}
          handleDataExporterChange={handleDataExporterChange}
          validationErrors={validationErrors}
        />
      )}
      {currentStep == 3 && (
        <CreateEditEventStepThree
          validationErrors={validationErrors}
          handleChange={handleChange}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      )}
      {error && <div className="mt-4 text-red-500">{error}</div>}
      <CreateEditFooter
        event={event}
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
      />
    </div>
  )
}

export default CreateEditEvent
