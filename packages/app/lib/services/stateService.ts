import {
  IState,
  StateStatus,
  StateType,
} from 'streameth-new-server/src/interfaces/state.interface';
import { IExtendedState } from '../types';
import { apiUrl } from '@/lib/utils/utils';
import { revalidatePath } from 'next/cache';

export const createState = async ({
  state,
  authToken,
}: {
  state: IState;
  authToken: string;
}): Promise<IState> => {
  console.log('fe state', state);
  try {
    const response = await fetch(`${apiUrl()}/states`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(state),
    });
    if (!response.ok) {
      console.log('error in createState', await response.json());
      throw 'Error updating state';
    }
    revalidatePath('/studio');
    return (await response.json()).data;
  } catch (e) {
    console.log('error in createState', e);
    throw e;
  }
};

export const fetchAllStates = async ({
  sessionId,
  eventId,
  eventSlug,
  type,
  status,
}: {
  sessionId?: string;
  eventId?: string;
  eventSlug?: string;
  type?: StateType;
  status?: StateStatus;
}): Promise<IExtendedState[]> => {
  try {
    const paramsObj: Record<string, string> = {};
    if (sessionId !== undefined) paramsObj.sessionId = sessionId;
    if (eventId !== undefined) paramsObj.eventId = eventId;
    if (eventSlug !== undefined) paramsObj.eventSlug = eventSlug;
    if (type !== undefined) paramsObj.type = type;
    if (status !== undefined) paramsObj.status = status;

    const params = new URLSearchParams(paramsObj).toString();

    const response = await fetch(`${apiUrl()}/states?${params}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      console.log(response.status);
      return [];
    }
    const data: IExtendedState[] = (await response.json()).data;

    return data;
  } catch (e) {
    console.log(e);
    throw 'Error fetching states';
  }
};
