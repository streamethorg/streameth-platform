import { apiUrl } from '@/lib/utils/utils';
import { IExtendedMarker } from '../types';
import { IMarker } from 'streameth-new-server/src/interfaces/marker.interface';
import { fetchClient } from './fetch-client';

// create marker for a stage
export async function createMarker({
  marker,
}: {
  marker: IMarker;
}): Promise<IExtendedMarker> {
  const response = await fetchClient(`${apiUrl()}/markers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
}: {
  markers: IExtendedMarker;
}): Promise<IExtendedMarker> => {
  const { _id, ...rest } = markers;

  try {
    const response = await fetchClient(`${apiUrl()}/markers/${markers._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
}: {
  organizationId: string;
  markers: IExtendedMarker[];
}): Promise<IExtendedMarker[]> => {
  const response = await fetchClient(`${apiUrl()}/markers/bulk`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
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
}: {
  markerId: string;
  organizationId: string;
}): Promise<IExtendedMarker> {
  try {
    const response = await fetchClient(`${apiUrl()}/markers/${markerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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
}: {
  stageId: string;
  organizationId: string;
  type: string;
  url: string;
}): Promise<IExtendedMarker> => {
  const response = await fetchClient(`${apiUrl()}/markers/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stageId, organizationId, type, url }),
  });
  if (!response.ok) {
    throw 'Error importing markers';
  }
  return await response.json();
};
