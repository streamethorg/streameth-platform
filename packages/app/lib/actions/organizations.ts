import { createOrganization } from '@/lib/services/organizationService'
import { cookies } from 'next/headers'
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface'


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

  if (!response) {
    throw new Error('Error creating organization')
  }

  return response
}