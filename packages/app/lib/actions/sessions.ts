'use server'
import { Livepeer, GetPublicTotalViewsMetricsResponse } from 'livepeer'
import { cookies } from 'next/headers'
import { IExtendedSession } from '../types'
import { updateSession } from '../services/sessionService'

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
})

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
const getSessionMetrics = async ({
  playbackId,
}: {
  playbackId: string
}): Promise<GetPublicTotalViewsMetricsResponse> => {
  return await livepeer.metrics.getPublicTotalViews(playbackId)
}
