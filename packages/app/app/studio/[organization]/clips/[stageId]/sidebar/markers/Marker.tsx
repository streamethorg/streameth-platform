'use client';
import { Edit2 } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { IExtendedMarker } from '@/lib/types';
import { formatTime } from '@/lib/utils/time';
import { Card } from '@/components/ui/card';
import DeleteMarkerButton from './DeleteMarkerButton';
import { useClipContext } from '../../ClipContext';

const Marker = ({
  marker,
  organizationId,
}: {
  marker: IExtendedMarker;
  organizationId: string;
}) => {
  const {
    setIsAddingOrEditingMarker,
    isAddingOrEditingMarker,
    setSelectedMarkerId,
    selectedMarkerId,
  } = useClipContext();

  return (
    <Card
      onClick={() => setSelectedMarkerId(marker._id)}
      className={`w-full max-w-2xl overflow-hidden p-0 shadow-none h-[100px] ${
        selectedMarkerId === marker._id
          ? 'border-2 border-blue border-opacity-50'
          : ''
      }`}
    >
      <div className="flex flex-grow flex-row items-center h-full">
        <div className="h-full flex items-center">
          <div className="relative w-2 h-full">
            <p
              style={{
                backgroundColor: marker.color,
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            ></p>
            <div
              className="w-full h-full rounded"
              style={{
                backgroundColor: marker.color,
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
              }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col p-2 w-full">
          <div className="flex flex-row justify-between w-full">
            <p className="text-base line-clamp-2">{marker.name}</p>
            <div className="flex items-center gap-2 justify-end">
              <Button
                size={'sm'}
                variant={'outline'}
                disabled={isAddingOrEditingMarker}
                onClick={() => {
                  setIsAddingOrEditingMarker(true);
                  setSelectedMarkerId(marker._id);
                }}
              >
                <Edit2 size={16} />
              </Button>
              <DeleteMarkerButton
                markerId={marker._id}
                organizationId={organizationId}
              />
            </div>
          </div>
          <span className="text-sm text-gray-500">
            IN {formatTime(marker.startClipTime)} - OUT{' '}
            {formatTime(marker.endClipTime)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Marker;
