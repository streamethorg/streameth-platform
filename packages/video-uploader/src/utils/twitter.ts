import crypto from 'crypto';
import { config } from 'dotenv';
import fs from 'fs';
import fetch from 'node-fetch';
import OAuth from 'oauth-1.0a';
import { logger } from './logger';
config();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const TWITTER_UPLOAD_URL = 'https://upload.twitter.com/1.1/media/upload.json';
const TWEET_URL_V2 = 'https://api.twitter.com/2/tweets';
const oauth = new OAuth({
  consumer: {
    key: process.env.TWITTER_OAUTH_KEY,
    secret: process.env.TWITTER_OAUTH_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

function getAuthHeaders(
  token: { key: string; secret: string },
  url: string,
  method: string,
  params?: {}
) {
  const payload = {
    url: url,
    method: method,
    data: params,
  };
  return oauth.toHeader(
    oauth.authorize(payload, {
      key: token.key,
      secret: token.secret,
    })
  );
}

function readChunk(
  filePath: string,
  start: number,
  end: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = fs.createReadStream(filePath, { start, end: end - 1 });
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

async function initializeUpload(
  filePath: string,
  token: { key: string; secret: string }
): Promise<string> {
  const params = {
    command: 'INIT',
    total_bytes: fs.statSync(filePath).size.toString(),
    media_type: 'video/mp4',
  };
  const body = new URLSearchParams(params);
  const authHeader = getAuthHeaders(token, TWITTER_UPLOAD_URL, 'POST', params);
  const response = await fetch(TWITTER_UPLOAD_URL, {
    method: 'POST',
    body: body,
    headers: {
      ...authHeader,
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
  const data = await response.json();
  return data.media_id_string;
}

async function uploadVideoChunks(
  filePath: string,
  mediaId: string,
  fileSize: number,
  token: { key: string; secret: string }
) {
  const chunkSize = 5 * 1024 * 1024; // 5 MB in bytes
  let segmentIndex = 0;

  for (let start = 0; start < fileSize; start += chunkSize, segmentIndex++) {
    const end = Math.min(start + chunkSize, fileSize);
    const chunk = await readChunk(filePath, start, end);
    const base64Chunk = chunk.toString('base64');
    const params = {
      command: 'APPEND',
      media_id: mediaId,
      media_data: base64Chunk,
      segment_index: segmentIndex.toString(),
    };
    const queryParams = new URLSearchParams(params);
    const headers = getAuthHeaders(token, TWITTER_UPLOAD_URL, 'POST', params);
    const response = await fetch(TWITTER_UPLOAD_URL, {
      method: 'POST',
      body: queryParams,
      headers: {
        ...headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}

async function finalizeUpload(
  mediaId: string,
  token: { key: string; secret: string }
) {
  let status = 'pending';
  do {
    const params = {
      command: 'FINALIZE',
      media_id: mediaId,
    };
    const body = new URLSearchParams(params);
    const authHeader = getAuthHeaders(
      token,
      TWITTER_UPLOAD_URL,
      'POST',
      params
    );
    const response = await fetch(TWITTER_UPLOAD_URL, {
      method: 'POST',
      body: body,
      headers: {
        ...authHeader,
      },
    });
    const data = await response.json();
    status = data.processing_info.state;
    if (status === 'succeeded') {
      logger.info('Media processing succedded');
    } else if (status === 'failed') {
      throw new Error('Media processing failed');
    } else {
      logger.info(
        'Media processing is still pending, waiting for completion...'
      );
      await delay(data.processing_info.check_after_secs * 1000);
    }
  } while (status !== 'succeeded');
}

async function tweetWithMediaV2(
  mediaId: string,
  text: string,
  token: { key: string; secret: string }
) {
  try {
    const authHeader = getAuthHeaders(token, TWEET_URL_V2, 'POST');
    const response = await fetch(TWEET_URL_V2, {
      method: 'POST',
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        media: {
          media_ids: [mediaId],
        },
      }),
    });
    const data = await response.json();
    logger.info('Tweet posted successfully');
  } catch (e) {
    logger.error(e.message);
  }
}

export async function uploadToTwitter(
  session: {
    name: string;
    description: string;
    slug: string;
    published: boolean;
    coverImage: string;
  },
  videoFilePath: string,
  token: { key: string; secret: string }
): Promise<void> {
  const fileSize = fs.statSync(videoFilePath).size;
  const mediaId = await initializeUpload(videoFilePath, token);
  await uploadVideoChunks(videoFilePath, mediaId, fileSize, token);
  await finalizeUpload(mediaId, token);
  await tweetWithMediaV2(mediaId, session.name, token);
}
