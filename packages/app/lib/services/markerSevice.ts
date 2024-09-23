import { apiUrl } from '@/lib/utils/utils';
import { IExtendedMarker } from '../types';
import { IMarker } from 'streameth-new-server/src/interfaces/marker.interface';

// create marker for a stage
export async function createMarkers({
  markers,
  authToken,
}: {
  markers: IMarker;
  authToken: string;
}): Promise<IExtendedMarker> {
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

// update marker
export const updateMarkers = async ({
  markers,
  authToken,
}: {
  markers: IExtendedMarker;
  authToken: string;
}): Promise<IExtendedMarker> => {
  const { _id, ...rest } = markers;

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

// fetch all markers for a stage
export async function fetchMarkers({
  organizationId,
  stageId,
  date,
}: {
  organizationId: string;
  stageId?: string;
  date?: string;
}): Promise<IExtendedMarker[]> {
  try {
    const response = await fetch(
      `${apiUrl()}/markers?organization=${organizationId}&stageId=${stageId}`,
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

export async function deleteMarker({
  markerId,
  organizationId,
  authToken,
}: {
  markerId: string;
  organizationId: string;
  authToken: string;
}): Promise<IExtendedMarker> {
  try {
    const response = await fetch(`${apiUrl()}/markers/${markerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ organizationId }),
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

export const importMarkers = async ({
  stageId,
  organizationId,
  type,
  url,
  authToken,
}: {
  stageId: string;
  organizationId: string;
  type: string;
  url: string;
  authToken: string;
}): Promise<IExtendedMarker> => {
  const response = await fetch(`${apiUrl()}/markers/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ stageId, organizationId, type, url }),
  });
  if (!response.ok) {
    throw 'Error importing markers';
  }
  return await response.json();
};
