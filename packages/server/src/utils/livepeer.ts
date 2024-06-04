import fetch from 'node-fetch';
import { config } from '@config';
import { HttpException } from '@exceptions/HttpException';
const { host, secretKey } = config.livepeer;
import { Livepeer } from 'livepeer';
import { IMultiStream } from '@interfaces/stream.interface';
import Stage from '@models/stage.model';
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
): Promise<{ url: string; assetId: string }> => {
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

export const updateAsset = async (assetId: string) => {
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
    setTimeout(() => {}, 10000);
    const asset = await getAsset(assetId);
    return asset.storage.ipfs.cid;
  } catch (e) {
    console.error(`Error updating asset:`, e);
  }
};

export const getVideoPhaseAction = async (assetId: string) => {
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
    const stream = await getStreamInfo(streamId);
    const recordings = await livepeer.session.getRecorded(stream.id);
    return recordings.classes;
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
