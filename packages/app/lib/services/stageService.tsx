import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { apiUrl } from '@/lib/utils/utils'

export async function fetchStage({
  stage,
}: {
  stage: string
}): Promise<IStage | null> {
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
  authToken
}: {
  stageId: string
  authToken: string
}): Promise<void> {
  const response = await fetch(`${apiUrl()}/stages/${stageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  })
  if (!response.ok) {
    throw 'Error deleting stage'
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