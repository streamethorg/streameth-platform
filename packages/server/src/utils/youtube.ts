import { youtube_v3 } from 'googleapis';
import { getYoutubeClient } from './oauth';

const createLiveBroadcast = async (
  youtube: youtube_v3.Youtube,
  title: string,
  streamDate: string,
): Promise<string> => {
  const res: any = await youtube.liveBroadcasts.insert({
    part: ['snippet', 'contentDetails', 'status'],
    requestBody: {
      snippet: {
        title: title,
        scheduledStartTime: new Date(streamDate).toISOString(),
      },
      contentDetails: {
        monitorStream: {
          enableMonitorStream: true,
        },
      },
      status: {
        privacyStatus: 'public',
      },
    },
  });
  return res.data.id;
};

const createLiveStream = async (
  youtube: youtube_v3.Youtube,
  title: string,
): Promise<{ id: string; streamKey: string; ingestUrl: string }> => {
  const res: any = await youtube.liveStreams.insert({
    part: ['snippet', 'cdn', 'contentDetails', 'status'],
    requestBody: {
      snippet: {
        title: title,
      },
      cdn: {
        frameRate: '30fps',
        ingestionType: 'rtmp',
        resolution: '720p',
      },
      status: {
        streamStatus: 'active',
      },
    },
  });
  return {
    id: res.data.id,
    streamKey: res.data.cdn.ingestionInfo.streamName,
    ingestUrl: res.data.cdn.ingestionInfo.ingestionAddress,
  };
};

const bindBroadCastToStream = async (
  youtube: youtube_v3.Youtube,
  broadcastId: string,
  streamId: string,
) => {
  await youtube.liveBroadcasts.bind({
    part: ['id', 'contentDetails'],
    id: broadcastId,
    streamId: streamId,
  });
};

export const createYoutubeLiveStream = async (data: {
  accessToken: string;
  title: string;
  streamDate: string;
  thumbnail: string;
}): Promise<{ streamKey: string; ingestUrl: string; broadcastId: string }> => {
  const youtube = await getYoutubeClient(data.accessToken);
  const broadcastId = await createLiveBroadcast(
    youtube,
    data.title,
    data.streamDate,
  );
  const stream = await createLiveStream(youtube, data.title);
  await bindBroadCastToStream(youtube, broadcastId, stream.id);
  if (data.thumbnail) {
    const response = await fetch(data.thumbnail, {
      method: 'get',
    });
    const thumbnailData = await response.arrayBuffer();
    const thumbnailBuffer = Buffer.from(thumbnailData);
    await youtube.thumbnails.set({
      videoId: broadcastId,
      media: {
        body: thumbnailBuffer,
      },
    });
  }
  return {
    streamKey: stream.streamKey,
    ingestUrl: stream.ingestUrl,
    broadcastId: broadcastId,
  };
};

export const deleteYoutubeLiveStream = async (data: {
  accessToken: string;
  broadcastId: string;
}): Promise<void> => {
  const youtube = await getYoutubeClient(data.accessToken);
  await youtube.liveBroadcasts.delete({ id: data.broadcastId });
};
