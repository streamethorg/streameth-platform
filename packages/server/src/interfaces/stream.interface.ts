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
