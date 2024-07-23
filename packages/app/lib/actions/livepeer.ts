'use server'

import { fetchAsset } from '../services/sessionService'
import { createAssetAction } from './sessions'

export const getVideoPhaseAction = async (assetId: string) => {
  try {
    const asset = await fetchAsset({ assetId })
    if (!asset) {
      return null
    }

    return asset.status?.phase.toString()
  } catch (e) {
    console.error('Error fetching asset: ', assetId)
    return null
  }
}

export const getVideoUrlAction = async (assetId: string) => {
  try {
    const asset = await fetchAsset({ assetId })
    if (asset?.playbackUrl) {
      return asset.playbackUrl
    }

    return null
  } catch (e) {
    console.error('Error fetching asset: ', assetId)
    return null
  }
}

interface UrlActionParams {
  assetId?: string
  tusEndpoint?: string
  url?: string
}

export const getUrlAction = async (
  fileName: string
): Promise<UrlActionParams | null> => {
  try {
    const asset = await createAssetAction({
      fileName,
    })

    if (!asset) {
      return null
    }
    const params: UrlActionParams = {
      tusEndpoint: asset.tusEndpoint,
      url: asset.url,
      assetId: asset.assetId,
    }

    return params
  } catch (error) {
    console.error('Error fetching a Livepeer url:', error)
    return null
  }
}
