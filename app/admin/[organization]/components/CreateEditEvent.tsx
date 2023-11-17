'use client'
import React, { useContext } from 'react'
import { Button } from '@/app/utils/Button'
import CreateEditEventStepOne from './CreateEditEventStepOne'
import CreateEditEventStepTwo from './CreateEditEventStepTwo'
import CreateEditEventStepThree from './CreateEditEventStepThree'
import EventPreview from './EventPreview'
import { ModalContext } from '@/components/context/ModalContext'
import CreateEditFooter from './CreateEditFooter'
import { EventFormContext } from './EventFormContext'

const CreateEditEvent = () => {
  const { openModal } = useContext(ModalContext)
  const context = useContext(EventFormContext)
  if (!context) return null
  const { currentStep, handleSubmit } = context

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-row sticky top-0 p-4 z-40 shadow bg-white items-center justify-between">
        <h3 className="font-ubuntu text-accent w-3/5 text-3xl">
          Welcome to the Event Page Setup!
        </h3>
        <div className="flex gap-2 lg:gap-4 lg:flex-row flex-col">
          <Button variant="outline" onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button
            onClick={() => {
              openModal(<EventPreview />)
            }}>
            Preview
          </Button>
        </div>
      </div>
      <div className="p-4">
        {currentStep == 1 && <CreateEditEventStepOne />}
        {currentStep == 2 && <CreateEditEventStepTwo />}
        {currentStep == 3 && <CreateEditEventStepThree />}
      </div>
      <CreateEditFooter />
    </div>
  )
}

export default CreateEditEvent
