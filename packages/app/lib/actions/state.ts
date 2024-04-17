'use server'

import { IState } from 'streameth-new-server/src/interfaces/state.interface'
import { cookies } from 'next/headers'
import { createState } from '../services/stateService'

export const createStateAction = async ({
  state,
}: {
  state: IState
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  console.log('Creating state:', state)
  const response = await createState({
    state,
    authToken,
  })
  if (!response) {
    throw new Error('Error creating state')
  }
  return response
}
