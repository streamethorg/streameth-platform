'use server';
import { Livepeer } from 'livepeer';
import { cookies } from 'next/headers';
import { IExtendedSession } from '../types';
import {
  updateSession,
  createSession,
  deleteSession,
  createClip,
  createAsset,
  generateThumbnail,
  sessionImport,
  stageSessionImport,
  saveSessionImport,
  generateTranscriptions,
  uploadSessionToSocialsRequest,
} from '../services/sessionService';
import {
  ISession,
  SessionType,
} from 'streameth-new-server/src/interfaces/session.interface';
import { revalidatePath } from 'next/cache';

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
    session.assetId as string,
  );
  await updateSessionAction({
    session: {
      ...session,
      ipfsURI: asset.asset?.storage?.ipfs?.nftMetadata?.cid,
    },
  });
};

export const createSessionAction = async ({
  session,
}: {
  session: ISession;
}) => {
  const response = await createSession({
    session,
  });
  if (!response) {
    throw new Error('Error creating session');
  }
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
    events: Array<{ label: string; sessionId: string }>;
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
  revalidatePath('/studio');
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
  revalidatePath(`/studio/${session.organizationId}`);
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
  revalidatePath('/studio');
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
    revalidatePath('/studio');

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
    revalidatePath('/studio');

    return res;
  } catch (e) {
    console.error('Error importing session acton');
    return null;
  }
};

export const stageSessionImportAction = async ({
  url,
  type,
  organizationId,
  stageId,
}: {
  url: string;
  organizationId: string;
  type: string;
  stageId?: string;
}) => {
  if (!stageId) {
    throw new Error('No user session found');
  }

  try {
    const res = await stageSessionImport({
      url,
      organizationId,
      type,

      stageId,
    });
    revalidatePath('/studio');

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
    revalidatePath('/studio');

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
    revalidatePath('/studio');

    return res;
  } catch (e) {
    console.error('Error importing session acton');
    return null;
  }
};
