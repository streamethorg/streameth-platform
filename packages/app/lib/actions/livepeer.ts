'use server';

import { fetchAsset } from '../services/sessionService';
import { createAssetAction } from './sessions';

export const getVideoPhaseAction = async (assetId: string) => {
  try {
    const asset = await fetchAsset({ assetId });
    if (!asset) {
      return null;
    }

    return asset.status?.phase.toString();
  } catch (e) {
    console.error('Error fetching asset: ', assetId);
    return null;
  }
};

/**
 * Retrieves the video URL for a given identifier, supporting both playbackId and assetId.
 * This function makes all videos playable, including older ones that don't have an assetId.
 *
 * @param {string} identifier - The unique identifier for the video. This can be either a playbackId or an assetId.
 * @param {'assetId' | 'playbackId'} type - Specifies whether the identifier is an 'assetId' or a 'playbackId'.
 * @returns {Promise<string | null>} A promise that resolves to the video URL if successful, or null if unsuccessful.
 *
 * @example
 * // Using with a playbackId
 * const videoUrl = await getVideoUrlAction(session.playbackId, 'playbackId');
 *
 * @example
 * // Using with an assetId
 * const videoUrl = await getVideoUrlAction(session.assetId!, 'assetId');
 *
 * @throws {Error} If there's an issue fetching the asset or building the URL.
 */
export const getVideoUrlAction = async (
  identifier: string,
  type: 'assetId' | 'playbackId'
): Promise<string | null> => {
  try {
    if (type === 'playbackId') {
      // If type is playbackId, simply build the full URL
      return `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${identifier}/index.m3u8`;
    } else if (type === 'assetId') {
      // If type is assetId, use the fetch call to retrieve the videoUrl directly
      const asset = await fetchAsset({ assetId: identifier });
      console.log(asset);
      if (asset?.playbackUrl) {
        return asset.playbackUrl;
      }
    }

    return null;
  } catch (e) {
    console.error('Error fetching asset or building URL:', identifier);
    return null;
  }
};

interface UrlActionParams {
  assetId?: string;
  tusEndpoint?: string;
  url?: string;
}

export const getUrlAction = async (
  fileName: string
): Promise<UrlActionParams | null> => {
  try {
    const asset = await createAssetAction({
      fileName,
    });

    if (!asset) {
      return null;
    }
    const params: UrlActionParams = {
      tusEndpoint: asset.tusEndpoint,
      url: asset.url,
      assetId: asset.assetId,
    };

    return params;
  } catch (error) {
    console.error('Error fetching a Livepeer url:', error);
    return null;
  }
};
