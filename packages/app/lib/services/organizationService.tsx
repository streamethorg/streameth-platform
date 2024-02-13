import { apiUrl } from '@/lib/utils/utils'
import {
  IOrganization,
  IOrganizationModel,
} from 'streameth-new-server/src/interfaces/organization.interface'

export async function fetchOrganization({
  organizationSlug,
  organizationId,
}: {
  organizationSlug?: string
  organizationId?: string
}): Promise<IOrganizationModel | null> {
  try {
    if (!organizationSlug && !organizationId) {
      return null
    }
    const response = await fetch(
      `${apiUrl()}/organizations/${
        organizationId ? organizationId : organizationSlug
      }`,
      {
        cache: 'no-store',
      }
    )
    const data = (await response.json()).data

    return data
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function fetchOrganizations(): Promise<
  IOrganizationModel[]
> {
  try {
    const response = await fetch(`${apiUrl()}/organizations`, {
      cache: 'no-store',
    })
    return (await response.json()).data ?? []
  } catch (e) {
    console.log(e)
    throw 'Error fetching organizations'
  }
}

export async function createOrganization({
  organization,
  authToken,
}: {
  organization: IOrganization
  authToken: string
}): Promise<IOrganization> {
  if (!authToken) {
    throw 'No auth token'
  }

  try {
    const response = await fetch(`${apiUrl()}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(organization),
    })
    const a = (await response.json())
    console.log(a)
    return a.data
  } catch (e) {
    console.log(e)
    throw e
  }
}
