'use client';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import React, { useState } from 'react';
import { IMarker, useClipContext } from '../ClipContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  createMarkersAction,
  deleteMarkerAction,
  updateMarkersAction,
} from '@/lib/actions/clips';
import { toast } from 'sonner';
import { IExtendedMarkers } from '@/lib/types';
import ImportMarkers from './ImportMarkers';

const Markers = ({
  organizationId,
  organizationMarkers,
}: {
  organizationMarkers?: IExtendedMarkers[];
  organizationId: string;
}) => {
  const { videoRef, markers, setMarkers } = useClipContext();
  const [newMarker, setNewMarker] = useState<Partial<
    IMarker['metadata'][0]
  > | null>(null);
  const [editingMarker, setEditingMarker] = useState<string | null>(null);
  const [markersName, setMarkersName] = useState<string>('');
  const [isCustomMarker, setIsCustomMarker] = useState(false);

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
      const marker: IMarker['metadata'][0] = {
        id: Date.now().toString(),
        start: newMarker.start,
        end: newMarker.end,
        color: newMarker.color || '#FFA500',
        title: newMarker.title,
        description: newMarker.description || '',
      };
      setMarkers((prevMarkers) => {
        if (!prevMarkers) {
          return {
            name: markersName,
            organizationId,
            metadata: [marker],
          };
        }
        return {
          ...prevMarkers,
          metadata: [...prevMarkers.metadata, marker],
        };
      });
      setNewMarker(null);
    }
  };

  const updateMarker = (
    id: string,
    updates: Partial<IMarker['metadata'][0]>
  ) => {
    setMarkers((prevMarkers) => {
      if (!prevMarkers) return null;
      return {
        ...prevMarkers,
        metadata: prevMarkers.metadata.map((marker) =>
          marker.id === id ? { ...marker, ...updates } : marker
        ),
      };
    });
  };

  const removeMarker = (id: string) => {
    setMarkers((prevMarkers) => {
      if (!prevMarkers) return null;
      return {
        ...prevMarkers,
        metadata: prevMarkers.metadata.filter((marker) => marker.id !== id),
      };
    });
  };

  const handleMarkerDrag = (
    markerId: string,
    isStart: boolean,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const marker = markers?.metadata.find((m) => m.id === markerId);
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

      setMarkers((prevMarkers) => {
        if (!prevMarkers) return null;
        return {
          ...prevMarkers,
          metadata: prevMarkers.metadata.map((m) => {
            if (m.id === markerId) {
              if (isStart) {
                return { ...m, start: Math.min(newPosition, m.end - 0.1) };
              } else {
                return { ...m, end: Math.max(newPosition, m.start + 0.1) };
              }
            }
            return m;
          }),
        };
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSaveMarkers = async () => {
    if (!markersName) {
      toast.error('Please enter a name for the markers');
      return;
    }
    const markerData = {
      name: markersName,
      organizationId,
      metadata: [],
    };
    await createMarkersAction({ markers: markerData })
      .then((response) => {
        console.log('responseData', response);
        if ('error' in response) {
          toast.error('Error saving new markers');
        } else {
          toast.success('New markers saved successfully');
          setMarkers({
            _id: response._id,
            name: markersName,
            organizationId,
            metadata: [],
          });
        }
      })
      .catch((err) => {
        toast.error('Error saving new markers');
      });
  };

  const handleUpdateMarkers = async () => {
    if (!markers || !markers._id) {
      toast.error('Cannot update markers without an ID');
      return;
    }
    await updateMarkersAction({
      markers: {
        ...markers,
        _id: markers._id,
      },
    })
      .then((response) => {
        //@ts-ignore
        if (!response || response?.error) {
          toast.error('Error updating markers');
        } else {
          toast.success('Markers updated successfully');
        }
      })
      .catch((err) => {
        toast.error('Error updating markers');
      });
  };

  const handleDeleteMarker = async ({
    markerId,
    subMarkerId,
  }: {
    markerId: string;
    subMarkerId: string;
  }) => {
    // setIsDeleting(true);
    await deleteMarkerAction({
      markerId: markerId,
      subMarkerId: subMarkerId,
      organizationId: organizationId,
    })
      .then((response) => {
        if (response) {
          toast.success('Marker deleted');
        } else {
          toast.error('Error deleting marker');
        }
      })
      .catch(() => {
        toast.error('Error deleting marker');
      })
      .finally(() => {
        // setIsDeleting(false);
      });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Markers</h3>
      <ImportMarkers organizationMarkers={organizationMarkers} />

      {!markers && (
        <div className="flex items-center gap-2 mt-4 pb-4 my-3">
          <Input
            value={markersName}
            onChange={(e) => setMarkersName(e.target.value)}
            placeholder="Enter Markers Collection Name"
          />
          <Button
            placeholder="Markers collection name"
            onClick={() => {
              handleSaveMarkers();
            }}
            disabled={!markersName}
          >
            Create Markers
          </Button>
        </div>
      )}

      {markers && (
        <>
          <div className="mt-4 pb-4 my-3">
            <h4 className="font-semibold mb-2">{markers.name}</h4>
            {markers.metadata.map((marker) => (
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
                  <div className="border-b border-gray-200">
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
                        <p>{marker.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size={'sm'}
                          variant={'outline'}
                          onClick={() => setEditingMarker(marker.id)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size={'sm'}
                          variant={'outline'}
                          onClick={() => removeMarker(marker.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      IN {formatTime(marker.start)} - OUT{' '}
                      {formatTime(marker.end)}
                    </span>
                  </div>
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
                <div className="flex items-center gap-2 w-full">
                  <Button
                    className="w-full"
                    variant={'primary'}
                    onClick={addMarker}
                  >
                    Add
                  </Button>
                  <Button
                    className="w-full"
                    variant={'outline'}
                    onClick={() => setNewMarker(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant={'primary'}
                size={'sm'}
                onClick={() => setNewMarker({})}
              >
                <Plus className="mr-2" /> Add Marker
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={'outline'}
              onClick={() => {
                setMarkers(null);
                setIsCustomMarker(false);
              }}
            >
              Clear All
            </Button>
            <Button onClick={handleUpdateMarkers} variant={'primary'}>
              Update Markers
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Markers;
