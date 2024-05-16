'use server'
import {
  createOrganization,
  updateOrganization,
} from '@/lib/services/organizationService'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface'
import { redirect } from 'next/navigation'
import { IExtendedOrganization } from '../types'

export const createOrganizationAction = async ({
  organization,
}: {
  organization: IOrganization
}) => {
  const authToken = cookies().get('user-session')?.value
  const walletAddress = cookies().get('user-address')?.value
  if (!authToken || !walletAddress) {
    throw new Error('No user session or wallet address found')
  }
  const response = await createOrganization({
    organization: {
      ...organization,
      walletAddress: walletAddress,
    },
    authToken,
  })

  if (!response) {
    throw new Error('Error creating organization')
  }
  revalidatePath('/studio')
  return response
}

export const updateOrganizationAction = async ({
  organization,
}: {
  organization: IExtendedOrganization
}) => {
  const authToken = cookies().get('user-session')?.value
  const walletAddress = cookies().get('user-address')?.value
  if (!authToken || !walletAddress) {
    throw new Error('No user session or wallet address found')
  }
  const response = await updateOrganization({
    organization: {
      ...organization,
      walletAddress: walletAddress,
    },
    authToken,
  })

  if (!response) {
    throw new Error('Error updating organization')
  }
  revalidatePath('/studio')
  return response
}
