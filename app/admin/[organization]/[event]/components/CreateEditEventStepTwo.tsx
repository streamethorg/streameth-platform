import StatusBarFullIcon from '@/app/assets/icons/StatusBarFullIcon'
import { Button } from '@/app/utils/Button'
import { FormTextInput } from '@/app/utils/FormTextInput'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { GSheetConfig, IDataImporter, IEvent, PretalxConfig } from '@/server/model/event'
import FormRadio from '@/app/utils/FormRadio'
import FormLabel from '@/app/utils/FormLabel'
import FormRadioBox from '@/app/utils/FormRadioBox'

const initialImporterConfig: GSheetConfig & PretalxConfig = {
  sheetId: '',
  apiKey: '',
  url: '',
  apiToken: '',
}

interface Props {
  formData: Omit<IEvent, 'id'>
  setFormData: Dispatch<SetStateAction<Omit<IEvent, 'id'>>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  setCurrentStep: Dispatch<SetStateAction<number>>
  handleDataImporterChange: (importer: IDataImporter) => void
}

const CreateEditEventStepTwo = ({ formData, setFormData, setCurrentStep, handleChange, handleDataImporterChange }: Props) => {
  const [selectedType, setSelectedType] = useState<string>(formData?.dataImporter?.[0]?.type ?? '')
  //@ts-ignore
  const [config, setConfig] = useState<GSheetConfig & PretalxConfig>(formData?.dataImporter?.[0]?.config ?? initialImporterConfig)

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (selectedType === 'gsheet') {
      handleDataImporterChange({
        type: 'gsheet',
        config: { sheetId: config.sheetId, apiKey: config.apiKey },
      })
    } else if (selectedType === 'pretalx') {
      handleDataImporterChange({
        type: 'pretalx',
        config: { url: config.url, apiToken: config.apiToken },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, config])

  return (
    <div>
      <p className="font-ubuntu text-lg pt-3 text-grey">
        On this page, easily import your schedule from platforms like Pretalx or Sched, or use our user-friendly scheduling sheet. Select your
        preferred livestream provider and choose any custom plug-ins for additional event customization.
      </p>
      <div className="flex flex-col gap-2 mt-5">
        <div className="flex flex-col mb-6">
          <FormLabel label="Import your schedule" toolTip />
          <div className="flex gap-5">
            <FormRadioBox checked={selectedType === 'gsheet'} onChange={() => setSelectedType('gsheet')} label="Connect Sched" />
            <FormRadioBox checked={selectedType === 'pretalx'} onChange={() => setSelectedType('pretalx')} label="Connect Pretalx" />
          </div>
        </div>
        {selectedType === 'gsheet' && (
          <>
            <FormTextInput
              label="gsheet ID"
              type="text"
              name="sheetId"
              placeholder="Sheet ID"
              value={config.sheetId}
              onChange={handleConfigChange}
              className="p-2 border rounded w-full"
            />
            <FormTextInput
              type="text"
              label="gsheet API key"
              name="apiKey"
              placeholder="API Key"
              value={config.apiKey}
              onChange={handleConfigChange}
              className="p-2 border rounded w-full"
            />
          </>
        )}
        {selectedType === 'pretalx' && (
          <>
            <FormTextInput type="text" label="Pretalx URL" name="url" placeholder="URL" value={config.url} onChange={handleConfigChange} />
            <FormTextInput
              label="Pretalx API Token"
              type="text"
              name="apiToken"
              placeholder="API Token"
              value={config.apiToken}
              onChange={handleConfigChange}
            />
          </>
        )}{' '}
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

      <div className="flex justify-end items-center gap-5">
        <div className="flex items-center gap-2">
          <p className="text-accent text-sm">2/2</p>
          <StatusBarFullIcon />
        </div>
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Previous page
        </Button>
      </div>
    </div>
  )
}

export default CreateEditEventStepTwo
