'use server'

import { Livepeer } from 'livepeer'
import { Session } from 'livepeer/dist/models/components'
import { IExtendedSession } from '../types'
import { fetchEvent } from '../services/eventService'

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY,
})

export const getVideoPhaseAction = async (assetId: string) => {
  try {
    const asset = await livepeer.asset.get(assetId)
    if (asset.statusCode !== 200) {
      console.error(asset.rawResponse)
      return null
    }

    return asset.asset?.status?.phase.toString()
  } catch (e) {
    console.error('Error fetching asset: ', assetId)
    return null
  }
}

export const getVideoUrlAction = async (
  assetId?: string,
  playbackId?: string
) => {
  try {
    if (assetId) {
      const asset = await livepeer.asset.get(assetId)
      if (asset.statusCode !== 200) {
        console.error(asset.rawResponse)
      }

      if (asset.asset?.playbackUrl) {
        return asset.asset.playbackUrl
      }
    }

    if (playbackId) {
      return `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${playbackId}/index.m3u8`
    }

    return null
  } catch (e) {
    console.error('Error fetching asset: ', assetId)
    return null
  }
}

interface UrlActionParams {
  assetId: string
  url: string
}

export const getUrlAction = async (
  fileName: string
): Promise<UrlActionParams | null> => {
  try {
    const asset = await livepeer.asset.create({
      name: fileName,
      storage: {
        ipfs: true,
      },
    })

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

export const getStreamRecordings = async ({
  streamId,
}: {
  streamId: string
}) => {
  if (!streamId) {
    return {
      parentStream: null,
      recordings: [],
    }
  }
  const parentStream = (await livepeer.stream.get(streamId)).stream
  const recordings = (
    await livepeer.session.getRecorded(parentStream?.id ?? '')
  ).classes
  if (!recordings) {
    return {
      parentStream,
      recordings: [],
    }
  }
  return {
    parentStream,
    recordings: JSON.parse(JSON.stringify(recordings)) as Session[],
  }
}

export const getAsset = async (assetId: string) => {
  try {
    const asset = await livepeer.asset.get(assetId)
    if (asset.statusCode !== 200) {
      console.error(asset.rawResponse)
      return null
    }

    return JSON.parse(JSON.stringify(asset.asset))
  } catch (e) {
    console.error('Error fetching asset: ', assetId)
    return null
  }
}

export const generateThumbnail = async (
  session: IExtendedSession
) => {
  'use server'
  try {
    if (session.playbackId || session.assetId) {
      let playbackId = session.playbackId
      if (!playbackId) {
        const asset = await livepeer.asset.get(
          session.assetId as string
        )
        if (asset.statusCode === 200) {
          playbackId = asset.asset?.playbackId
        }
      }
      if (playbackId) {
        const asset = await livepeer.playback.get(
          playbackId as string
        )
        if (asset.statusCode === 200) {
          const lpThumbnails =
            asset.playbackInfo?.meta.source.filter(
              (source) => source.hrn === 'Thumbnails'
            ) ?? []
          if (lpThumbnails.length > 0) {
            return lpThumbnails[0].url
          }
        }
      }
    }

    if (session.eventId) {
      const coverResponse = (
        await fetchEvent({ eventId: session.eventId as string })
      )?.eventCover
      if (coverResponse) {
        return coverResponse
      }
    }

    return undefined

    throw new Error('No thumbnail found')
  } catch (e) {
    console.error('Error fetching thumbnail')
    return undefined
  }
}
