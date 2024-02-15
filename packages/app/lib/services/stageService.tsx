import {
  IStageModel,
  IStage,
} from 'streameth-new-server/src/interfaces/stage.interface'
import { apiUrl } from '@/lib/utils/utils'

export async function fetchStage({
  stage,
}: {
  stage: string
}): Promise<IStageModel | null> {
  try {
    const response = await fetch(`${apiUrl()}/stages/${stage}`)
    const data = (await response.json()).data
    if (!data) {
      return null
    }
    return data
  } catch (e) {
    console.log(e)
    throw 'Error fetching stage'
  }
}

export async function deleteStage({
  stageId,
  organizationId,
  authToken,
}: {
  stageId: string
  organizationId: string
  authToken: string
}): Promise<IStageModel> {
  try {
    const response = await fetch(`${apiUrl()}/stages/${stageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ organizationId }),
    })
    if (!response.ok) {
      throw 'Error deleting stage'
    }
    return await response.json()
  } catch (e) {
    console.log('error in deleteStage', e)
    throw e
  }
}

export async function createStage({
  stage,
  authToken,
}: {
  stage: IStage
  authToken: string
}): Promise<IStage> {
  const response = await fetch(`${apiUrl()}/stages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(stage),
  })
  if (!response.ok) {
    throw 'Error creating stage'
  }
  return (await response.json()).data
}

export async function fetchEventStages({
  eventId,
}: {
  eventId?: string
}): Promise<IStageModel[]> {
  try {
    const response = await fetch(
      `${apiUrl()}/stages/event/${eventId}`,
      {
        cache: 'no-store',
      }
    )

    const data = (await response.json()).data

    return data.map((stage: IStage) => stage)
  } catch (e) {
    console.log(e)
    throw 'Error fetching stages'
  }
}
