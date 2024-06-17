import fetch from 'node-fetch';
import { config } from '@config';
import { HttpException } from '@exceptions/HttpException';
const { host, secretKey } = config.livepeer;
import { Livepeer } from 'livepeer';
import { IMultiStream } from '@interfaces/stream.interface';
import Stage from '@models/stage.model';
import { Session } from 'livepeer/dist/models/components';
import SessionModel from '@models/session.model';
import { SessionType } from '@interfaces/session.interface';
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

export const getStreamInfo = async (streamId: string): Promise<any> => {
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
    console.log(`Download url: ${data.downloadUrl}`);
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
    const response = await livepeer.stream.createMultistreamTarget(
      data.streamId,
      {
        spec: {
          name: data.name,
          url: data.targetURL + '/' + data.targetStreamKey,
        },
        profile: 'source',
      },
    );
    const multistream = JSON.parse(response.rawResponse.data.toString());
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
    await livepeer.multistreamTarget.delete(data.targetId);
    const stage = await Stage.findOne({
      'streamSettings.streamId': data.streamId,
    });
    await stage.updateOne({
      $pull: { 'streamSettings.targets': { id: data.targetId } },
    });
  } catch (e) {
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
    const asset = await livepeer.playback.get(playbackId as string);

    const lpThumbnails =
      asset.playbackInfo?.meta.source.filter(
        (source) => source.hrn === 'Thumbnails',
      ) ?? [];

    if (lpThumbnails.length > 0) {
      return lpThumbnails[0].url.replace('thumbnails.vtt', 'keyframes_0.jpg');
    }
  } catch (e) {
    throw new HttpException(400, 'Error generating thumbnail');
  }
};

export const getSessionMetrics = async (
  playbackId: string,
): Promise<{ viewCount: number; playTimeMins: number }> => {
  try {
    const metrics = await livepeer.metrics.getPublicTotalViews(playbackId);
    if (!metrics.object) {
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

export const createClip = async (data: {
  playbackId: string;
  sessionId: string;
  recordingId: string;
  start: number;
  end: number;
}) => {
  try {
    const clip = await livepeer.stream.createClip({
      endTime: data.end,
      startTime: data.start,
      sessionId: data.recordingId,
      playbackId: data.playbackId,
    });
    const parsedClip = JSON.parse(clip.rawResponse.data.toString());
    await SessionModel.findByIdAndUpdate(data.sessionId, {
      assetId: parsedClip.asset.id,
      playbackId: parsedClip.asset.playbackId,
      start: new Date().getTime(),
      end: new Date().getTime(),
      type: SessionType.clip,
    });
    return parsedClip;
  } catch (e) {
    console.log('error', e);
    throw new HttpException(400, 'Error creating clip');
  }
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
