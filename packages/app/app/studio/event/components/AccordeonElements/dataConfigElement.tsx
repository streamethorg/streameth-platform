import { useState, useEffect } from 'react'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'
import {
  IDataImporter,
  GSheetConfig,
  PretalxConfig,
} from 'streameth-server/model/event'
import { Input } from '@/components/ui/input'

interface Provider {
  name: string
  value: 'gsheet' | 'pretalx'
}

const providers: Provider[] = [
  {
    name: 'Google Sheet',
    value: 'gsheet',
  },
  {
    name: 'pretalx',
    value: 'pretalx',
  },
]

const DataConfigElement = ({
  value,
  onChange,
}: {
  value?: IDataImporter[]
  onChange: (value: IDataImporter[]) => void
}) => {
  const initialValue = value?.[0]
  const initialProvider = initialValue
    ? initialValue.type
    : providers[0].value

  const [selectedProvider, setSelectedProvider] = useState<
    'gsheet' | 'pretalx'
  >(initialProvider)
  const [config, setConfig] = useState(
    initialValue ? initialValue.config : {}
  )

  useEffect(() => {
    let newDataImporter: IDataImporter
    if (selectedProvider === 'gsheet') {
      newDataImporter = {
        type: 'gsheet',
        config: config as GSheetConfig,
      }
    } else {
      newDataImporter = {
        type: 'pretalx',
        config: config as PretalxConfig,
      }
    }
    onChange([newDataImporter])
  }, [selectedProvider, config, onChange])

  const handleConfigChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedConfig = {
      ...config,
      [e.target.name]: e.target.value,
    }
    setConfig(updatedConfig)
  }

  const handleProviderChange = (value: string) => {
    const newProvider = value as 'gsheet' | 'pretalx'
    setSelectedProvider(newProvider)
  }

  return (
    <div>
      <Select
        defaultValue={initialProvider}
        onValueChange={handleProviderChange}>
        <SelectTrigger>
          <span>
            {selectedProvider
              ? providers.find(
                  (provider) => provider.value === selectedProvider
                )?.name
              : 'Select provider'}
          </span>
        </SelectTrigger>
        <SelectContent>
          {providers.map((provider) => (
            <SelectItem key={provider.value} value={provider.value}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedProvider === 'gsheet' && (
        <div>
          <Input
            name="sheetId"
            value={(config as GSheetConfig).sheetId || ''}
            onChange={handleConfigChange}
            placeholder="Sheet ID"
          />
          {/* Add other Google Sheet config fields here */}
        </div>
      )}

      {selectedProvider === 'pretalx' && (
        <div>
          <Input
            name="url"
            value={(config as PretalxConfig).url || ''}
            onChange={handleConfigChange}
            placeholder="URL"
          />
          <Input
            name="apiToken"
            value={(config as PretalxConfig).apiToken || ''}
            onChange={handleConfigChange}
            placeholder="API Token"
          />
        </div>
      )}
    </div>
  )
}

export default DataConfigElement
