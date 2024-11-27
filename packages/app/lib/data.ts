import { ISpeakerModel } from 'streameth-new-server/src/interfaces/speaker.interface';

import { NavBarProps, IPagination, IExtendedSession } from './types';
import { apiUrl } from '@/lib/utils/utils';

import { fetchEvent } from '@/lib/services/eventService';
import { fetchEventStages } from '@/lib/services/stageService';

interface ApiParams {
  event?: string;
  organizationId?: string;
  stageId?: string;
  page?: number;
  size?: number;
  onlyVideos?: boolean;
  published?: string;
  speakerIds?: string[]; // Assuming speakerIds is an array of strings
  itemDate?: string;
  type?: string;
  itemStatus?: string;
  clipable?: boolean;
}

function constructApiUrl(baseUrl: string, params: ApiParams): string {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const formattedValue = Array.isArray(value) ? value.join(',') : value;
      return `${encodeURIComponent(key)}=${encodeURIComponent(formattedValue)}`;
    })
    .join('&');
  return `${baseUrl}?${queryParams}`;
}

export async function fetchAllSessions({
  event,
  organizationId,
  stageId,
  speakerIds,
  onlyVideos,
  published,
  page = 1,
  limit,
  searchQuery = '',
  type,
  itemStatus,
  itemDate,
  clipable,
}: {
  event?: string;
  organizationId?: string;
  stageId?: string;
  speakerIds?: string[];
  onlyVideos?: boolean;
  published?: string;
  page?: number;
  limit?: number;
  searchQuery?: string;
  type?: string;
  itemStatus?: string;
  itemDate?: string;
  clipable?: boolean;
}): Promise<{
  sessions: IExtendedSession[];
  pagination: IPagination;
}> {
  const params: ApiParams = {
    event,
    organizationId,
    stageId,
    page,
    size: searchQuery ? 0 : limit,
    onlyVideos,
    published,
    speakerIds,
    type,
    itemStatus,
    itemDate,
    clipable,
  };
  console.log(constructApiUrl(`${apiUrl()}/sessions`, params));
  const response = await fetch(
    constructApiUrl(`${apiUrl()}/sessions`, params),
    {
      cache: 'no-store',
    }
  );
  const a = await response.json();
  return a.data;
}

export async function fetchEventSpeakers({
  event,
}: {
  event?: string;
}): Promise<ISpeakerModel[]> {
  try {
    const response = await fetch(`${apiUrl()}/speakers/event/${event}`);
    const data = (await response.json()).data;

    return data.map((speaker: ISpeakerModel) => speaker);
  } catch (e) {
    console.log(e);
    throw 'Error fetching event speakers';
  }
}

export async function fetchSpeaker({
  speakerId,
}: {
  speakerId: string;
}): Promise<ISpeakerModel> {
  try {
    const response = await fetch(`${apiUrl()}/speakers/${speakerId}`);
    return (await response.json()).data;
  } catch (e) {
    console.log(e);
    throw 'Error fetching event speakers';
  }
}

//export async function fetchSpeakers(): Promise<ISpeakerModel[]> {
//  try {
//    const response = await fetch(`${apiUrl()}/speakers`);
//    const data = (await response.json()).data;
//
//    return data.map((speaker: ISpeakerModel) => speaker);
//  } catch (e) {
//    console.log(e);
//    throw 'Error fetching event speakers';
//  }
//}

export async function fetchNavBarRoutes({
  event,
  organization,
}: {
  event: string;
  organization: string;
}): Promise<NavBarProps> {
  const [eventData, sessionData, speakerData, stageData] = await Promise.all([
    fetchEvent({ eventSlug: event }),
    fetchAllSessions({ event }),
    fetchEventSpeakers({ event }),
    fetchEventStages({ eventId: event }),
  ]);

  const pages = [];

  if (sessionData.sessions.length > 0 && !eventData?.plugins?.hideSchedule)
    pages.push({
      href: `/${organization}/${event}#schedule`,
      name: 'Schedule',
    });

  if (speakerData.length > 0)
    pages.push({
      href: `/${organization}/${event}#speakers`,
      name: 'Speakers',
    });

  for (const stage of stageData) {
    if (stage.streamSettings?.streamId) {
      pages.push({
        href: `/${organization}/${event}/stage/${stage._id}`,
        name: stage.name,
      });
    }
  }

  return {
    pages,
    logo: eventData?.logo ?? '',
    homePath: `/${organization}/${event}`,
    showNav: true,
  };
}
