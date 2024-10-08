export interface Segment {
  startTime: string;
  endTime: string;
  fileName: string;
}

export interface SessionPayload {
  m3u8Url: string;
  name: string;
  description: string;
  start: string;
  end: string;
  organizationId: string;
  stageId?: string;
  assetId?: string;
  speakers: Array<string>;
  fileName: string;
  sessionId: string;
}
