'use server'
import { Livepeer } from 'livepeer'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { createStage, deleteStage } from '../services/stageService'
import { cookies } from 'next/headers'

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
})

export const createStageAction = async ({
  stage,
}: {
  stage: IStage
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  try {
    // post to https://livepeer.studio/api/stream
    const response = await fetch(
      'https://livepeer.studio/api/stream',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
        },
        body: JSON.stringify({
          name: stage.name,
          record: true
        }),
      }
    )

    const data = await response.json()
    stage.streamSettings.streamId = data.id
  } catch (error) {
    console.error('Error creating stream:', error)
    throw new Error('Error creating stream')
  }
  const response = await createStage({
    stage: stage,
    authToken,
  })

  if (!response) {
    throw new Error('Error creating stage')
  }

  return response
}

export const deleteStageAction = async ({
  stageId,
  streamId,
}: {
  stageId: string
  streamId?: string
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  if (streamId) {
    try {
      await livepeer.stream.delete(streamId)
    } catch (error) {
      console.error('Error deleting stream:', error)
    }
  }
  await deleteStage({ stageId, authToken })
}
