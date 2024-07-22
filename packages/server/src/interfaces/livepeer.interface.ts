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
