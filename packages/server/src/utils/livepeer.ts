import { config } from '@config';
import { HttpException } from '@exceptions/HttpException';
import type { IMultiStream } from '@interfaces/stream.interface';
import Organization from '@models/organization.model';
import Stage from '@models/stage.model';
import { Livepeer } from 'livepeer';
import { LivepeerSDKResponse, LivepeerRecording } from '@interfaces/livepeer.interface';
import fetch from 'node-fetch';
import youtubedl from 'youtube-dl-exec';
import { refreshAccessToken } from './oauth';
import { fetchAndParseVTT, getSourceType } from './util';
import { deleteYoutubeLiveStream } from './youtube';
import { IStreamSettings } from '@interfaces/stage.interface';
import { Asset, Session } from 'livepeer/models/components';

// Define the youtube-dl output type since this is specific to the youtube-dl library
interface YoutubeDLOutput {
  formats: Array<{
    protocol: string;
    ext: string;
    resolution: string;
    manifest_url: string;
  }>;
}
const { host, secretKey } = config.livepeer;
const livepeer = new Livepeer({
  apiKey: secretKey,
});

export const createStream = async (
  name: string,
): Promise<{
  streamId: string;
  streamKey: string;
  parentId: string;
  playbackId: string;
}> => {
  try {
    const response = await fetch(`${host}/api/stream`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        name: name,
        record: true,
      }),
    });
    const data = await response.json();
    console.log('data', data);
    return {
      streamId: data.id,
      streamKey: data.streamKey,
      parentId: data.parentId,
      playbackId: data.playbackId,
    };
  } catch (e) {
    throw new HttpException(400, 'Service unavailable');
  }
};

export const deleteStream = async (streamId: string): Promise<void> => {
  try {
    await fetch(`${host}/api/stream/${streamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
    });
  } catch (e) {
    throw new HttpException(400, 'Service unavailable');
  }
};

export const getStreamInfo = async (streamId: string): Promise<IStreamSettings> => {
  try {
    const response = await fetch(`${host}/api/stream/${streamId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (e) {
    throw new HttpException(400, 'Error fetching livestream');
  }
};

export const createAsset = async (
  fileName: string,
): Promise<{ url: string; assetId: string; tusEndpoint: string }> => {
  try {
    const response = await fetch(`${host}/api/asset/request-upload`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        name: fileName,
        storage: {
          ipfs: true,
        },
      }),
    });
    const data = await response.json();

    return {
      tusEndpoint: data.tusEndpoint,
      url: data.url,
      assetId: data.asset.id,
    };
  } catch (e) {
    throw new HttpException(400, 'Error fetching a Livepeer url');
  }
};

export const createAssetFromUrl = async (
  fileName: string,
  url: string,
): Promise<string> => {
  try {
    const response = await fetch(`${host}/api/asset/upload/url`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        name: `${fileName}.mp4`,
        url: url,
      }),
    });
    if (response.status !== 201 && response.status !== 200)
      throw new Error('Error creating asset');
    const data = await response.json();
    return data.asset.id;
  } catch (e) {
    throw new HttpException(400, 'Error creating asset');
  }
};

export const getPlayback = async (assetId: string): Promise<string> => {
  try {
    const response = await fetch(`${host}/api/asset/${assetId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
    });
    const data = await response.json();
    if (!data.playbackUrl) {
      return '';
    }

    return data.playbackUrl;
  } catch (e) {
    console.error(`Error fetching asset:`, e);
  }
};

export const getDownloadUrl = async (assetId: string): Promise<string> => {
  try {
    const response = await fetch(`${host}/api/asset/${assetId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
    });
    const data = await response.json();
    if (!data.downloadUrl) {
      return '';
    }
    return data.downloadUrl;
  } catch (e) {
    console.error(`Error fetching asset:`, e);
  }
};

