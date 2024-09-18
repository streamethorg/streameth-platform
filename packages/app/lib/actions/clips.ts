'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  createMarkers,
  deleteMarker,
  updateMarkers,
} from '../services/clipSevice';
import { IMarker } from 'streameth-new-server/src/interfaces/marker.interface';
import { IExtendedMarkers } from '../types';

export const createMarkersAction = async ({
  markers,
}: {
  markers: IMarker;
}) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }
  try {
    const response = await createMarkers({
      markers,
      authToken,
    });

    if (!response) {
      throw new Error('Error creating markers');
    }
    revalidatePath('/studio');
    return response;
  } catch (error: any) {
    return {
      error: error,
    };
  }
};

export const updateMarkersAction = async ({
  markers,
}: {
  markers: IExtendedMarkers;
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

export const deleteMarkerAction = async ({
  markerId,
  subMarkerId,
  organizationId,
}: {
  markerId: string;
  subMarkerId: string;
  organizationId: string;
}) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }

  const response = await deleteMarker({
    markerId,
    subMarkerId,
    organizationId,
    authToken,
  });
  if (!response) {
    throw new Error('Error deleting marker');
  }
  revalidatePath('/studio');
  return response;
};
