'use server'
import { Livepeer } from 'livepeer'
import { cookies } from 'next/headers'
import { IExtendedSession } from '../types'
import {
  updateSession,
  createSession,
  deleteSession,
} from '../services/sessionService'
import { ISession } from 'streameth-new-server/src/interfaces/session.interface'
import { revalidatePath } from 'next/cache'

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
})

export const createSessionAction = async ({
  session,
}: {
  session: ISession
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  console.log('session', session)
  const response = await createSession({
    session,
    authToken,
  })
  if (!response) {
    throw new Error('Error creating session')
  }
  return response
}

export const createClip = async ({
  playbackId,
  sessionId,
  start,
  end,
  session,
}: {
  playbackId: string
  sessionId: string
  start: number
  end: number
  session: IExtendedSession
}) => {
  const clip = await livepeer.stream.createClip({
    endTime: end,
    playbackId,
    sessionId,
    startTime: start,
  })
  const updatedSession = {
    ...session,
    assetId: clip.object?.asset.id,
    playbackId: clip.object?.asset.playbackId,
  }

  // TODO
  // @ts-ignore
  delete updatedSession.createdAt
  // @ts-ignore
  delete updatedSession.updatedAt
  // @ts-ignore
  delete updatedSession.__v
  // @ts-ignore

  revalidatePath('/studio')
  await updateSessionAction({ session: updatedSession })
}

export const updateSessionAction = async ({
  session,
}: {
  session: IExtendedSession
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await updateSession({
    session,
    authToken,
  })
  if (!response) {
    throw new Error('Error updating session')
  }
  return response
}

interface IMetrics {
  startViews: number
}
export const getSessionMetrics = async ({
  playbackId,
}: {
  playbackId: string
}): Promise<{
  viewCount: number
  playTimeMins: number
}> => {
  try {
    const metrics = await livepeer.metrics.getPublicTotalViews(
      playbackId
    )
    if (!metrics.object) {
      return {
        viewCount: 0,
        playTimeMins: 0,
      }
    }
    return {
      viewCount: metrics.object?.viewCount,
      playTimeMins: metrics.object?.playtimeMins,
    }
  } catch (error) {
    console.error('Error getting metrics:', error)
    throw error
  }
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
