import React, { Dispatch, SetStateAction } from 'react'
import StatusBarFullIcon from '@/app/assets/icons/StatusBarFullIcon'
import { Button } from '@/app/utils/Button'
import FormLabel from '@/app/utils/FormLabel'
import { IDataImporter, IEvent } from '@/server/model/event'
import { FormTextInput } from '@/app/utils/FormTextInput'

interface Props {
  formData: Omit<IEvent, 'id'>
  setFormData: Dispatch<SetStateAction<Omit<IEvent, 'id'>>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleSubmit: () => void
  validationErrors?: Record<string, any>
}
const CreateEditEventStepThree = ({ formData, handleChange, handleSubmit }: Props) => {
  return (
    <div>
      <p className="font-ubuntu text-lg pt-3 text-grey">
        Your event&apos;s identity comes to life on this final page. Select fonts, colors, and customize your event&apos;s look and feel. Personalize
        your event even further with a custom domain address, ensuring that your event page reflects your unique brand and vision. Your event, your
        style!
      </p>

      <div className="flex flex-col gap-2 mt-5">
        <FormTextInput
          label="Accent colour"
          name="accentColor"
          placeholder="E.g. #000000"
          toolTip
          value={formData.accentColor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <FormTextInput
          label="Chose your custom domain for the event page (Optional)"
          name="website"
          placeholder="E.g. watch.ethereumstream.org"
          toolTip
          value={formData?.website}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
      </div>

      <div className="mb-6">
        <FormLabel label="Ready?" labelClassName="!mb-0" toolTip toolTipHTML="Click Publish to create event" />
        <p className="text-sm opacity-60 text-accent mb-2">Your event page can be edited at anytime from your admin page</p>
        <Button variant="green" className="text-green" onClick={handleSubmit}>
          Publish Event Page
        </Button>
      </div>
    </div>
  )
}

export default CreateEditEventStepThree
