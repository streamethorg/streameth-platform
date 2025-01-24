import { ISpeakerModel } from 'streameth-new-server/src/interfaces/speaker.interface';

import { NavBarProps, IPagination, IExtendedSession } from './types';
import { apiUrl } from '@/lib/utils/utils';

import { fetchEvent } from '@/lib/services/eventService';
import { fetchEventStages } from '@/lib/services/stageService';
import { fetchAllSessions } from '@/lib/services/sessionService';

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