export const getAsset = async (assetId: string): Promise<Asset> => {
  try {
    const response = await fetch(`${host}/api/asset/${assetId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
    });
    const data = await response.json();
    if (!data) {
      return null;
    }
    return data;
  } catch (e) {
    console.error(`Error fetching asset:`, e);
  }
};

export const uploadToIpfs = async (assetId: string) => {
  try {
    const response = await fetch(`${host}/api/asset/${assetId}`, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        storage: {
          ipfs: true,
        },
      }),
    });
    await response.json();
    await sleep(20000);
    const asset = await getAsset(assetId);
    return asset.storage.ipfs.nftMetadata?.cid;
  } catch (e) {
    console.error(`Error updating asset:`, e);
  }
};

export const getVideoPhaseAction = async (
  assetId: string,
): Promise<{ playbackUrl: string; phaseStatus: string }> => {
  try {
    const response = await fetch(`${host}/api/asset/${assetId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
    });
    const data = await response.json();
    if (!data.playbackUrl) {
      return {
        playbackUrl: '',
        phaseStatus: '',
      };
    }

    return {
      playbackUrl: data.playbackUrl ?? '',
      phaseStatus: data.status.phase ?? '',
    };
  } catch (e) {
    console.error(`Error fetching asset:`, e);
  }
};

export const getStreamRecordings = async (streamId: string): Promise<LivepeerRecording[]> => {
  try {
    const parentStream = await getStreamInfo(streamId);
    // @ts-ignore
    if (!parentStream.id) {
      return [];
    }
    // TODO: wrong types provided by livepeer
    // @ts-ignore
    const response = await livepeer.session.getRecorded(parentStream.id);
    console.log('response', response);
    const recordings = response.data;
    if (!recordings) {
      return [];
    }
    return recordings;
  } catch (e) {
    console.error(`Error fetching recordings:`, e);
    return [];
  }
};

export const createMultiStream = async (data: IMultiStream): Promise<void> => {
  try {
    // Ensure URL starts with rtmp:// or rtmps://
    const targetUrl = data.targetURL.startsWith('rtmp://') || data.targetURL.startsWith('rtmps://') || data.targetURL.startsWith('srt://')
      ? `${data.targetURL}/${data.targetStreamKey}`
      : `rtmp://${data.targetURL}/${data.targetStreamKey}`;

    console.log('Creating multistream target with data:', {
      url: targetUrl,
      name: data.name,
    });

    const targetResult = await livepeer.multistream.create({
      url: targetUrl,
      name: data.name,
    }) as unknown as LivepeerSDKResponse;

    // Log the full response structure
    console.log('Full target result:', JSON.stringify(targetResult, null, 2));

    if (!targetResult.multistreamTarget) {
      throw new Error('Failed to create multistream target');
    }

    // Then add the target to the stream using the SDK method
    console.log('Adding target to stream with data:', {
      profile: 'source',
      videoOnly: false,
      id: targetResult.multistreamTarget.id,
      streamId: data.streamId,
    });

    const addResult = await livepeer.stream.addMultistreamTarget({
      profile: 'source',
      videoOnly: false,
      id: targetResult.multistreamTarget.id,
    }, data.streamId) as unknown as LivepeerSDKResponse;

    // Log the full add result structure
    console.log('Full add result:', JSON.stringify(addResult, null, 2));

    if (addResult.error && Object.keys(addResult.error).length > 0) {
      throw new Error('Failed to add multistream target to stream');
    }

    const stage = await Stage.findOne({
      'streamSettings.streamId': data.streamId,
    });
    await stage.updateOne({
      $push: {
        'streamSettings.targets': {
          id: targetResult.multistreamTarget.id,
          name: data.name,
          socialId: data.socialId ?? '',
          socialType: data.socialType ?? '',
          broadcastId: data.broadcastId ?? '',
        },
      },
    });
  } catch (e) {
    console.error('Error creating multistream:', e);
    if (e.body) {
      console.error('Error body:', e.body);
    }
    if (e.rawResponse) {
      console.error('Raw response:', e.rawResponse);
    }
    throw new HttpException(400, 'Error creating multistream');
  }
};

export const deleteMultiStream = async (data: {
  streamId: string;
  targetId: string;
}): Promise<void> => {
  try {
    console.log('Removing multistream target from stream:', {
      streamId: data.streamId,
      targetId: data.targetId,
    });

    // First remove the target from the stream
    const removeResult = await livepeer.stream.removeMultistreamTarget(
      data.streamId,
      data.targetId,
    );
    console.log('Remove result:', removeResult);

    // Then delete the target itself
    console.log('Deleting multistream target:', data.targetId);
    const deleteResult = await livepeer.multistream.delete(data.targetId);
    console.log('Delete result:', deleteResult);

    const stage = await Stage.findOne({
      'streamSettings.streamId': data.streamId,
    });
    const target = stage.streamSettings.targets.find(
      (e) => e.id == data.targetId,
    );
    if (target.socialType == 'youtube') {
      const org = await Organization.findOne({ _id: stage.organizationId });
      const token = org.socials.find(
        (e) => e.type == target.socialType && e._id == target.socialId,
      );
      const accessToken = await refreshAccessToken(token.refreshToken);
      await deleteYoutubeLiveStream({
        broadcastId: target.broadcastId,
        accessToken: accessToken,
      });
    }
    await stage.updateOne({
      $pull: { 'streamSettings.targets': { id: data.targetId } },
    });
  } catch (e) {
    console.error('Error deleting multistream:', e);
    if (e.body) {
      console.error('Error body:', e.body);
    }
    if (e.rawResponse) {
      console.error('Raw response:', e.rawResponse);
    }
    throw new HttpException(400, 'Error deleting multistream');
  }
};

