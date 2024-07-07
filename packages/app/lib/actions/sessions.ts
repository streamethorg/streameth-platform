'use server'
import { Livepeer } from 'livepeer'
import { cookies } from 'next/headers'
import { IExtendedSession } from '../types'
import {
  updateSession,
  createSession,
  deleteSession,
  createClip,
  createAsset,
  generateThumbnail,
  uploadSessionToYouTube,
} from '../services/sessionService'
import {
  ISession,
  SessionType,
} from 'streameth-new-server/src/interfaces/session.interface'
import { revalidatePath } from 'next/cache'

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
})

export const updateAssetAction = async (
  session: IExtendedSession
) => {
  const asset = await livepeer.asset.update(
    session.assetId as string,
    {
      storage: {
        ipfs: true,
      },
    }
  )
  await updateSessionAction({
    session: {
      ...session,
      ipfsURI: asset.asset?.storage?.ipfs?.nftMetadata?.cid,
    },
  })
}

export const createSessionAction = async ({
  session,
}: {
  session: ISession
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await createSession({
    session,
    authToken,
  })
  if (!response) {
    throw new Error('Error creating session')
  }
  return response
}

export const createClipAction = async ({
  playbackId,
  sessionId,
  start,
  end,
  recordingId,
}: {
  playbackId: string
  sessionId: string
  start: number
  end: number
  recordingId: string
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await createClip({
    end,
    playbackId,
    sessionId,
    start,
    authToken,
    recordingId,
  })
  if (!response) {
    throw new Error('Error creating session')
  }
  revalidatePath('/studio')
  return response
}

export const updateSessionAction = async ({
  session,
}: {
  session: IExtendedSession | ISession
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await updateSession({
    session: session as IExtendedSession,
    authToken,
  })
  if (!response) {
    throw new Error('Error updating session')
  }
  revalidatePath(`/studio/${session.organizationId}`)
  return response
}

export const deleteSessionAction = async ({
  organizationId,
  sessionId,
}: {
  organizationId: string
  sessionId: string
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await deleteSession({
    sessionId,
    organizationId,
    authToken,
  })
  if (!response) {
    throw new Error('Error updating session')
  }
  revalidatePath('/studio')
  return response
}

export const createAssetAction = async ({
  fileName,
}: {
  fileName: string
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  try {
    const asset = await createAsset({ fileName, authToken })
    if (!asset) {
      return null
    }

    return asset
  } catch (e) {
    console.error('Error creating asset')
    return null
  }
}

export const generateThumbnailAction = async (
  session: IExtendedSession
) => {
  try {
    const res = await generateThumbnail({ session })

    return res
  } catch (e) {
    console.error('Error generating thumbnail acton')
    return null
  }
}
export const uploadSessionToYouTubeAction = async ({
  sessionId,
  organizationId,
  socialId,
  type,
}: {
  sessionId: string
  organizationId: string
  socialId: string
  type: string
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  try {
    const res = await uploadSessionToYouTube({
      sessionId,
      organizationId,
      socialId,
      type,
      authToken,
    })
    revalidatePath('/studio')

    return res
  } catch (e) {
    console.error('Error generating thumbnail acton')
    return null
  }
}
