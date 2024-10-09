import { apiUrl } from '@/lib/utils/utils';
import { INftCollection } from 'streameth-new-server/src/interfaces/nft.collection.interface';
import { IExtendedNftCollections } from '../types';
import { fetchClient } from './fetch-client';

export async function createNFTCollection({
  nftCollection,
}: {
  nftCollection: INftCollection;
}): Promise<INftCollection> {
  const response = await fetchClient(`${apiUrl()}/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nftCollection),
  });

  if (!response.ok) {
    throw 'Error creating collection';
  }
  return (await response.json()).data;
}

export const updateNFTCollection = async ({
  collection,
}: {
  collection: IExtendedNftCollections;

  collectionId?: string;
}): Promise<IExtendedNftCollections> => {
  const { _id, videos, createdAt, updatedAt, __v, ...rest } = collection;
  try {
    const response = await fetchClient(
      `${apiUrl()}/collections/${collection._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rest),
      }
    );

    if (!response.ok) {
      throw 'Error updating collection';
    }

    return (await response.json()).data;
  } catch (error) {
    console.error('Error updating collection:', error);
    throw error;
  }
};

export async function fetchOrganizationNFTCollections({
  organizationId,
}: {
  organizationId?: string;
}): Promise<IExtendedNftCollections[]> {
  try {
    const response = await fetch(
      `${apiUrl()}/collections/organization/${organizationId}`,
      {
        cache: 'no-store',
      }
    );

    const data = (await response.json()).data;
    return data.map((nftCollection: any) => nftCollection);
  } catch (e) {
    console.log(e);
    throw 'Error fetching collections';
  }
}

export async function fetchNFTCollection({
  collectionId,
}: {
  collectionId?: string;
}): Promise<IExtendedNftCollections | null> {
  try {
    const response = await fetch(`${apiUrl()}/collections/${collectionId}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()).data;
  } catch (e) {
    console.log('error fetching collection', e);
    throw e;
  }
}

export async function generateNFTCollectionMetadata({
  nftCollection,
}: {
  nftCollection: INftCollection;
}): Promise<INftCollection> {
  const response = await fetchClient(
    `${apiUrl()}/collections/metadata/generate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nftCollection),
    }
  );

  if (!response.ok) {
    throw 'Error generating collection metadata';
  }
  return (await response.json()).data;
}
