import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { apiUrl } from '@/lib/utils/utils'
import { IExtendedStage } from '../types'
import { fetchEvents } from './eventService'
import { Stream } from 'livepeer/dist/models/components'

export async function fetchStage({
  stage,
}: {
  stage: string
}): Promise<IExtendedStage | null> {
  try {
    const response = await fetch(`${apiUrl()}/stages/${stage}`, {
      cache: 'no-cache',
    })
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
}): Promise<IExtendedStage[]> {
  try {
    const stages = await fetch(
      `${apiUrl()}/stages/organization/${organizationId}`,
      {
        cache: 'no-cache',
      }
    )
    const data = (await stages.json()).data
    return data.map((stage: IStage) => stage)
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
}): Promise<IExtendedStage> {
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
}): Promise<IExtendedStage[]> {
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
    return (await response.json()).data
  } catch (error) {
    console.error('Error updating stage:', error)
    throw error
  }
}

export async function createMultistream({
  name,
  streamId,
  targetURL,
  targetStreamKey,
  authToken,
  organizationId,
}: {
  name: string
  streamId: string
  targetStreamKey: string
  targetURL: string
  authToken: string
  organizationId?: string
}): Promise<{ message: string; status: string }> {
  const response = await fetch(`${apiUrl()}/streams/multistream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      name,
      streamId,
      targetURL,
      targetStreamKey,
      organizationId,
    }),
  })

  if (!response.ok) {
    throw 'Error creating multistream'
  }

  return await response.json()
}

export async function deleteMultistream({
  streamId,
  targetId,
  authToken,
  organizationId,
}: {
  streamId: string
  targetId: string
  authToken: string
  organizationId?: string
}): Promise<IExtendedStage> {
  try {
    const response = await fetch(`${apiUrl()}/streams/multistream`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ streamId, targetId, organizationId }),
    })
    if (!response.ok) {
      throw 'Error deleting multistream'
    }
    return await response.json()
  } catch (e) {
    console.log('error in deleteMultistream', e)
    throw e
  }
}

export async function fetchStageRecordings({
  streamId,
}: {
  streamId: string
}): Promise<any> {
  try {
    const response = await fetch(
      `${apiUrl()}/streams/recording/${streamId}`,
      {
        cache: 'no-cache',
      }
    )
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
