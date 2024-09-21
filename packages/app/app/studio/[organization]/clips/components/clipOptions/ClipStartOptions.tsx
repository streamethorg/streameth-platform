'use client';
import React, { useState } from 'react';
import LiveStreamSelect from './LiveStreamSelect';
import PastRecordingSelect from './PastRecordingSelect';
import InjectUrlInput from './InjectUrlInput';
import { Button } from '@/components/ui/button';
import { IExtendedSession, IExtendedStage } from '@/lib/types';

const ClipStartOptions = ({
  organizationId,
  pastRecordings,
  liveStages,
  customUrlStages,
}: {
  organizationId: string;
  pastRecordings: IExtendedSession[];
  liveStages: IExtendedStage[];
  customUrlStages: IExtendedStage[];
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Create a Clip</h1>
        {selectedOption && (
          <Button variant="outline" onClick={() => setSelectedOption(null)}>
            Back
          </Button>
        )}
      </div>

      {!selectedOption && (
        <div className="space-y-4">
          {liveStages && liveStages.length > 0 && (
            <Button
              className="w-full p-2 bg-blue text-white"
              onClick={() => handleOptionSelect('live')}
            >
              Clip Live Stream
            </Button>
          )}
          {pastRecordings && pastRecordings.length > 0 && (
            <Button
              onClick={() => handleOptionSelect('past')}
              className="w-full p-2 bg-green-500 text-white "
            >
              Clip Past Recording
            </Button>
          )}
          <Button
            onClick={() => handleOptionSelect('custom')}
            className="w-full p-2 bg-purple-500 text-white "
          >
            Clip Custom URL
          </Button>
        </div>
      )}

      {selectedOption === 'live' && (
        <LiveStreamSelect liveStages={liveStages} />
      )}

      {selectedOption === 'past' && (
        <PastRecordingSelect
          customUrlStages={customUrlStages}
          pastRecordings={pastRecordings}
        />
      )}

      {selectedOption === 'custom' && (
        <InjectUrlInput organizationId={organizationId} />
      )}
    </div>
  );
};

export default ClipStartOptions;
