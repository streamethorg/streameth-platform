import { IStage } from 'streameth-new-server/src/interfaces/stage.interface';
import { apiUrl } from '@/lib/utils/utils';
import { IExtendedStage } from '../types';
import type { Session, Stream } from 'livepeer/models/components';
import { fetchClient } from './fetch-client';

export async function fetchStage({
  stage,
}: {
  stage: string;
}): Promise<IExtendedStage | null> {
  try {
    const response = await fetch(`${apiUrl()}/stages/${stage}`, {
      cache: 'no-cache',
    });
    const data = (await response.json()).data;
    if (!data) {
      return null;
    }
    return data;
  } catch (e) {
    console.log(e);
    throw 'Error fetching stage';
  }
}

export async function fetchOrganizationStages({
  organizationId,
  fromDate,
  untilDate,
}: {
  organizationId: string;
  fromDate?: string;
  untilDate?: string;
}): Promise<IExtendedStage[]> {
  const fromDateQuery = fromDate ? `&fromDate=${fromDate}` : '';
  const untilDateQuery = untilDate ? `&untilDate=${untilDate}` : '';
  const response = await fetch(
    `${apiUrl()}/stages/organization/${organizationId}?${fromDateQuery}${untilDateQuery}`,
    {
      cache: 'no-cache',
      next: {
        tags: [`stages-${organizationId}`],
      },
    }
  );
  return (await response.json()).data;
}

export const fetchStages = fetchOrganizationStages;

export async function deleteStage({
  stageId,
  organizationId,
}: {
  stageId: string;
  organizationId: string;
}): Promise<IExtendedStage | null> {
  try {
    const response = await fetchClient(`${apiUrl()}/stages/${stageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizationId }),
    });
    if (!response.ok) {
      console.log('error in deleteStage', response);
      return null;
    }
    return await response.json();
  } catch (e) {
    console.log('error in deleteStage', e);
    throw e;
  }
}

export async function createStage({
  stage,
}: {
  stage: IExtendedStage;
}): Promise<IStage> {
  const response = await fetchClient(`${apiUrl()}/stages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stage),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error creating stage');
  }
  return (await response.json()).data;
}

export async function fetchEventStages({
  eventId,
}: {
  eventId?: string;
}): Promise<IExtendedStage[]> {
  try {
    const response = await fetch(`${apiUrl()}/stages/event/${eventId}`);

    const data = (await response.json()).data;
    return data.map((stage: IStage) => stage);
  } catch (e) {
    console.log(e);
    throw 'Error fetching stages';
  }
}

export const updateStage = async ({
  stage,
}: {
  stage: IExtendedStage;
}): Promise<IExtendedStage> => {
  const { _id, createdAt, recordingIndex, updatedAt, __v, ...rest } = stage;
  try {
    const response = await fetchClient(`${apiUrl()}/stages/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rest),
    });

    if (!response.ok) {
      throw new Error('Error updating stage');
    }
    return (await response.json()).data;
  } catch (error) {
    console.error('Error updating stage:', error);
    throw error;
  }
};

export async function createMultistream({
  name,
  streamId,
  targetURL,
  targetStreamKey,
  organizationId,
}: {
  name: string;
  streamId: string;
  targetStreamKey: string;
  targetURL: string;
  organizationId?: string;
}): Promise<{ message: string; status: string }> {
  const response = await fetchClient(`${apiUrl()}/streams/multistream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      streamId,
      targetURL,
      targetStreamKey,
      organizationId,
    }),
  });

  if (!response.ok) {
    throw 'Error creating multistream';
  }

  return await response.json();
}

export async function deleteMultistream({
  streamId,
  targetId,
  organizationId,
}: {
  streamId: string;
  targetId: string;
  organizationId?: string;
}): Promise<IExtendedStage> {
  try {
    const response = await fetchClient(`${apiUrl()}/streams/multistream`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ streamId, targetId, organizationId }),
    });
    if (!response.ok) {
      throw 'Error deleting multistream';
    }
    return await response.json();
  } catch (e) {
    console.log('error in deleteMultistream', e);
    throw e;
  }
}

export async function fetchStageRecordings({
  streamId,
}: {
  streamId: string;
}): Promise<Session[]> {
  try {
    const response = await fetch(`${apiUrl()}/streams/recording/${streamId}`);
    const data = (await response.json()).data;
    return data;
  } catch (e) {
    console.log(e);
    throw 'Error fetching stage';
  }
}

export async function createSocialLivestreamStage({
  stageId,
  socialId,
  socialType,
  organizationId,
}: {
  stageId: string;
  socialId: string;
  socialType: string;
  organizationId: string;
}): Promise<{
  error: { details: string };
  data: {
    ingestUrl: 'string';
    streamKey: 'string';
  };
}> {
  try {
    const response = await fetchClient(`${apiUrl()}/stages/livestream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stageId, socialId, socialType, organizationId }),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = `Error ${response.status}: ${
        error.message || 'Unknown error occurred'
      }`;
      throw new Error(errorMessage);
    }
    return (await response.json()).data;
  } catch (error) {
    const errorObject = {
      message: 'Failed to create social livestream stage',
      details: error instanceof Error ? error.message : 'Unknown error',
    };

    throw errorObject;
  }
}
