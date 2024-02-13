"use server"
import { createOrganization } from '@/lib/services/organizationService'
import { cookies } from 'next/headers'
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const createOrganizationAction = async ({
  organization,
}: {
  organization: IOrganization
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }
  const response = await createOrganization({
    organization: organization,
    authToken,
  })
  console.log(response)

  if (!response) {
    throw new Error('Error creating organization')
  }
  revalidatePath('/studio')
  return response
}