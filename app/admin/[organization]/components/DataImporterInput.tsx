// DataImporterSelect.tsx
import React, { useEffect, useState } from 'react'
import { IDataImporter, GSheetConfig, PretalxConfig } from '@/server/model/event'

interface DataImporterSelectProps {
  onChange: (importer: IDataImporter) => void
}

const DataImporterSelect: React.FC<DataImporterSelectProps> = ({ onChange }) => {
  const [selectedType, setSelectedType] = useState<'gsheet' | 'pretalx' | ''>('')
  const [config, setConfig] = useState<GSheetConfig & PretalxConfig>({
    sheetId: '',
    apiKey: '',
    url: '',
    apiToken: '',
  })

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as 'gsheet' | 'pretalx')
  }

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (selectedType === 'gsheet') {
      onChange({
        type: 'gsheet',
        config: { sheetId: config.sheetId, apiKey: config.apiKey },
      })
    } else if (selectedType === 'pretalx') {
      onChange({
        type: 'pretalx',
        config: { url: config.url, apiToken: config.apiToken },
      })
    }
  }, [selectedType, config])

  return (
    <>
      <select value={selectedType} onChange={handleTypeChange} className="p-2 border rounded w-full">
        <option value="">Select Data Importer Type</option>
        <option value="gsheet">Google Sheet</option>
        <option value="pretalx">Pretalx</option>
      </select>

      {selectedType === 'gsheet' && (
        <>
          <input
            type="text"
            name="sheetId"
            placeholder="Sheet ID"
            value={config.sheetId}
            onChange={handleConfigChange}
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="text"
            name="apiKey"
            placeholder="API Key"
            value={config.apiKey}
            onChange={handleConfigChange}
            className="p-2 border rounded w-full"
            required
          />
        </>
      )}

      {selectedType === 'pretalx' && (
        <>
          <input
            type="text"
            name="url"
            placeholder="URL"
            value={config.url}
            onChange={handleConfigChange}
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="text"
            name="apiToken"
            placeholder="API Token"
            value={config.apiToken}
            onChange={handleConfigChange}
            className="p-2 border rounded w-full"
            required
          />
        </>
      )}
    </>
  )
}

export default DataImporterSelect
