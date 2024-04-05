import {
  IStageModel,
  IStage,
} from 'streameth-new-server/src/interfaces/stage.interface'
import { apiUrl } from '@/lib/utils/utils'
import { IExtendedStage } from '../types'
import { fetchEvents } from './eventService'

export async function fetchStage({
  stage,
}: {
  stage: string
}): Promise<IExtendedStage | null> {
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

export async function fetchStages({
  organizationId,
}: {
  organizationId: string
}): Promise<IStageModel[]> {
  try {
    const events = await fetchEvents({ organizationId })
    const stages: IStageModel[] = []
    for (const event of events) {
      const response = await fetchEventStages({ eventId: event._id })
      response.forEach((stage) => {
        stages.push(stage)
      })
    }
    return stages
  } catch (e) {
    console.log(e)
    throw 'Error fetching stages'
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
  stage: IExtendedStage
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

export async function fetchOrganizationStages({
  organizationId,
}: {
  organizationId?: string
}): Promise<IExtendedStage[]> {
  try {
    const response = await fetch(
      `${apiUrl()}/stages/organization/${organizationId}`,
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

export const updateStage = async ({
  stage,
  authToken,
}: {
  stage: IExtendedStage
  authToken: string
}): Promise<IExtendedStage> => {
  const { _id, createdAt, updatedAt, __v, ...rest } = stage

  try {
    const response = await fetch(`${apiUrl()}/stages/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(rest),
    })

    if (!response.ok) {
      throw new Error('Error updating stage')
    }

    const responseData = await response.json()
    const updatedStage: IExtendedStage = responseData.data
    return updatedStage
  } catch (error) {
    console.error('Error updating stage:', error)
    throw error
  }
}
