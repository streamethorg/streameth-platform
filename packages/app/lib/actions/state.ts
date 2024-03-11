'use server'

import { cookies } from 'next/headers'
import {
  fetchState,
  createState,
  updateState,
} from '../services/stateService'
import { revalidatePath } from 'next/cache'
import { IState } from 'streameth-new-server/src/interfaces/state.interface'
import { IExtendedState } from '../types'

export const createStateAction = async ({
  state,
}: {
  state: IState
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  const response = await createState({
    state,
    authToken,
  })
  if (!response) {
    throw new Error('Error creating state')
  }
  return response
}

export const updateStateAction = async ({
  state,
}: {
  state: IExtendedState
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await updateState({
    state,
    authToken,
  })
  if (!response) {
    throw new Error('Error updating session')
  }
  return response
}

// export const deleteStateAction = async ({
//   organizationId,
//   sessionId,
// }: {
//   organizationId: string
//   sessionId: string
// }) => {
//   const authToken = cookies().get('user-session')?.value
//   if (!authToken) {
//     throw new Error('No user session found')
//   }
//
//   const response = await deleteState({
//     sessionId,
//     organizationId,
//     authToken,
//   })
//   if (!response) {
//     throw new Error('Error updating session')
//   }
//   revalidatePath('/studio')
//   return response
// }
