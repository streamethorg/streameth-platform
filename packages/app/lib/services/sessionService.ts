import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface';
import {
  IExtendedScheduleImporter,
  IExtendedSession,
  IPagination,
} from '../types';
import { apiUrl } from '@/lib/utils/utils';
import { Livepeer } from 'livepeer';
import { ISession } from 'streameth-new-server/src/interfaces/session.interface';
import { IScheduleImporter } from 'streameth-new-server/src/interfaces/schedule-importer.interface';
import { revalidatePath } from 'next/cache';
import { Asset } from 'livepeer/models/components';
import FuzzySearch from 'fuzzy-search';

interface ApiParams {
  event?: string;
  organization?: string;
  stageId?: string;
  page?: number;
  size?: number;
  onlyVideos?: boolean;
  published?: boolean;
  speakerIds?: string[]; // Assuming speakerIds is an array of strings
  date?: Date;
  type?: string;
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
  organizationSlug,
  stageId,
  speakerIds,
  onlyVideos,
  published,
  page = 1,
  limit,
  searchQuery = '',
  type,
}: {
  event?: string;
  organizationSlug?: string;
  stageId?: string;
  speakerIds?: string[];
  onlyVideos?: boolean;
  published?: boolean;
  page?: number;
  limit?: number;
  searchQuery?: string;
  type?: string;
}): Promise<{
  sessions: IExtendedSession[];
  pagination: IPagination;
}> {
  const params: ApiParams = {
    event,
    stageId,
    organization: organizationSlug,
    page,
    size: searchQuery ? 0 : limit,
    onlyVideos,
    published,
    speakerIds,
    type,
  };

  const response = await fetch(
    constructApiUrl(`${apiUrl()}/sessions`, params),
    {
      cache: 'no-store',
    }
  );
  const a = await response.json();
  const allSessions = a.data;
  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase();
    const fuzzySearch = new FuzzySearch(
      allSessions?.sessions,
      ['name', 'description', 'speakers.name'],
      {
        caseSensitive: false,
        sort: true,
      }
    );

    allSessions.sessions = fuzzySearch.search(normalizedQuery);
  }

  // Calculate total items and total pages
  const totalItems = searchQuery
    ? allSessions.sessions.length
    : allSessions.totalDocuments;
  const totalPages = limit ? Math.ceil(totalItems / limit) : 1;

  // Implement manual pagination for fuzzy search
  const startIndex = (page - 1) * limit!;
  const endIndex = startIndex + limit!;
  const paginatedSessions = allSessions.sessions.slice(startIndex, endIndex);

  // Return paginated data and pagination metadata
  return {
    sessions: searchQuery ? paginatedSessions : allSessions.sessions,
    pagination: allSessions?.pagination
      ? allSessions.pagination
      : {
          currentPage: page,
          totalPages,
          totalItems,
          limit,
        },
  };
}

export const createSession = async ({
  session,
  authToken,
}: {
  session: ISession;
  authToken: string;
}): Promise<ISession> => {
  try {
    const response = await fetch(`${apiUrl()}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(session),
    });
    if (!response.ok) {
      console.log('error in createSession', await response.json());
      throw 'Error updating session';
    }
    revalidatePath('/studio');
    return (await response.json()).data;
  } catch (e) {
    console.log('error in updateSession', e);
    throw e;
  }
};
export const fetchSession = async ({
  session,
}: {
  session: string;
}): Promise<IExtendedSession | null> => {
  try {
    const LivepeerClient = new Livepeer({
      apiKey: process.env.LIVEPEER_API_KEY,
    });
    const response = await fetch(`${apiUrl()}/sessions/${session}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    const data: IExtendedSession = (await response.json()).data;
    if (data.assetId) {
      const livepeerData = await LivepeerClient.asset.get(data.assetId);
      data.videoUrl = livepeerData.asset?.playbackUrl;
    }
    return data;
  } catch (e) {
    console.log(e);
    throw 'Error fetching event session';
  }
};

export const updateSession = async ({
  session,
  authToken,
}: {
  session: IExtendedSession;
  authToken: string;
}): Promise<ISessionModel> => {
  const modifiedSession = (({
    _id,
    slug,
    autoLabels,
    createdAt,
    updatedAt,
    __v,
    ...rest
  }) => rest)(session);

  try {
    const response = await fetch(`${apiUrl()}/sessions/${session._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(modifiedSession),
    });
    if (!response.ok) {
      console.log('error in updateSession', await response.json());
      throw 'Error updating session';
    }
    return (await response.json()).data;
  } catch (e) {
    console.log('error in updateSession', e);
    throw e;
  }
};

export const deleteSession = async ({
  sessionId,
  organizationId,
  authToken,
}: {
  sessionId: string;
  organizationId: string;
  authToken: string;
}) => {
  try {
    const response = await fetch(`${apiUrl()}/sessions/${sessionId}`, {
      method: 'DELETE',
      body: JSON.stringify({ organizationId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      console.log('error in deleteSession', await response.json());
      throw 'Error deleting session';
    }
    return await response.json();
  } catch (e) {
    console.log('error in deleteSession', e);
    throw e;
  }
};

export const createClip = async ({
  start,
  end,
  playbackId,
  recordingId,
  authToken,
  sessionId,
}: {
  sessionId: string;
  authToken: string;
  playbackId: string;
  recordingId: string;
  start: number;
  end: number;
}): Promise<ISession> => {
  try {
    const response = await fetch(`${apiUrl()}/streams/clip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        end,
        playbackId,
        sessionId,
        start,
        recordingId,
      }),
    });

    if (!response.ok) {
      throw 'Error updating session';
    }
    revalidatePath('/studio');
    return (await response.json()).data;
  } catch (e) {
    console.log('error in updateSession', e);
    throw e;
  }
};

