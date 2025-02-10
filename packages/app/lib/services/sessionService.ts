import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface';
import {
  IExtendedScheduleImporter,
  IExtendedSession,
  IPagination,
  IHighlight,
} from '../types';
import { apiUrl } from '@/lib/utils/utils';
import { ISession } from 'streameth-new-server/src/interfaces/session.interface';
import { revalidatePath } from 'next/cache';
import { Asset } from 'livepeer/models/components/asset';
import { fetchClient } from './fetch-client';

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
  const response = await fetch(
    constructApiUrl(`${apiUrl()}/sessions`, params),
    {
      cache: 'no-store',
    }
  );
  const a = await response.json();
  return a.data;
}
export const createSession = async ({
  session,
}: {
  session: ISession;
}): Promise<IExtendedSession> => {
  try {
    const response = await fetchClient(`${apiUrl()}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      throw 'Error creating session';
    }
    revalidatePath('/studio');
    return (await response.json()).data;
  } catch (e) {
    console.log('error in createSession', e);
    throw e;
  }
};

export const fetchSession = async ({
  session,
}: {
  session: string;
}): Promise<IExtendedSession | null> => {
  try {
    const response = await fetch(`${apiUrl()}/sessions/${session}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    const data: IExtendedSession = (await response.json()).data;
    return data;
  } catch (e) {
    console.log(e);
    throw 'Error fetching event session';
  }
};

export const updateSession = async ({
  session,
}: {
  session: IExtendedSession;
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
    const response = await fetchClient(`${apiUrl()}/sessions/${session._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedSession),
    });
    if (!response.ok) {
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
}: {
  sessionId: string;
  organizationId: string;
}) => {
  try {
    const response = await fetchClient(`${apiUrl()}/sessions/${sessionId}`, {
      method: 'DELETE',
      body: JSON.stringify({ organizationId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
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
  clipUrl,
  sessionId,
  isEditorEnabled,
  editorOptions,
  organizationId,
}: {
  sessionId: string;
  clipUrl: string;
  start: number;
  end: number;
  isEditorEnabled: boolean;
  editorOptions?: {
    frameRate: number;
    events: Array<{
      label: string;
      sessionId?: string;
      videoUrl?: string;
    }>;
    selectedAspectRatio: string;
    captionEnabled: boolean;
    captionPosition: string;
    captionLinesPerPage: number;
    captionFont: string;
    captionColor: string;
  };
  organizationId?: string;
}): Promise<ISession> => {
  try {
    const response = await fetchClient(`${apiUrl()}/streams/clip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        end,
        clipUrl,
        sessionId,
        start,
        isEditorEnabled,
        editorOptions,
        organizationId,
      }),
    });
    console.log('response', {
      end,
      clipUrl,
      sessionId,
      start,
      isEditorEnabled,
      editorOptions,
      organizationId,
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw responseData.message;
    }

    revalidatePath('/studio');
    return responseData;
  } catch (e) {
    console.error('Error in createClip:', {
      error: e,
      message: e instanceof Error ? e.message : 'Unknown error',
      data: {
        clipUrl,
        sessionId,
        start,
        end,
      },
    });

    if (e instanceof Error) {
      throw new Error(`Failed to create clip: ${e.message}`);
    }
    throw new Error('Failed to create clip: Unknown error occurred');
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

export const fetchSessionRenderingProgress = async ({
  sessionId,
}: {
  sessionId: string;
}): Promise<{ type: 'progress' | 'done'; progress: number }> => {
  const response = await fetch(`${apiUrl()}/sessions/${sessionId}/progress`, {
    cache: 'no-store',
  });
  if (response.status !== 200) {
    throw new Error('Error fetching session rendering progress');
  }
  return (await response.json()).data;
};

export const fetchAsset = async ({
  assetId,
}: {
  assetId: string;
}): Promise<Asset | null> => {
  try {
    const response = await fetch(`${apiUrl()}/streams/asset/${assetId}`, {
      next: { revalidate: 100 },
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
}: {
  fileName: string;
}): Promise<any> => {
  try {
    const response = await fetchClient(`${apiUrl()}/streams/asset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    });

    if (!response.ok) {
      throw 'Error creating asset';
    }
    revalidatePath('/studio');
    return (await response.json()).data;
  } catch (e) {
    console.log('error in createAsset', e);
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
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playbackId: session.playbackId,
        assetId: session.assetId,
      }),
    });
    if (!response.ok) {
      throw 'Error generating thumbnail';
    }
    revalidatePath('/studio');
    return (await response.json()).data;
  } catch (e) {
    throw e;
  }
};
export const uploadSessionToSocialsRequest = async ({
  sessionId,
  type,
  organizationId,
  socialId,
}: {
  sessionId: string;
  type: string;
  organizationId: string;
  socialId: string;
}): Promise<any> => {
  try {
    const response = await fetchClient(`${apiUrl()}/sessions/upload`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
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
}: {
  url: string;
  type: string;
  organizationId: string;
}): Promise<IExtendedScheduleImporter> => {
  try {
    const response = await fetchClient(`${apiUrl()}/schedule/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  stageId,
}: {
  url: string;
  type: string;
  organizationId: string;
  stageId: string;
}): Promise<IExtendedScheduleImporter> => {
  try {
    const response = await fetchClient(`${apiUrl()}/schedule/import/stage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  scheduleId,
  organizationId,
}: {
  scheduleId: string;
  organizationId: string;
}): Promise<string> => {
  try {
    const response = await fetchClient(`${apiUrl()}/schedule/import/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleId,
        organizationId,
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

export const generateTranscriptions = async ({
  sessionId,
  organizationId,
}: {
  sessionId: string;
  organizationId: string;
}): Promise<string> => {
  try {
    const response = await fetchClient(`${apiUrl()}/sessions/transcriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        organizationId,
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

export const extractHighlights = async ({
  sessionId,
  prompt,
}: {
  sessionId: string;
  prompt: string;
}): Promise<IHighlight[]> => {
  try {
    const response = await fetchClient(
      `${apiUrl()}/sessions/${sessionId}/highlights`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      }
    );
    if (!response.ok) {
      throw 'Error extracting highlights';
    }
    const data = (await response.json()).message;
    return data;
  } catch (e) {
    console.log('error in extractHighlights', e);
    throw e;
  }
};
