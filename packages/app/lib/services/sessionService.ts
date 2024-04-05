import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
import { IExtendedSession } from '../types'
import { apiUrl } from '@/lib/utils/utils'
import { Livepeer } from 'livepeer'
import { ISession } from 'streameth-new-server/src/interfaces/session.interface'
import { revalidatePath } from 'next/cache'

export const createSession = async ({
  session,
  authToken,
}: {
  session: ISession
  authToken: string
}): Promise<ISession> => {
  try {
    const response = await fetch(`${apiUrl()}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(session),
    })
    if (!response.ok) {
      console.log(session)
      console.log(`${apiUrl()}/sessions`)
      console.log('error in createSession', await response.json())
      throw 'Error updating session'
    }
    revalidatePath('/studio')
    return (await response.json()).data
  } catch (e) {
    console.log('error in updateSession', e)
    throw e
  }
}
export const fetchSession = async ({
  session,
}: {
  session: string
}): Promise<IExtendedSession | null> => {
  try {
    const LivepeerClient = new Livepeer({
      apiKey: process.env.LIVEPEER_API_KEY,
    })
    const response = await fetch(`${apiUrl()}/sessions/${session}`, {
      cache: 'no-store',
    })
    if (!response.ok) {
      return null
    }
    const data: IExtendedSession = (await response.json()).data
    if (data.assetId) {
      const livepeerData = await LivepeerClient.asset.get(
        data.assetId
      )
      data.videoUrl = livepeerData.asset?.playbackUrl
    }
    return data
  } catch (e) {
    console.log(e)
    throw 'Error fetching event session'
  }
}

export const updateSession = async ({
  session,
  authToken,
}: {
  session: IExtendedSession
  authToken: string
}): Promise<ISessionModel> => {
  const modifiedSession = (({ _id, slug, autoLabels, ...rest }) =>
    rest)(session)

  try {
    const response = await fetch(
      `${apiUrl()}/sessions/${session._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(modifiedSession),
      }
    )
    if (!response.ok) {
      console.log('error in updateSession', await response.json())
      throw 'Error updating session'
    }
    return (await response.json()).data
  } catch (e) {
    console.log('error in updateSession', e)
    throw e
  }
}

export const deleteSession = async ({
  sessionId,
  organizationId,
  authToken,
}: {
  sessionId: string
  organizationId: string
  authToken: string
}) => {
  try {
    const response = await fetch(
      `${apiUrl()}/sessions/${sessionId}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ organizationId }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    )

    if (!response.ok) {
      console.log('error in deleteSession', await response.json())
      throw 'Error deleting session'
    }
    return await response.json()
  } catch (e) {
    console.log('error in deleteSession', e)
    throw e
  }
}
