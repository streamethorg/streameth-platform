'use client';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IMarker } from './index';
import { formatTime } from '@/lib/utils/time';

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
  console.log(marker);
  return (
    <div key={marker._id} className="flex flex-col space-x-2 mb-2">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <input
                type="color"
                value={marker.color}
                onChange={(e) =>
                  updateMarker(marker._id, {
                    color: e.target.value,
                  })
                }
                className="w-4 h-7"
              />
            </div>
            <p className="text-base line-clamp-2">{marker.name}</p>
          </div>
          <div className="flex items-center gap-2">
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
