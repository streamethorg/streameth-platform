'use server';

import {
  createHlsStage,
  createMultistream,
  createSocialLivestreamStage,
  createStage,
  deleteMultistream,
  deleteStage,
  updateStage,
} from '../services/stageService';
import { revalidatePath, revalidateTag } from 'next/cache';
import { IExtendedStage } from '../types';

export const createStageAction = async ({
  stage,
}: {
  stage: IExtendedStage;
}) => {
  try {
    const response = await createStage({
      stage: stage,
    });
    revalidateTag(`stages-${stage.organizationId}`);
    return response;
  } catch (error: any) {
    // If the error is from our API, it will have a message property
    // If not, use a generic error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.message || 'Error creating stage');
  }
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
  revalidateTag(`stages-${organizationId}`);
  return response;
};

export const createMultistreamAction = async (
  prevState: {
    message: string;
    success: boolean;
  },
  formData: FormData
) => {
  const streamId = formData.get('streamId') as string;
  const name = formData.get('name') as string;
  const url = formData.get('url') as string;
  const streamKey = formData.get('streamKey') as string;
  const organizationId = formData.get('organizationId') as string;

  try {
    const response = await createMultistream({
      streamId,
      name,
      targetURL: url,
      targetStreamKey: streamKey,
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
  const response = await deleteMultistream({
    streamId,
    targetId,
    organizationId,
  });
  if (!response) {
    throw new Error('Error deleting stage');
  }
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
  try {
    const response = await createSocialLivestreamStage({
      stageId: stageId,
      socialId: socialId,
      socialType: socialType,
      organizationId: organizationId,
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