export const fetchSessionMetrics = async ({
  playbackId,
}: {
  playbackId: string;
}): Promise<{ viewCount: number; playTimeMins: number }> => {
  try {
    const response = await fetch(`${apiUrl()}/streams/metric/${playbackId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        viewCount: 0,
        playTimeMins: 0,
      };
    }

    return (await response.json()).data;
  } catch (e) {
    console.log(e);
    throw 'Error fetching event session';
  }
};

export const fetchAsset = async ({
  assetId,
}: {
  assetId: string;
}): Promise<Asset | null> => {
  try {
    const response = await fetch(`${apiUrl()}/streams/asset/${assetId}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }

    return (await response.json()).data;
  } catch (e) {
    console.log(e);
    throw 'Error fetching event session';
  }
};

export const createAsset = async ({
  fileName,
  authToken,
}: {
  fileName: string;
  authToken: string;
}): Promise<any> => {
  try {
    const response = await fetch(`${apiUrl()}/streams/asset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fileName }),
    });

    if (!response.ok) {
      throw 'Error updating session';
    }
    revalidatePath('/studio');
    return (await response.json()).data;
  } catch (e) {
    console.log('error in updateSession', e);
    throw e;
  }
};

export const generateThumbnail = async ({
  session,
}: {
  session: IExtendedSession;
}): Promise<any> => {
  try {
    const response = await fetch(`${apiUrl()}/streams/thumbnail/generate`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playbackId: session.playbackId,
        assetId: session.assetId,
      }),
    });
    if (!response.ok) {
      throw 'Error updating session';
    }
    revalidatePath('/studio');
    return (await response.json()).data;
  } catch (e) {
    console.log('error in updateSession', e);
    throw e;
  }
};
export const uploadSessionToYouTube = async ({
  sessionId,
  type,
  organizationId,
  socialId,
  authToken,
}: {
  sessionId: string;
  type: string;
  organizationId: string;
  authToken: string;
  socialId: string;
}): Promise<any> => {
  try {
    const response = await fetch(`${apiUrl()}/sessions/upload`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        type,
        sessionId,
        organizationId,
        socialId,
      }),
    });

    if (!response.ok) {
      return await response.json();
    }

    return (await response.json()).status;
  } catch (e) {
    console.log('error in upload session to social', e);
    throw e;
  }
};

export const sessionImport = async ({
  url,
  type,
  organizationId,
  authToken,
}: {
  url: string;
  type: string;
  organizationId: string;
  authToken: string;
}): Promise<IExtendedScheduleImporter> => {
  try {
    const response = await fetch(`${apiUrl()}/schedule/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        url,
        type,
        organizationId,
      }),
    });

    if (!response.ok) {
      throw 'Error importing session';
    }
    return (await response.json()).data;
  } catch (e) {
    console.log('error in sessionImport', e);
    throw e;
  }
};

export const stageSessionImport = async ({
  url,
  type,
  organizationId,
  authToken,
  stageId,
}: {
  url: string;
  type: string;
  organizationId: string;
  authToken: string;
  stageId: string;
}): Promise<IExtendedScheduleImporter> => {
  try {
    const response = await fetch(`${apiUrl()}/schedule/import/stage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        url,
        type,
        organizationId,
        stageId,
      }),
    });
    if (!response.ok) {
      throw 'Error importing session';
    }
    return (await response.json()).data;
  } catch (e) {
    console.log('error in sessionImport', e);
    throw e;
  }
};

export const saveSessionImport = async ({
  authToken,
  scheduleId,
}: {
  authToken: string;
  scheduleId: string;
}): Promise<string> => {
  try {
    const response = await fetch(`${apiUrl()}/schedule/import/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        scheduleId,
      }),
    });
    if (!response.ok) {
      throw 'Error importing session';
    }
    revalidatePath('/studio');
    return (await response.json()).message;
  } catch (e) {
    console.log('error in sessionImport', e);
    throw e;
  }
};
