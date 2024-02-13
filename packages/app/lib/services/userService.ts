import { apiUrl } from '../utils/utils'
import { IExtendedUser } from '../types'

export async function fetchUserData({
  userId,
  authToken,
}: {
  userId?: string
  authToken?: string
}): Promise<IExtendedUser | null> {
  try {
    const data = await fetch(`${apiUrl()}/users/${userId}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!data.ok) {
      return null
    }
    return (await data.json()).data
  } catch (e) {
    console.log('error in fetchUser', e)
    throw e
  }
}
