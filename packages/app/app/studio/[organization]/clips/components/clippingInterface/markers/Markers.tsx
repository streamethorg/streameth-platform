'use client';
import { Edit2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AddOrEditMarkerForm from './AddOrEditMarkerForm';
import { IExtendedMarkers } from '@/lib/types';
import DeleteMarkerButton from './DeleteMarkerButton';
import ImportMarkers from './ImportMarkers';

const Markers = ({
  organizationId,
  stageId,
  markers,
}: {
  organizationId: string;
  stageId: string;
  markers: IExtendedMarkers[];
}) => {
  const [editingMarker, setEditingMarker] = useState<IExtendedMarkers | null>(
    null
  );

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Markers</h3>
      <ImportMarkers organizationId={organizationId} stageId={stageId} />
      <AddOrEditMarkerForm stageId={stageId} organizationId={organizationId} />
      {markers && (
        <div className="mt-4 pb-4 my-3">
          <div className="max-h-[400px] overflow-auto">
            {markers.map((marker) => (
              <div key={marker._id} className="flex flex-col space-x-2 mb-2">
                {editingMarker?._id === marker._id ? (
                  <AddOrEditMarkerForm
                    stageId={stageId}
                    organizationId={organizationId}
                    markerToEdit={editingMarker}
                    onCancel={() => setEditingMarker(null)}
                  />
                ) : (
                  <div className="border-b border-gray-200 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-10"
                        style={{ backgroundColor: marker.color }}
                      ></div>

                      <div className="flex flex-col">
                        <p className="text-base line-clamp-1">{marker.name}</p>
                        <span className="text-sm text-gray-500">
                          IN {formatTime(marker.start)} - OUT{' '}
                          {formatTime(marker.end)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size={'sm'}
                        variant={'outline'}
                        onClick={() => setEditingMarker(marker)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <DeleteMarkerButton
                        markerId={marker._id}
                        organizationId={organizationId}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Markers;
