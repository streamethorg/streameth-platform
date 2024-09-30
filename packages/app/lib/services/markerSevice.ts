import { apiUrl } from '@/lib/utils/utils';
import { IExtendedMarker } from '../types';
import { IMarker } from 'streameth-new-server/src/interfaces/marker.interface';

// create marker for a stage
export async function createMarker({
  marker,
  authToken,
}: {
  marker: IMarker;
  authToken: string;
}): Promise<IExtendedMarker> {
  console.log('markers', JSON.stringify(marker));
  const response = await fetch(`${apiUrl()}/markers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(marker),
  });

  if (!response.ok) {
    throw 'Error creating marker';
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

    if (!response.ok) {
      throw new Error('Error updating markers');
    }
    return (await response.json()).data;
  } catch (error) {
    console.error('Error updating markers:', error);
    throw error;
  }
};

export const updateMultipleMarkers = async ({
  organizationId,
  markers,
  authToken,
}: {
  organizationId: string;
  markers: IExtendedMarker[];
  authToken: string;
}): Promise<IExtendedMarker[]> => {
  const response = await fetch(`${apiUrl()}/markers/bulk`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      organizationId,
      markers,
    }),
  });

  if (!response.ok) {
    throw 'Error updating markers';
  }
  return (await response.json()).data;
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