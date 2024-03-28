'use server'
import { Livepeer } from 'livepeer'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { createStage, deleteStage } from '../services/stageService'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Stream } from 'livepeer/dist/models/components'

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
          record: true,
        }),
      }
    )

    const data = await response.json()
    if (stage.streamSettings?.streamId) {
      stage.streamSettings.streamId = data.id
    }
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
  revalidatePath('/studio')
  return response
}

export const deleteStageAction = async ({
  stageId,
  organizationId,
  streamId,
}: {
  stageId: string
  organizationId: string
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
  const response = await deleteStage({
    stageId,
    organizationId,
    authToken,
  })
  if (!response) {
    throw new Error('Error deleting stage')
  }
  revalidatePath('/studio')
  return response
}

export const getStageStream = async (
  streamId: string
): Promise<Stream | null> => {
  try {
    const stream = await livepeer.stream.get(streamId)
    if (!stream.stream) {
      return null
    }
    return stream.stream
  } catch (error) {
    console.error('Error getting stream:', error)
    return null
  }
}

export const createMultistream = async (
  prevState: {
    message: string
    success: boolean
  },
  formData: FormData
) => {
  'use server'
  const streamId = formData.get('streamId') as string
  const name = formData.get('name') as string
  const url = formData.get('url') as string
  const profile = formData.get('profile') as string
  const streamKey = formData.get('streamKey') as string

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })
  try {
    const response = await livepeer.stream.createMultistreamTarget(
      streamId,
      {
        spec: {
          name,
          url: url + '/' + streamKey,
        },
        profile: 'source',
      }
    )
    if (response.statusCode !== 200) {
      return {
        message: 'Error creating multistream target',
        success: false,
      }
    }
    revalidatePath('/studio')

    return { message: 'Multistream target created', success: true }
  } catch (error) {
    console.error(error)
    return { message: 'Error creating multistream:', success: false }
  }
}

export const deleteMultistreamTarget = async (
  streamId: string,
  targetId: string
) => {
  'use server'
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const response = await livepeer.stream.deleteMultistreamTarget(
    streamId,
    targetId
  )
  if (response.statusCode !== 200) {
    console.error('Error deleting multistream target')
    return null
  }
  revalidatePath('/studio')

  return response.rawResponse?.statusText
}

export const getMultistreamTarget = async ({
  targetId,
}: {
  targetId: string
}) => {
  'use server'
  const response = await livepeer.multistreamTarget.get(targetId)
  if (response.statusCode !== 200) {
    console.error('Error getting multistream target')
    return null
  }
  revalidatePath('/studio')

  return response.multistreamTarget
}
