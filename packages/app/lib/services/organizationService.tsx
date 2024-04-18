import { apiUrl } from '@/lib/utils/utils'
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface'
import { IExtendedOrganization } from '../types'

export async function fetchOrganization({
  organizationSlug,
  organizationId,
}: {
  organizationSlug?: string
  organizationId?: string
}): Promise<IExtendedOrganization | null> {
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
  IExtendedOrganization[]
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

    if (response.ok) {
      return (await response.json()).data
    } else {
      throw await response.json()
    }
  } catch (e) {
    console.error('Unexpected error:', e)
    throw e
  }
}


export async function updateOrganization({
  organization,
  authToken,
}: {
  organization: IExtendedOrganization
  authToken: string
}): Promise<IOrganization> {
  if (!authToken) {
    throw 'No auth token'
  }
  // const modifiedObject = (({ _id, description, ...rest }) => rest)(organization)
  // modifiedObject['organizationId'] = organization._id
  console.log(organization, `${apiUrl()}/organizations/${organization.organizationId}`)
  try {
    const response = await fetch(`${apiUrl()}/organizations/${organization.organizationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(organization),
    })

    if (response.ok) {
      return (await response.json()).data
    } else {
      throw await response.json()
    }
  } catch (e) {
    console.error('Unexpected error:', e)
    throw e
  }
}