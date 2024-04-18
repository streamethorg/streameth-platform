import { apiUrl } from '@/lib/utils/utils'
import { INftCollection } from 'streameth-new-server/src/interfaces/nft.collection.interface'
import { IExtendedNftCollections } from '../types'

export async function createNFTCollection({
  nftCollection,
  authToken,
}: {
  nftCollection: IExtendedNftCollections
  authToken: string
}): Promise<INftCollection> {
  const response = await fetch(`${apiUrl()}/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(nftCollection),
  })

  if (!response.ok) {
    throw 'Error creating stage'
  }
  return (await response.json()).data
}

export async function fetchOrganizationNFTCollections({
  organizationId,
}: {
  organizationId?: string
}): Promise<IExtendedNftCollections[]> {
  try {
    const response = await fetch(
      `${apiUrl()}/collections/organization/${organizationId}`,
      {
        cache: 'no-store',
      }
    )

    const data = (await response.json()).data
    return data.map((nftCollection: any) => nftCollection)
  } catch (e) {
    console.log(e)
    throw 'Error fetching stages'
  }
}

export async function fetchNFTCollection({
  collectionId,
}: {
  collectionId?: string
}): Promise<IExtendedNftCollections | null> {
  try {
    const response = await fetch(
      `${apiUrl()}/collections/${collectionId}`,
      {
        cache: 'no-store',
      }
    )
    if (!response.ok) {
      return null
    }
    return (await response.json()).data
  } catch (e) {
    console.log('error in fetchEvent', e)
    throw e
  }
}
