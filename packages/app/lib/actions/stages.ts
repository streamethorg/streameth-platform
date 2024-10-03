'use server';

import {
  createHlsStage,
  createMultistream,
  createSocialLivestreamStage,
  createStage,
  deleteMultistream,
  deleteStage,
  getHlsUrl,
  updateStage,
} from '../services/stageService';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { IExtendedStage } from '../types';
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface';

export const createStageAction = async ({
  stage,
}: {
  stage: IExtendedStage;
}) => {
  const response = await createStage({
    stage: stage,
  });

  if (!response) {
    throw new Error('Error creating stage');
  }
  revalidatePath('/studio');
  return response;
};

export const deleteStageAction = async ({
  stageId,
  organizationId,
}: {
  stageId: string;
  organizationId: string;
}) => {
  const response = await deleteStage({
    stageId,
    organizationId,
  });
  if (!response) {
    throw new Error('Error deleting stage');
  }
  revalidatePath('/studio');
  return response;
};

export const createMultistreamAction = async (
  prevState: {
    message: string;
    success: boolean;
  },
  formData: FormData
) => {
  'use server';
  const streamId = formData.get('streamId') as string;
  const name = formData.get('name') as string;
  const url = formData.get('url') as string;
  const streamKey = formData.get('streamKey') as string;
  const organizationId = formData.get('organizationId') as string;

  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }
  try {
    const response = await createMultistream({
      streamId,
      name,
      targetURL: url,
      targetStreamKey: streamKey,
      authToken,
      organizationId,
    });
    revalidatePath('/studio');
    if (!response) {
      throw new Error('Error creating multistream');
    }
    return { message: response.message, success: true };
  } catch (error) {
    console.error(error);
    return { message: 'Error creating multistream', success: false };
  }
};

export const deleteMultistreamAction = async (
  streamId: string,
  organizationId: string,
  targetId: string
) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }
  const response = await deleteMultistream({
    streamId,
    targetId,
    organizationId,
    authToken,
  });
  if (!response) {
    throw new Error('Error deleting stage');
  }
  revalidatePath('/studio');

  return response;
};

export const updateStageAction = async ({
  stage,
}: {
  stage: IExtendedStage;
}) => {
  const response = await updateStage({
    stage: { ...stage },
  });
  if (!response) {
    throw new Error('Error updating stage');
  }
  revalidatePath('/studio');
  return response;
};

export const createSocialLivestreamStageAction = async ({
  stageId,
  socialId,
  socialType,
  organizationId,
}: {
  stageId: string;
  socialId: string;
  socialType: string;
  organizationId: string;
}) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }
  try {
    const response = await createSocialLivestreamStage({
      stageId: stageId,
      socialId: socialId,
      socialType: socialType,
      organizationId: organizationId,
      authToken,
    });

    if (!response) {
      throw new Error('Error creating stage livestream social');
    }
    revalidatePath('/studio');
    return response;
  } catch (error: any) {
    return {
      error: error,
    };
  }
};

export const getHlsUrlAction = async ({ url }: { url: string }) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }

  const response = await getHlsUrl({
    url,
    authToken,
  });
  if (!response) {
    throw new Error('Error getting HLS URL');
  }
  revalidatePath('/studio');
  return response;
};

export const createHlsStageAction = async ({
  hlsStage,
}: {
  hlsStage: IStage;
}) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }
  const response = await createHlsStage({
    hlsStage,
    authToken,
  });
  if (!response) {
    throw new Error('Error creating HLS stage');
  }
  revalidatePath('/studio');
  return response;
};
