export interface IMultiStream {
  name: string;
  streamId: string;
  targetStreamKey: string;
  targetURL: string;
  organizationId: string;
  socialId?: string;
  socialType?: string;
  broadcastId?: string;
}

export interface ICreateClip {
  sessionId: string;
  organizationId: string;
  m3u8Url: string;
  start: string;
  end: string;
}
