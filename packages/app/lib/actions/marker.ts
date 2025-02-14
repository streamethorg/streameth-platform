'use server';

import { revalidateTag } from 'next/cache';
import {
  createMarker,
  deleteMarker,
  importMarkers,
  updateMarkers,
  updateMultipleMarkers,
} from '../services/markerSevice';
import { IMarker } from 'streameth-new-server/src/interfaces/marker.interface';
import { IExtendedMarker } from '../types';

export const createMarkerAction = async ({ marker }: { marker: IMarker }) => {
  try {
    const response = await createMarker({
      marker,
    });

    if (!response) {
      return { error: 'Error creating markers' };
    }
    revalidateTag(`markers-${marker.organizationId}`);
    return { data: response };
  } catch (error: any) {
    return {
      error: error.message || 'Error creating marker',
    };
  }
};

export const updateMarkersAction = async ({
  markers,
}: {
  markers: IExtendedMarker;
}) => {
  const response = await updateMarkers({
    markers: { ...markers },
  });
  if (!response) {
    throw new Error('Error updating markers');
  }
  revalidateTag(`markers-${markers.organizationId}`);
  return response;
};

export const updateMultipleMarkersAction = async ({
  organizationId,
  markers,
}: {
  organizationId: string;
  markers: IExtendedMarker[];
}) => {
  const response = await updateMultipleMarkers({
    organizationId,
    markers,
  });
  if (!response) {
    throw new Error('Error updating markers');
  }
  revalidateTag(`markers-${organizationId}`);
  return response;
};

export const deleteMarkerAction = async ({
  markerId,
  organizationId,
}: {
  markerId: string;
  organizationId: string;
}) => {
  const response = await deleteMarker({
    markerId,
    organizationId,
  });
  if (!response) {
    throw new Error('Error deleting marker');
  }
  revalidateTag(`markers-${organizationId}`);
  return response;
};

export const importMarkersAction = async ({
  stageId,
  organizationId,
  type,
  url,
}: {
  stageId: string;
  organizationId: string;
  type: string;
  url: string;
}) => {
  try {
    const response = await importMarkers({
      stageId,
      organizationId,
      type,
      url,
    });
    revalidateTag(`markers-${organizationId}`);
    return { data: response };
  } catch (error) {
    return { error: 'Error importing markers' };
  }
};