export const generateThumbnail = async (data: {
  assetId?: string;
  playbackId: string;
}) => {
  try {
    console.log('🎬 Livepeer: Starting thumbnail generation:', data);
    let playbackId = data.playbackId;
    if (!data.playbackId) {
      console.log('🔍 Livepeer: No playbackId provided, fetching from asset');
      const asset = await getAsset(data.assetId);
      playbackId = asset.playbackId;
    }
    console.log('🎮 Livepeer: Getting playback info for:', playbackId);
    const asset = await livepeer.playback.get(playbackId);
    console.log('📼 Livepeer: Full playback response:', JSON.stringify(asset, null, 2));

    // First check for direct thumbnail in source array
    const directThumbnail = asset.playbackInfo?.meta?.source?.find(
      (source) => source.hrn === 'Thumbnail (PNG)' || source.type === 'image/png'
    );

    if (directThumbnail) {
      console.log('🎯 Livepeer: Found direct thumbnail URL:', directThumbnail.url);
      return directThumbnail.url;
    }

    // If no direct thumbnail, try the VTT method
    const lpThumbnails =
      asset.playbackInfo?.meta.source.filter(
        (source) => source.hrn === 'Thumbnails',
      ) ?? [];

    console.log('🖼️ Livepeer: Found thumbnails:', lpThumbnails.length);
    if (lpThumbnails.length > 0) {
      console.log('🎯 Livepeer: Thumbnail details:', JSON.stringify(lpThumbnails[0], null, 2));
    }

    if (lpThumbnails.length === 0) {
      console.log('⚠️ Livepeer: No thumbnails found');
      throw new HttpException(404, 'No thumbnails found for this video');
    }

    const thumbnailUrl = lpThumbnails[0].url.replace(
      'thumbnails.vtt',
      `${await fetchAndParseVTT(lpThumbnails[0].url)}`,
    );
    console.log('✨ Livepeer: Generated thumbnail URL:', thumbnailUrl);
    
    if (!thumbnailUrl) {
      throw new HttpException(404, 'Failed to generate thumbnail URL');
    }
    
    return thumbnailUrl;
  } catch (e) {
    console.error('💥 Livepeer: Error generating thumbnail:', e);
    throw e instanceof HttpException ? e : new HttpException(400, 'Error generating thumbnail');
  }
};

export const getSessionMetrics = async (
  playbackId: string,
): Promise<{ viewCount: number; playTimeMins: number }> => {
  try {
    const metrics = await livepeer.metrics.getPublicViewership(playbackId);
    if (!metrics?.data) {
      return {
        viewCount: 0,
        playTimeMins: 0,
      };
    }
    return {
      viewCount: metrics.data.viewCount ?? 0,
      playTimeMins: metrics.data.playtimeMins ?? 0,
    };
  } catch (e) {
    throw new HttpException(400, 'Error getting metrics');
  }
};

export const getHlsUrl = async (
  url: string,
): Promise<{ type: string; url: string }> => {
  const source = getSourceType(url);
  if (source.type === 'youtube' || source.type === 'twitter') {
    let output = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: source.header,
    }) as YoutubeDLOutput;
    const hlsFormat = output.formats.find(
      (format) =>
        format.protocol === 'm3u8_native' &&
        format.ext === 'mp4' &&
        source.resolutions?.includes(format.resolution),
    );
    return {
      type: source.type,
      url: hlsFormat?.manifest_url || url,
    };
  }
  return {
    type: source.type,
    url,
  };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const buildPlaybackUrl = (playbackId: string, vod?: boolean): string => {
  if (vod) {
    return `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${playbackId}/index.m3u8`;
  }
  return `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`;
};


