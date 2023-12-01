'use client'
import React, {
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  IDataExporter,
  IDataImporter,
  IEvent,
} from '@server/model/event'
import { ModalContext } from '@/components/context/ModalContext'
import SuccessErrorModal from './SuccessErrorModal'
import useValidateForm from '@/app/hooks/useValidateForm'
import { EventFormSchema } from '@/app/constants/event'
import useLocalStorage from '@/components/hooks/useLocalStorage'
// Define the shape of the context
interface IEventFormContext {
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
  formData: Omit<IEvent, 'id'>
  setFormData: React.Dispatch<
    React.SetStateAction<Omit<IEvent, 'id'>>
  >
  validationErrors: Record<string, string>
  event?: IEvent
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void
  handleDataExporterChange: (exporter: IDataExporter) => void
  handleDataImporterChange: (importer: IDataImporter) => void
  handleSubmit: () => void
  onFileUpload: (fileName: string, key: string) => void
}

const EventFormContext =
  React.createContext<IEventFormContext | null>(null)

interface EventFormProviderProps {
  organizationId: string
  event?: IEvent
  children: ReactNode
}

const EventFormProvider: React.FC<EventFormProviderProps> = ({
  children,
  organizationId,
  event,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const { openModal, closeModal } = useContext(ModalContext)
  const [formData, setFormData] = useLocalStorage<Omit<IEvent, 'id'>>(
    organizationId,
    {
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
      plugins: {
        disableChat: false,
      },
      dataExporter: [],
      dataImporter: [],
      enableVideoDownloader: false,
    }
  )

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const isValidForm = true
    if (isValidForm) {
      fetch(
        `/api/organizations/${organizationId}/events${
          event ? `/${event.id}` : `/${formData.name}`
        }`,
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
    <EventFormContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        error,
        setError,
        formData,
        setFormData,
        handleChange,
        handleDataExporterChange,
        handleDataImporterChange,
        handleSubmit,
        onFileUpload,
        validationErrors,
        event,
      }}>
      {children}
    </EventFormContext.Provider>
  )
}

export { EventFormContext, EventFormProvider }
