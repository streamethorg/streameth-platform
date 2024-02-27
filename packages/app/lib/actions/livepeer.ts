'use server'

import { Livepeer } from 'livepeer'

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
})

export const getAssetAction = async (assetId: string) => {
  try {
    const asset = await livepeer.asset.get(assetId)
    if (asset.statusCode !== 200) {
      console.error(asset.rawResponse)
      return null
    }

    console.log(asset)
    return asset.asset?.status?.progress
  } catch (e) {
    console.error('Error fetching asset: ', assetId)
    return null
  }
}

interface UrlActionParams {
  assetId?: string
  url: string
}

export const getUrlAction = async (
  fileName: string
): Promise<UrlActionParams | null> => {
  try {
    const asset = await livepeer.asset.create({ name: fileName })

    if (!asset.object) {
      return null
    }

    const params: UrlActionParams = {
      url: asset.object.url,
      assetId: asset.object.asset.id,
    }

    return params
  } catch (error) {
    console.error('Error fetching a Livepeer url:', error)
    return null
  }
}
