import { config } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { ClippingStatus, SessionType } from '@interfaces/session.interface';
import { StateStatus, StateType } from '@interfaces/state.interface';
import { IMultiStream } from '@interfaces/stream.interface';
import Organization from '@models/organization.model';
import SessionModel from '@models/session.model';
import Stage from '@models/stage.model';
import State from '@models/state.model';
import { Livepeer } from 'livepeer';
import { Session, Stream } from 'livepeer/dist/models/components';
import fetch from 'node-fetch';
import { createEventVideoById } from './firebase';
import { refreshAccessToken } from './oauth';
import { fetchAndParseVTT, parseVTT } from './util';
import { deleteYoutubeLiveStream } from './youtube';
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
          socialId: data.socialId ?? '',
          socialType: data.socialType ?? '',
          broadcastId: data.broadcastId ?? '',
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
    const asset = await livepeer.playback.get(playbackId as string);

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
    let session = await SessionModel.findById(data.sessionId);
    await SessionModel.findOneAndUpdate(
      { _id: data.sessionId },
      {
        $set: {
          assetId: parsedClip.asset.id,
          playbackId: parsedClip.asset.playbackId,
          start: new Date().getTime(),
          end: new Date().getTime(),
          startClipTime: data.start,
          endClipTime: data.end,
          type: SessionType.clip,
          createdAt: new Date(),
          clippingStatus: ClippingStatus.pending,
        },
      },
      {
        new: true,
        timestamps: false, // Disable automatic timestamp handling
      },
    );
    if (session.firebaseId) {
      const speakerNames = session.speakers
        .map((speaker) => speaker.name)
        .join(', ');
      const newData = {
        fullTitle: `${speakerNames} :  ${session.name}`,
        title: session.name,
        speaker: speakerNames,
        description: session.description,
        date: new Date(),
        type: session.talkType,
        track: session.track.map((track) => track).join(', '),
        url: `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${parsedClip.asset.playbackId}/index.m3u8`,
        mp4Url: `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${parsedClip.asset.playbackId}/1080p0.mp4`,
        assetId: parsedClip.asset.id,
        iframeUrl: `<iframe src="http://streameth.org/embed?session=${session._id}&vod=true&playerName=${session.name}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`,
      };
      // Update Firebase
      await createEventVideoById(session.firebaseId, newData);
    }
    await State.create({
      sessionId: session._id.toString(),
      organizationId: session.organizationId.toString(),
      type: StateType.video,
      status: StateStatus.pending,
    });
    return parsedClip;
  } catch (e) {
    console.log('error', e);
    throw new HttpException(400, 'Error creating clip');
  }
};

export const refetchAssets = async () => {
  try {
    const sessions = await SessionModel.find({
      $and: [{ playbackId: { $eq: '' } }, { assetId: { $ne: '' } }],
    });
    if (sessions.length === 0) return;
    const sessionPromise = sessions.map(async (session) => {
      try {
        let asset = await getAsset(session.assetId);
        if (!asset) {
          return;
        }
        await session.updateOne({ playbackId: asset.playbackId });
      } catch (e) {
        throw new HttpException(400, 'Error refetching asset');
      }
    });
    await Promise.all(sessionPromise);
  } catch (e) {
    console.log('error', e);
    throw new HttpException(400, 'Error refetching asset');
  }
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
