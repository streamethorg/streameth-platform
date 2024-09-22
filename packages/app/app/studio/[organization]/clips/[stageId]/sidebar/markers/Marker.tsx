'use client';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IMarker } from './index';
import { formatTime } from '@/lib/utils/time';
import { Card } from '@/components/ui/card';

/* Whats missing:
    - Add update marker logic: update marker should be a form that covers the marker sidebar
    - Update should write to the db and on callback refetch all markers
    - Delete marker logic
    - Would be good to link marker on on sidebar to marker on timeline -> when the marker is clicked highlight the marker on the timeline
          
  */

const Marker = ({
  marker,
  setEditingMarker,
  updateMarker,
  removeMarker,
}: {
  marker: IMarker;
  setEditingMarker: (id: string) => void;
  updateMarker: (id: string, data: Partial<IMarker>) => void;
  removeMarker: (id: string) => void;
}) => {
  return (
    <Card className="w-full max-w-2xl overflow-hidden p-0 shadow-none h-[100px]">
      <div className="flex flex-grow flex-row items-center h-full">
        <div className="h-full flex items-center">
          <div className="relative w-4 h-full">
            <input
              type="color"
              value={marker.color}
              onChange={(e) =>
                updateMarker(marker._id, {
                  color: e.target.value,
                })
              }
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
                onClick={() => setEditingMarker(marker._id)}
              >
                <Edit2 size={16} />
              </Button>
              <Button
                size={'sm'}
                variant={'outline'}
                onClick={() => removeMarker(marker._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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

// // {editingMarker === marker._id ? (
//   <div className="flex flex-col space-y-2">
//     <Input
//       type="number"
//       value={marker.start}
//       onChange={(e) =>
//         updateMarker(marker._id, {
//           start: parseFloat(e.target.value),
//         })
//       }
//     />
//     <Input
//       type="number"
//       value={marker.end}
//       onChange={(e) =>
//         updateMarker(marker._id, {
//           end: parseFloat(e.target.value),
//         })
//       }
//     />
//     <Input
//       type="text"
//       value={marker.title}
//       onChange={(e) =>
//         updateMarker(marker._id, { title: e.target.value })
//       }
//     />
//     <Button onClick={() => setEditingMarker(null)}>
//       Save
//     </Button>
//   </div>
// ) : (
