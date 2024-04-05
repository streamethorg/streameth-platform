export enum LivepeerEvent {
  assetReady = 'asset.ready',
  streamReady = 'stream.ready',
  streamIdle = 'stream.idle'
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
