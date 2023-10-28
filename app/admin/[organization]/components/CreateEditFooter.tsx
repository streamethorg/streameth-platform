import React, { Dispatch, SetStateAction, useContext } from 'react'
import StatusBarOneIcon from '@/app/assets/icons/StatusBarOneIcon'
import StatusBarTwoIcon from '@/app/assets/icons/StatusBarTwoIcon'
import StatusBarFullIcon from '@/app/assets/icons/StatusBarFullIcon'
import { Button } from '@/app/utils/Button'
import { ModalContext } from '@/components/context/ModalContext'
import { IEvent } from '@/server/model/event'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface CreateEditFooterProps {
  currentStep: number
  setCurrentStep: Dispatch<SetStateAction<number>>
  event?: IEvent
  organizationId: string
  formData: Omit<IEvent, 'id'>
}

const CreateEditFooter = ({
  setCurrentStep,
  currentStep,
  event,
  organizationId,
  formData,
}: CreateEditFooterProps) => {
  const { openModal, closeModal } = useContext(ModalContext)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const handleDelete = () => {
    fetch(
      `/api/organizations/${organizationId}/events/${formData.name}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete event')
        }
      })
      .then(() => {
        closeModal()
        startTransition(() => router.push(`/admin/${organizationId}`))
        startTransition(() => router.refresh())
        if (isPending) {
          return <div>Loading...</div>
        }
      })
      .catch((err) => {
        console.error('An error occurred', err)
      })
  }

  const handleModalOpen = (event: IEvent) => {
    openModal(
      <div className="flex flex-col items-center">
        <div className="font-bold text-center mb-2">
          <span>{`Are you sure you want to delete the event "${event.name}"?`}</span>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => closeModal()} variant="outline">
            No
          </Button>
          <Button onClick={() => handleDelete()}>Yes</Button>
        </div>
      </div>
    )
  }
  const totalPages = 3

  const handleNextStep = () => {
    if (currentStep < totalPages) setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }
  return (
    <div className="flex justify-between items-center flex-col lg:flex-row gap-5 mt-5">
      <div>
        {event && (
          <Button
            variant="danger"
            onClick={() => handleModalOpen(event)}>
            Delete Event
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <p className="text-accent text-sm">
            {currentStep}/{totalPages}
          </p>
          {currentStep == 1 ? (
            <StatusBarOneIcon />
          ) : currentStep == 2 ? (
            <StatusBarTwoIcon />
          ) : (
            <StatusBarFullIcon />
          )}
        </div>
        {currentStep > 1 && (
          <Button variant="outline" onClick={handlePreviousStep}>
            Previous page
          </Button>
        )}
        {currentStep < totalPages && (
          <Button variant="outline" onClick={handleNextStep}>
            Next page
          </Button>
        )}
      </div>
    </div>
  )
}

export default CreateEditFooter
