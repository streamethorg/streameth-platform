'use server';
import { Livepeer } from 'livepeer';
import { IExtendedSession } from '../types';
import {
  updateSession,
  createSession,
  deleteSession,
  createClip,
  createAsset,
  generateThumbnail,
  sessionImport,
  saveSessionImport,
  generateTranscriptions,
  uploadSessionToSocialsRequest,
  extractHighlights,
  importVideoFromUrl,
  fetchAllSessions,
} from '../services/sessionService';
import {
  ISession,
  SessionType,
} from 'streameth-new-server/src/interfaces/session.interface';
import { revalidatePath, revalidateTag } from 'next/cache';

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
});

export const updateAssetAction = async (session: IExtendedSession) => {
  const asset = await livepeer.asset.update(
    {
      storage: {
        ipfs: true,
      },
    },
    session.assetId as string
  );
  await updateSessionAction({
    session: {
      ...session,
      ipfsURI: asset.asset?.storage?.ipfs?.nftMetadata?.cid,
    },
  });
};

export const importVideoFromUrlAction = async ({
  name,
  url,
  organizationId,
}: {
  name: string;
  url: string;
  organizationId: string;
}) => {
  const response = await importVideoFromUrl({ name, url, organizationId });
  if (!response) {
    throw new Error('Error importing video');
  }
  return response;
};

export const createSessionAction = async ({
  session,
}: {
  session: ISession;
}) => {
  const response = await createSession({
    session,
  });
  revalidateTag(`sessions-${session.organizationId}`);
  if (!response) {
    throw new Error('Error creating session');
  }
  return response;
};

export const fetchAllSessionsAction = async ({
  stageId,
  type,
}: {
  stageId: string;
  type: SessionType;
}) => {
  const response = await fetchAllSessions({ stageId, type });
  return response;
};

export const createClipAction = async ({
  clipUrl,
  sessionId,
  start,
  end,
  isEditorEnabled,
  editorOptions,
  organizationId,
}: {
  clipUrl: string;
  sessionId: string;
  start: number;
  end: number;
  isEditorEnabled: boolean;
  editorOptions?: {
    frameRate: number;
    events: Array<{ label: string; sessionId?: string; videoUrl?: string }>;
    selectedAspectRatio: string;
    captionEnabled: boolean;
    captionPosition: string;
    captionLinesPerPage: number;
    captionFont: string;
    captionColor: string;
  };
  organizationId: string;
}) => {
  const response = await createClip({
    end,
    clipUrl,
    sessionId,
    start,
    isEditorEnabled,
    editorOptions,
    organizationId,
  });
  if (!response) {
    throw new Error('Error creating clip');
  }
  // revalidateTag(`sessions-${organizationId}`);
  return response;
};

export const updateSessionAction = async ({
  session,
}: {
  session: IExtendedSession | ISession;
}) => {
  const response = await updateSession({
    session: session as IExtendedSession,
  });
  if (!response) {
    throw new Error('Error updating session');
  }
  return response;
};

export const deleteSessionAction = async ({
  organizationId,
  sessionId,
}: {
  organizationId: string;
  sessionId: string;
}) => {
  const response = await deleteSession({
    sessionId,
    organizationId,
  });
  if (!response) {
    throw new Error('Error updating session');
  }
  revalidateTag(`sessions-${organizationId}`);
  return response;
};

export const createAssetAction = async ({ fileName }: { fileName: string }) => {
  try {
    const asset = await createAsset({ fileName });
    if (!asset) {
      return null;
    }

    return asset;
  } catch (e) {
    console.error('Error creating asset');
    return null;
  }
};

export const generateThumbnailAction = async (session: IExtendedSession) => {
  try {
    const res = await generateThumbnail({ session });

    return res;
  } catch (e) {
    console.error('Error generating thumbnail acton');
    return null;
  }
};
export const uploadSessionToSocialsAction = async ({
  sessionId,
  organizationId,
  socialId,
  type,
}: {
  sessionId: string;
  organizationId: string;
  socialId: string;
  type: string;
}) => {
  try {
    const res = await uploadSessionToSocialsRequest({
      sessionId,
      organizationId,
      socialId,
      type,
    });

    return res;
  } catch (e) {
    console.error('Error generating thumbnail acton');
    return null;
  }
};

export const sessionImportAction = async ({
  url,
  type,
  organizationId,
}: {
  url: string;
  organizationId: string;
  type: string;
}) => {
  try {
    const res = await sessionImport({
      url,
      organizationId,
      type,
    });

    return res;
  } catch (e) {
    console.error('Error importing session acton');
    return null;
  }
};

export const saveSessionImportAction = async ({
  scheduleId,
  organizationId,
}: {
  scheduleId: string;
  organizationId: string;
}) => {
  try {
    const res = await saveSessionImport({
      scheduleId,
      organizationId,
    });

    return res;
  } catch (e) {
    console.error('Error importing session acton');
    return null;
  }
};

export const generateTranscriptionActions = async ({
  sessionId,
  organizationId,
}: {
  sessionId: string;
  organizationId: string;
}) => {
  try {
    const res = await generateTranscriptions({
      sessionId,
      organizationId,
    });

    return res;
  } catch (e) {
    console.error('Error importing session acton');
    return null;
  }
};

export const extractHighlightsAction = async ({
  sessionId,
  prompt,
}: {
  sessionId: string;
  prompt: string;
}) => {
  const res = await extractHighlights({ sessionId, prompt });
  return res;
};
