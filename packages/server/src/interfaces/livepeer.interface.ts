export enum LivepeerEvent {
  assetReady = 'asset.ready',
  assetFailed = 'asset.failed',
  streamReady = 'stream.ready',
  streamIdle = 'stream.idle',
  streamStarted = 'stream.started',
  recordingReady = 'recording.ready',
  //Add whatever you need
}

interface LivepeerPayload {
  id: string;
  snapshot: Object;
}

export interface ILivepeer {
  id: string;
  webhookId: string;
  createdAt: number;
  timestamp: number;
  event: LivepeerEvent;
  payload: LivepeerPayload;
}

export interface LivepeerRecording {
  id?: string;
  playbackId?: string;
  recordingUrl?: string;
  mp4Url?: string;
  name?: string;
  createdAt?: number;
  lastSeen?: number;
}
		
export interface MultistreamTarget {
  id: string;
  name: string;
  userId: string;
  disabled: boolean;
  createdAt: number;
}
export interface LivepeerSDKResponse {
  contentType: string;
  statusCode: number;
  rawResponse: Response;
  multistreamTarget?: MultistreamTarget;
  error?: Record<string, unknown>;
}