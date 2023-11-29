import React, { useContext } from 'react'
import { Button } from '@/components/utils/Button'
import FormLabel from '@/components/utils/FormLabel'
import { FormTextInput } from '@/components/utils/FormTextInput'
import { EventFormContext } from './EventFormContext'
import FormRadio from '@/components/utils/FormRadio'

const CreateEditEventStepThree = () => {
  const context = useContext(EventFormContext)
  if (!context) return null
  const { formData, handleSubmit, setFormData, handleChange } =
    context
  return (
    <div>
      <p className="font-ubuntu text-lg pt-3 text-grey">
        Your event&apos;s identity comes to life on this final page.
        Select fonts, colors, and customize your event&apos;s look and
        feel. Personalize your event even further with a custom domain
        address, ensuring that your event page reflects your unique
        brand and vision. Your event, your style!
      </p>

      <div className="flex flex-col gap-2 mt-5">
        <FormTextInput
          label="Accent colour"
          name="accentColor"
          placeholder="E.g. #000000"
          toolTip
          value={formData.accentColor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e)
          }
        />
        <div className="flex flex-col mb-6">
          <FormLabel label="Enable Video Downloader" toolTip />
          <div className="flex gap-5">
            <FormRadio
              label="true"
              buttonHeight="35"
              checked={formData?.enableVideoDownloader}
              onChange={() =>
                setFormData({
                  ...formData,
                  enableVideoDownloader: true,
                })
              }
            />
            <FormRadio
              label="false"
              buttonHeight="35"
              checked={!formData?.enableVideoDownloader}
              onChange={() =>
                setFormData({
                  ...formData,
                  enableVideoDownloader: false,
                })
              }
            />
          </div>
        </div>
        <FormTextInput
          label="Chose your custom domain for the event page (Optional)"
          name="website"
          placeholder="E.g. watch.ethereumstream.org"
          toolTip
          value={formData?.website}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e)
          }
        />
        <div className="flex flex-col mb-6">
          <FormLabel label="Archive Mode" toolTip />
          <div className="flex gap-5">
            <FormRadio
              label="true"
              buttonHeight="35"
              checked={formData?.archiveMode}
              onChange={() =>
                setFormData({
                  ...formData,
                  archiveMode: true,
                })
              }
            />
            <FormRadio
              label="false"
              buttonHeight="35"
              checked={!formData?.archiveMode}
              onChange={() =>
                setFormData({
                  ...formData,
                  archiveMode: false,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <FormLabel
          label="Ready?"
          labelClassName="!mb-0"
          toolTip
          toolTipHTML="Click Publish to create event"
        />
        <p className="text-sm opacity-70 text-blue mb-2">
          Your event page can be edited at anytime from your admin
          page
        </p>
        <Button
          variant="green"
          className="text-green"
          onClick={handleSubmit}>
          Publish Event Page
        </Button>
      </div>
    </div>
  )
}

export default CreateEditEventStepThree
