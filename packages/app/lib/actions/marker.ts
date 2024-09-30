'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
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
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    return { error: 'No user session found' };
  }
  try {
    const response = await createMarker({
      marker,
      authToken,
    });

    if (!response) {
      return { error: 'Error creating markers' };
    }
    revalidatePath('/studio');
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
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }

  const response = await updateMarkers({
    markers: { ...markers },
    authToken,
  });
  if (!response) {
    throw new Error('Error updating markers');
  }
  revalidatePath('/studio');
  return response;
};

export const updateMultipleMarkersAction = async ({
  organizationId,
  markers,
}: {
  organizationId: string;
  markers: IExtendedMarker[];
}) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }
  const response = await updateMultipleMarkers({
    organizationId,
    markers,
    authToken,
  });
  if (!response) {
    throw new Error('Error updating markers');
  }
  revalidatePath('/studio');
  return response;
};

export const deleteMarkerAction = async ({
  markerId,
  organizationId,
}: {
  markerId: string;
  organizationId: string;
}) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }

  const response = await deleteMarker({
    markerId,
    organizationId,
    authToken,
  });
  if (!response) {
    throw new Error('Error deleting marker');
  }
  revalidatePath('/studio');
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
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    return { error: 'No user session found' };
  }
  try {
    const response = await importMarkers({
      stageId,
      organizationId,
      type,
      url,
      authToken,
    });
    revalidatePath('/studio');
    return { data: response };
  } catch (error) {
    return { error: 'Error importing markers' };
  }
};
