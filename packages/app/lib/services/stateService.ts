import { StateType } from 'streameth-new-server/src/interfaces/state.interface'
import { IExtendedState } from '../types'
import { apiUrl } from '@/lib/utils/utils'
import { IState } from 'streameth-new-server/src/interfaces/state.interface'

export const fetchState = async ({
  type,
  sessionId,
}: {
  type: StateType
  sessionId: string
}) => {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('type', type)
    queryParams.append('sessionId', sessionId)

    const response = await fetch(
      `${apiUrl()}/states/session?${queryParams}`,
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

export const updateState = async ({
  state,
  authToken,
}: {
  state: IExtendedState
  authToken: string
}) => {
  try {
    const response = await fetch(
      `${apiUrl()}/states/${state._id?.toString()}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        cache: 'no-store',
        body: JSON.stringify(state),
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

export const createState = async ({
  state,
  authToken,
}: {
  state: IState
  authToken: string
}) => {
  try {
    const response = await fetch(`${apiUrl()}/states`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(state),
    })
    if (!response.ok) {
      console.log(state)
      console.log(`${apiUrl()}/states`)
      console.log('error in createState', await response.json())
      throw 'Error creating state'
    }

    return (await response.json()).data
  } catch (e) {
    console.log(e)
    throw 'Error creating state'
  }
}
