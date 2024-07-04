'use server';

import { fetchAsset } from '../services/sessionService';
import { createAssetAction } from './sessions';

export const getVideoPhaseAction = async (assetId: string) => {
  try {
    const asset = await fetchAsset({ assetId });
    if (asset.statusCode !== 200) {
      console.error(asset.rawResponse);
      return null;
    }

    return asset.asset?.status?.phase.toString();
  } catch (e) {
    console.error('Error fetching asset: ', assetId);
    return null;
  }
};

export const getVideoUrlAction = async (
  assetId?: string,
  playbackId?: string
) => {
  try {
    if (assetId) {
      const asset = await fetchAsset({ assetId });
      if (asset.statusCode !== 200) {
        console.error(asset.rawResponse);
      }

      if (asset.asset?.playbackUrl) {
        return asset.asset.playbackUrl;
      }
    }

    if (playbackId) {
      return `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${playbackId}/index.m3u8`;
    }

    return null;
  } catch (e) {
    console.error('Error fetching asset: ', assetId);
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
