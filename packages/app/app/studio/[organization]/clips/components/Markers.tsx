'use client';
import { Plus, Trash2, Edit2, Check, Dot } from 'lucide-react';
import React, { useState } from 'react';
import { IMarker, useClipContext } from './ClipContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Markers = () => {
  const { videoRef, markers, setMarkers } = useClipContext();

  const [newMarker, setNewMarker] = useState<Partial<IMarker> | null>(null);
  const [editingMarker, setEditingMarker] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    if (!seconds) return '00:00:00';

    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  const getMarkerPosition = (time: number) => {
    if (videoRef.current && videoRef.current.duration) {
      return (time / videoRef.current.duration) * 100;
    }
    return 0;
  };

  const addMarker = () => {
    if (
      newMarker &&
      newMarker.start !== undefined &&
      newMarker.end !== undefined &&
      newMarker.title
    ) {
      const marker: IMarker = {
        id: Date.now().toString(),
        start: newMarker.start,
        end: newMarker.end,
        color: newMarker.color || '#FFA500',
        title: newMarker.title,
      };
      setMarkers([...markers, marker]);
      setNewMarker(null);
    }
  };

  const updateMarker = (id: string, updates: Partial<IMarker>) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, ...updates } : marker
      )
    );
  };

  const removeMarker = (id: string) => {
    setMarkers(markers.filter((marker) => marker.id !== id));
  };

  const handleMarkerDrag = (
    markerId: string,
    isStart: boolean,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const marker = markers.find((m) => m.id === markerId);
    if (!marker || !videoRef.current) return;

    const initialPosition = isStart ? marker.start : marker.end;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = videoRef.current!.getBoundingClientRect();
      const deltaX = moveEvent.clientX - startX;
      const deltaTime = (deltaX / rect.width) * videoRef.current!.duration;
      const newPosition = Math.max(
        0,
        Math.min(videoRef.current!.duration, initialPosition + deltaTime)
      );

      setMarkers((prevMarkers) =>
        prevMarkers.map((m) => {
          if (m.id === markerId) {
            if (isStart) {
              return { ...m, start: Math.min(newPosition, m.end - 0.1) };
            } else {
              return { ...m, end: Math.max(newPosition, m.start + 0.1) };
            }
          }
          return m;
        })
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div>
      {/* Marker controls */}
      <div className="mt-4 pb-10">
        <h3 className="text-lg font-semibold mb-2">Markers</h3>
        {markers.map((marker) => (
          <div key={marker.id} className="flex flex-col space-x-2 mb-2">
            {editingMarker === marker.id ? (
              <div className="flex flex-col space-y-2">
                <Input
                  type="number"
                  value={marker.start}
                  onChange={(e) =>
                    updateMarker(marker.id, {
                      start: parseFloat(e.target.value),
                    })
                  }
                />
                <Input
                  type="number"
                  value={marker.end}
                  onChange={(e) =>
                    updateMarker(marker.id, {
                      end: parseFloat(e.target.value),
                    })
                  }
                />
                <Input
                  type="text"
                  value={marker.title}
                  onChange={(e) =>
                    updateMarker(marker.id, { title: e.target.value })
                  }
                />
                <Button onClick={() => setEditingMarker(null)}>Save</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={marker.color}
                      onChange={(e) =>
                        updateMarker(marker.id, { color: e.target.value })
                      }
                      className="w-6 h-6"
                    />
                    <input
                      type="text"
                      value={marker.title}
                      onChange={(e) =>
                        updateMarker(marker.id, { title: e.target.value })
                      }
                      className="flex-grow"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={'outline'}
                      onClick={() => setEditingMarker(marker.id)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant={'outline'}
                      onClick={() => removeMarker(marker.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant={'primary'}>Clip</Button>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  IN {formatTime(marker.start)} - OUT {formatTime(marker.end)}
                </span>
              </>
            )}
          </div>
        ))}
        {newMarker ? (
          <div className="flex flex-col space-y-2 mt-4">
            <input
              type="color"
              value={newMarker.color || '#FFA500'}
              onChange={(e) =>
                setNewMarker({ ...newMarker, color: e.target.value })
              }
              className="flex-grow w-full"
            />

            <Input
              type="text"
              placeholder="Title"
              value={newMarker.title}
              onChange={(e) =>
                setNewMarker({ ...newMarker, title: e.target.value })
              }
              className="flex-grow"
            />
            <Input
              type="number"
              placeholder="Start"
              value={newMarker.start}
              onChange={(e) =>
                setNewMarker({
                  ...newMarker,
                  start: parseFloat(e.target.value),
                })
              }
            />
            <Input
              type="number"
              placeholder="End"
              value={newMarker.end}
              onChange={(e) =>
                setNewMarker({
                  ...newMarker,
                  end: parseFloat(e.target.value),
                })
              }
            />

            <Button onClick={addMarker}>Add</Button>
            <Button onClick={() => setNewMarker(null)}>Cancel</Button>
          </div>
        ) : (
          <Button variant={'primary'} onClick={() => setNewMarker({})}>
            <Plus className="mr-2" /> Add Marker
          </Button>
        )}
      </div>
    </div>
  );
};

export default Markers;
