import { FormTextInput } from '@/app/utils/FormTextInput'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { GSheetConfig, IDataExporter, IDataImporter, IEvent, PretalxConfig } from '@/server/model/event'
import FormRadio from '@/app/utils/FormRadio'
import FormLabel from '@/app/utils/FormLabel'
import FormRadioBox from '@/app/utils/FormRadioBox'

const initialImporterConfig: GSheetConfig & PretalxConfig = {
  sheetId: '',
  apiKey: '',
  url: '',
  apiToken: '',
}

const initialExporterConfig: GSheetConfig = {
  driveId: '',
  driveApiKey: '',
}

interface Props {
  formData: Omit<IEvent, 'id'>
  setFormData: Dispatch<SetStateAction<Omit<IEvent, 'id'>>>
  handleDataImporterChange: (importer: IDataImporter) => void
  handleDataExporterChange: (exporter: IDataExporter) => void
  validationErrors?: Record<string, any>
}

const CreateEditEventStepTwo = ({ formData, setFormData, handleDataImporterChange, handleDataExporterChange }: Props) => {
  const [dataExportSelectedType, setDataExportSelectedType] = useState('gdrive')
  const [selectedType, setSelectedType] = useState<string>(formData?.dataImporter?.[0]?.type ?? '')
  //@ts-ignore
  const [config, setConfig] = useState<GSheetConfig & PretalxConfig>(formData?.dataImporter?.[0]?.config ?? initialImporterConfig)
  const [exporterConfig, setExporterConfig] = useState<GSheetConfig>(formData?.dataExporter?.[0]?.config ?? initialExporterConfig)

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleExporterConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setExporterConfig((prev) => ({
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

  useEffect(() => {
    if (dataExportSelectedType === 'gdrive') {
      handleDataExporterChange({
        type: 'gdrive',
        config: { driveId: exporterConfig.driveId, driveApiKey: exporterConfig.driveApiKey },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataExportSelectedType, exporterConfig])

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
            <FormRadioBox checked={selectedType === 'gsheet'} onChange={() => setSelectedType('gsheet')} label="Google Sheet" />
            <FormRadioBox checked={selectedType === 'pretalx'} onChange={() => setSelectedType('pretalx')} label="Pretalx" />
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
              placeholder="gsheet API Token"
              value={config.apiToken}
              onChange={handleExporterConfigChange}
            />
          </>
        )}
        <div>
          <div className='className="flex flex-col mb-6'>
            <FormLabel
              label="Export Event Assets"
              toolTip
              toolTipHTML="The dataExporter will be used for our post production/processing flows to drop our generated assets into a shared Google Drive for your event"
            />
            <FormRadioBox label="Google Drive" checked={dataExportSelectedType === 'gdrive'} onChange={() => setDataExportSelectedType('gdrive')} />
          </div>
          {dataExportSelectedType === 'gdrive' && (
            <>
              <FormTextInput
                label="Drive ID"
                type="text"
                name="driveId"
                placeholder="Drive ID"
                value={exporterConfig.driveId}
                onChange={handleExporterConfigChange}
                className="p-2 border rounded w-full"
              />
              <FormTextInput
                type="text"
                label="API key"
                name="driveApiKey"
                placeholder="Drive API Key"
                value={exporterConfig.driveApiKey}
                onChange={handleExporterConfigChange}
                className="p-2 border rounded w-full"
              />
            </>
          )}
        </div>
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
    </div>
  )
}

export default CreateEditEventStepTwo
