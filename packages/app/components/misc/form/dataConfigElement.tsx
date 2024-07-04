'use client';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';
import {
  IDataImporter,
  GSheetConfig,
  PretalxConfig,
} from 'streameth-new-server/src/interfaces/event.interface';
import { createGoogleSheetAction } from '@/lib/actions/events';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
interface Provider {
  name: string;
  value: 'gsheet' | 'pretalx';
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
];

const DataConfigElement = ({
  value,
  onChange,
}: {
  value?: IDataImporter[];
  onChange: (value: IDataImporter[]) => void;
}) => {
  const initialValue = value?.[0];
  const initialProvider = initialValue ? initialValue.type : providers[0].value;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<
    'gsheet' | 'pretalx'
  >(initialProvider);
  const [config, setConfig] = useState(initialValue ? initialValue.config : {});

  useEffect(() => {
    let newDataImporter: IDataImporter;
    if (selectedProvider === 'gsheet') {
      newDataImporter = {
        type: 'gsheet',
        config: config as GSheetConfig,
      };
    } else {
      newDataImporter = {
        type: 'pretalx',
        config: config as PretalxConfig,
      };
    }
    onChange([newDataImporter]);
  }, [selectedProvider, config, onChange]);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedConfig = {
      ...config,
      [e.target.name]: e.target.value,
    };
    setConfig(updatedConfig);
  };

  const handleCreateSheet = async () => {
    setIsLoading(true);
    const sheetId = await createGoogleSheetAction({
      eventName: 'test',
    });
    setConfig({
      ...config,
      sheetId,
    });
    setIsLoading(false);
  };

  const handleProviderChange = (value: string) => {
    const newProvider = value as 'gsheet' | 'pretalx';
    setSelectedProvider(newProvider);
  };

  return (
    <div className="flex flex-col space-y-4">
      <Select
        defaultValue={initialProvider}
        onValueChange={handleProviderChange}
      >
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
        <div className="flex w-full flex-row">
          <Input
            name="sheetId"
            className="rounded-r-none"
            value={(config as GSheetConfig)?.sheetId || ''}
            onChange={handleConfigChange}
            placeholder="Sheet ID"
          />
          <Button
            variant={'secondary'}
            className="rounded-l-none border-b border-l-0 border-r border-t"
            loading={isLoading}
            disabled={config.sheetId !== undefined && config.sheetId !== ''}
            onClick={handleCreateSheet}
          >
            Create new
          </Button>
        </div>
      )}

      {selectedProvider === 'pretalx' && (
        <div className="space-y-4">
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
  );
};

export default DataConfigElement;
