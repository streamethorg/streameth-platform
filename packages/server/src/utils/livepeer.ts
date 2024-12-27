import { config } from '@config';
import { HttpException } from '@exceptions/HttpException';
import type { IMultiStream } from '@interfaces/stream.interface';
import Organization from '@models/organization.model';
import Stage from '@models/stage.model';
import { Livepeer } from 'livepeer';
import fetch from 'node-fetch';
import youtubedl from 'youtube-dl-exec';
import { refreshAccessToken } from './oauth';
import { fetchAndParseVTT, getSourceType } from './util';
import { deleteYoutubeLiveStream } from './youtube';
import { Stream, Session } from 'livepeer/models/components';

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

export const getStreamInfo = async (streamId: string): Promise<Stream> => {
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

export const getAsset = async (assetId: string) => {
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
      return '';
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
    return asset.storage.ipfs.cid;
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

export const getStreamRecordings = async (streamId: string): Promise<any> => {
  try {
    const parentStream = await getStreamInfo(streamId);
    const recordings = (
      await livepeer.session.getRecorded(parentStream?.id ?? '')
    ).classes;
    if (!recordings) {
      return {
        parentStream,
        recordings: [],
      };
    }
    return {
      parentStream,
      recordings: JSON.parse(JSON.stringify(recordings)) as Session[],
    };
  } catch (e) {
    throw new HttpException(400, 'Error fetching stream recordings');
  }
};

export const createMultiStream = async (data: IMultiStream): Promise<void> => {
  try {
    const response = await fetch(
      `https://livepeer.studio/api/stream/${data.streamId}/create-multistream-target`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: 'source',
          spec: {
            name: data.name,
            url: data.targetURL + '/' + data.targetStreamKey,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new HttpException(response.status, 'Error creating multistream');
    }

    const multistream = await response.json();

    console.log(multistream);

    const stage = await Stage.findOne({
      'streamSettings.streamId': data.streamId,
    });

    await stage.updateOne({
      $push: {
        'streamSettings.targets': {
          id: multistream.id,
          name: multistream.name,
        },
      },
    });
  } catch (e) {
    throw new HttpException(400, 'Error creating multistream');
  }
};

export const deleteMultiStream = async (data: {
  streamId: string;
  targetId: string;
}): Promise<void> => {
  try {
    await fetch(`${host}/api/multistream/target/${data.targetId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        disabled: true,
      }),
    });
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
    console.log('error', e);
    throw new HttpException(400, 'Error deleting multistream');
  }
};

export const generateThumbnail = async (data: {
  assetId?: string;
  playbackId: string;
}) => {
  try {
    let playbackId = data.playbackId;
    if (!data.playbackId) {
      const asset = await getAsset(data.assetId);
      playbackId = asset.playbackId;
    }
    const asset = await livepeer.playback.get(playbackId);

    const lpThumbnails =
      asset.playbackInfo?.meta.source.filter(
        (source) => source.hrn === 'Thumbnails',
      ) ?? [];

    if (lpThumbnails.length > 0) {
      return lpThumbnails[0].url.replace(
        'thumbnails.vtt',
        `${await fetchAndParseVTT(lpThumbnails[0].url)}`,
      );
    }
  } catch (e) {
    throw new HttpException(400, 'Error generating thumbnail');
  }
};

export const getSessionMetrics = async (
  playbackId: string,
): Promise<{ viewCount: number; playTimeMins: number }> => {
  try {
    const metrics = await livepeer.metrics.getPublicViewership(playbackId);
    if (!metrics.rawResponse.ok) {
      return {
        viewCount: 0,
        playTimeMins: 0,
      };
    }
    return {
      viewCount: metrics.object?.viewCount,
      playTimeMins: metrics.object?.playtimeMins,
    };
  } catch (e) {
    throw new HttpException(400, 'Error getting metrics');
  }
};

export const getHlsUrl = async (
  url: string,
): Promise<{ type: string; url: string }> => {
  try {
    let hlsUrl = '';
    const source = getSourceType(url);
    if (source.type === 'youtube' || source.type === 'twitter') {
      const output = await youtubedl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: source.header,
      });
      const hlsFormat = output.formats.find(
        (format) =>
          format.protocol === 'm3u8_native' &&
          format.ext === 'mp4' &&
          source.resolutions?.includes(format.resolution),
      );
      hlsUrl = hlsFormat.manifest_url;
    } else {
      hlsUrl = url;
    }
    return {
      type: source.type,
      url: hlsUrl,
    };
  } catch (e) {
    throw new HttpException(400, 'Error getting HLS URL');
  }
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
