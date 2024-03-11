import { IExtendedState } from '../types'
import { apiUrl } from '@/lib/utils/utils'

export const fetchState = async (
  eventId?: string,
  sessionId?: string,
  eventSlug?: string
) => {
  try {
    const queryParams = new URLSearchParams()
    if (eventId) queryParams.append('eventId', eventId)
    if (sessionId) queryParams.append('sessionId', sessionId)
    if (eventSlug) queryParams.append('eventSlug', eventSlug)

    const response = await fetch(
      `${apiUrl()}/states?${queryParams}`,
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
