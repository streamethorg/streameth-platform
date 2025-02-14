'use client';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { fetchMarkers } from '@/lib/services/markerSevice';
import { IExtendedMarker } from '@/lib/types';
import { createContext, useContext, useState, useEffect } from 'react';
import { useClipPageContext } from '../../ClipPageContext';

interface IMarkersContext {
  markers: IExtendedMarker[];
  setMarkers: (markers: IExtendedMarker[]) => void;
  selectedMarkerId: string;
  setSelectedMarkerId: (id: string) => void;
  isImportingMarkers: boolean;
  setIsImportingMarkers: (importing: boolean) => void;
  isLoadingMarkers: boolean;
  setIsLoadingMarkers: (loading: boolean) => void;
  fetchAndSetMarkers: () => void;
  isAddingOrEditingMarker: boolean;
  setIsAddingOrEditingMarker: (addingOrEditing: boolean) => void;
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
}: {
  children: React.ReactNode;
}) => {
  const { stageId, sessionId } = useClipPageContext();
  const [markers, setMarkers] = useState<IExtendedMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>('');
  const [isImportingMarkers, setIsImportingMarkers] = useState<boolean>(false);
  const [isLoadingMarkers, setIsLoadingMarkers] = useState<boolean>(true);
  const [isAddingOrEditingMarker, setIsAddingOrEditingMarker] =
    useState<boolean>(false);
  const { organizationId } = useOrganizationContext();
  const fetchAndSetMarkers = async () => {
    if (stageId) {
      try {
        const markers = await fetchMarkers({
          organizationId,
          stageId,
        });
        const sortedMarkers = markers
          .sort((a, b) => a.startClipTime - b.startClipTime)
          .filter((marker) => marker.sessionId === sessionId);
        setMarkers(sortedMarkers);
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
        selectedMarkerId,
        setSelectedMarkerId,
        isImportingMarkers,
        setIsImportingMarkers,
        isLoadingMarkers,
        setIsLoadingMarkers,
        fetchAndSetMarkers,
        isAddingOrEditingMarker,
        setIsAddingOrEditingMarker,
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
};
