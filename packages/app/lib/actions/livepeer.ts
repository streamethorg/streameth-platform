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

export const getVideoUrlAction = async (
  identifier: string | { assetId?: string; playbackId?: string }
): Promise<string | null> => {
  try {
    if (typeof identifier === 'string') {
      // If identifier is a string, treat it as a playbackId
      return `https://lp-playback.com/hls/${identifier}/index.m3u8`;
    }

    // If identifier is an object
    if (identifier.assetId) {
      const asset = await fetchAsset({ assetId: identifier.assetId });
      console.log(asset);
      if (asset?.playbackUrl) {
        return asset.playbackUrl;
      }
    } else if (identifier.playbackId) {
      return `https://lp-playback.com/hls/${identifier.playbackId}/index.m3u8`;
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
