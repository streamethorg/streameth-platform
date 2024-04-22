'use server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  createNFTCollection,
  updateNFTCollection,
} from '../services/nftCollectionService'
import { IExtendedNftCollections } from '../types'

export const createNFTCollectionAction = async ({
  nftCollection,
}: {
  nftCollection: any
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await createNFTCollection({
    nftCollection: nftCollection,
    authToken,
  })

  if (!response) {
    throw new Error('Error creating NFt Collection')
  }
  revalidatePath('/studio')

  return response
}

export const updateNFTCollectionAction = async ({
  collection,
}: {
  collection: IExtendedNftCollections
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await updateNFTCollection({
    collection: { ...collection },
    authToken,
  })
  if (!response) {
    throw new Error('Error updating collection')
  }
  revalidatePath('/studio')
  return response
}
