'use client';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IExtendedMarker } from '@/lib/types';
import { formatTime } from '@/lib/utils/time';
import { Card } from '@/components/ui/card';
import DeleteMarkerButton from './DeleteMarkerButton';
/* Whats missing:
    - Add update marker logic: update marker should be a form that covers the marker sidebar
    - Update should write to the db and on callback refetch all markers
    - Delete marker logic
    - Would be good to link marker on on sidebar to marker on timeline -> when the marker is clicked highlight the marker on the timeline
          
  */

const Marker = ({
  marker,
  organizationId,
}: {
  marker: IExtendedMarker;
  organizationId: string;
}) => {
  return (
    <Card className="w-full max-w-2xl overflow-hidden p-0 shadow-none h-[100px]">
      <div className="flex flex-grow flex-row items-center h-full">
        <div className="h-full flex items-center">
          <div className="relative w-4 h-full">
            <input
              type="color"
              value={marker.color}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
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
                // onClick={() => setEditingMarker(marker._id)}
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
            IN {formatTime(marker.start)} - OUT {formatTime(marker.end)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Marker;
