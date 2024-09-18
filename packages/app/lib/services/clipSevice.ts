import { apiUrl } from '@/lib/utils/utils';
import { IExtendedMarkers } from '../types';
import { IMarker } from 'streameth-new-server/src/interfaces/marker.interface';

// create marker collection for an organization
export async function createMarkers({
  markers,
  authToken,
}: {
  markers: IMarker;
  authToken: string;
}): Promise<IExtendedMarkers> {
  console.log('markers', JSON.stringify(markers));
  const response = await fetch(`${apiUrl()}/markers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(markers),
  });

  if (!response.ok) {
    throw 'Error creating markers';
  }
  return (await response.json()).data;
}

// update markers for an organization
export const updateMarkers = async ({
  markers,
  authToken,
}: {
  markers: IExtendedMarkers;
  authToken: string;
}): Promise<IExtendedMarkers> => {
  const { _id, ...rest } = markers;
  console.log('rest', rest.metadata);
  try {
    const response = await fetch(`${apiUrl()}/markers/${markers._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(rest),
    });
    const responseData = await response.json();
    console.log('responseData', responseData);
    if (!response.ok) {
      throw new Error('Error updating markers');
    }
    return responseData.data;
  } catch (error) {
    console.error('Error updating markers:', error);
    throw error;
  }
};

// fetch all markers for an organization
export async function fetchMarkers({
  organizationId,
}: {
  organizationId: string;
}): Promise<IExtendedMarkers[]> {
  try {
    const response = await fetch(
      `${apiUrl()}/markers?organizationId=${organizationId}`,
      {
        cache: 'no-cache',
      }
    );
    const data = (await response.json()).data;
    if (!data) {
      return [];
    }
    return data;
  } catch (e) {
    console.log(e);
    throw 'Error fetching markers';
  }
}
// delete individual marker
export async function deleteMarker({
  markerId,
  subMarkerId,
  organizationId,
  authToken,
}: {
  markerId: string;
  subMarkerId: string;
  organizationId: string;
  authToken: string;
}): Promise<IExtendedMarkers> {
  try {
    const response = await fetch(`${apiUrl()}/markers/${markerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ subMarkerId, organizationId }),
    });
    if (!response.ok) {
      throw 'Error deleting marker';
    }
    return await response.json();
  } catch (e) {
    console.log('error in deleteMarker', e);
    throw e;
  }
}
