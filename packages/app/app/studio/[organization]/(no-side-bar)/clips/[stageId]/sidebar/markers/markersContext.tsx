'use client';
import { fetchMarkers } from '@/lib/services/markerSevice';
import { IExtendedMarker } from '@/lib/types';
import { createContext, useContext, useState, useEffect } from 'react';

interface IMarkersContext {
  markers: IExtendedMarker[];
  setMarkers: (markers: IExtendedMarker[]) => void;
  filteredMarkers: IExtendedMarker[];
  setFilteredMarkers: (markers: IExtendedMarker[]) => void;
  selectedMarkerId: string;
  setSelectedMarkerId: (id: string) => void;
  isImportingMarkers: boolean;
  setIsImportingMarkers: (importing: boolean) => void;
  isLoadingMarkers: boolean;
  setIsLoadingMarkers: (loading: boolean) => void;
  fetchAndSetMarkers: () => void;
  isAddingOrEditingMarker: boolean;
  setIsAddingOrEditingMarker: (addingOrEditing: boolean) => void;
  organizationId: string;
  sessionId: string;
}

const MarkersContext = createContext<IMarkersContext | null>(null);

export const useMarkersContext = () => {
  const context = useContext(MarkersContext);
  if (!context) {
    throw new Error('useMarkersContext must be used within a MarkersProvider');
  }
  return context;
};

export const MarkersProvider = ({
  children,
  organizationId,
  stageId,
  sessionId,
}: {
  children: React.ReactNode;
  organizationId: string;
  stageId: string;
  sessionId?: string;
}) => {
  const [markers, setMarkers] = useState<IExtendedMarker[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<IExtendedMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>('');
  const [isImportingMarkers, setIsImportingMarkers] = useState<boolean>(false);
  const [isLoadingMarkers, setIsLoadingMarkers] = useState<boolean>(true);
  const [isAddingOrEditingMarker, setIsAddingOrEditingMarker] =
    useState<boolean>(false);

  const fetchAndSetMarkers = async () => {
    if (stageId) {
      try {
        const markers = await fetchMarkers({
          organizationId,
          stageId,
        });
        const sortedMarkers = markers.sort(
          (a, b) => a.startClipTime - b.startClipTime
        );
        setMarkers(sortedMarkers);
        sessionId &&
          setFilteredMarkers(
            sortedMarkers.filter((marker) => marker.sessionId === sessionId)
          );
      } catch (error) {
        console.error('Error fetching markers:', error);
      } finally {
        setIsLoadingMarkers(false);
      }
    }
  };

  useEffect(() => {
    fetchAndSetMarkers();
  }, [stageId, sessionId]);

  return (
    <MarkersContext.Provider
      value={{
        markers,
        setMarkers,
        filteredMarkers,
        setFilteredMarkers,
        selectedMarkerId,
        setSelectedMarkerId,
        isImportingMarkers,
        setIsImportingMarkers,
        isLoadingMarkers,
        setIsLoadingMarkers,
        fetchAndSetMarkers,
        isAddingOrEditingMarker,
        setIsAddingOrEditingMarker,
        organizationId,
        sessionId: sessionId || '',
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
};
