import { IExtendedState } from '../types'
import { apiUrl } from '@/lib/utils/utils'

export const fetchStateBySession = async (
  sessionId: string
): Promise<IExtendedState | null> => {
  try {
    const response = await fetch(
      `${apiUrl()}/state?sessionId=${sessionId}`,
      {
        cache: 'no-store',
      }
    )
    if (!response.ok) {
      return null
    }
    const data: IExtendedState = (await response.json()).data

    return data
  } catch (e) {
    console.log(e)
    throw 'Error fetching event session'
  }
}

export const fetchStateByEvent = async ({
  eventId,
}: {
  eventId: string
}): Promise<IExtendedState | null> => {
  try {
    const response = await fetch(
      `${apiUrl()}/state?eventId=${eventId}`,
      {
        cache: 'no-store',
      }
    )
    if (!response.ok) {
      return null
    }
    const data: IExtendedState = (await response.json()).data

    return data
  } catch (e) {
    console.log(e)
    throw 'Error fetching state'
  }
}
