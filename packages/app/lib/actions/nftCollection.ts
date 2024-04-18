'use server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createNFTCollection } from '../services/nftCollectionService'

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
    throw new Error('Error creating stage')
  }
  revalidatePath('/studio')
  return response
}
