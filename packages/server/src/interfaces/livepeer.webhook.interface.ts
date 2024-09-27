interface Profile {
  fps: number;
  gop: string;
  name: string;
  width: number;
  height: number;
  bitrate: number;
  profile: string;
}
export interface RecordingSessionPayload {
  id: string;
  kind: string;
  name: string;
  issues: null;
  record: boolean;
  userId: string;
  lastSeen: number;
  parentId: string;
  profiles: Profile[];
  createdAt: number;
  isHealthy: boolean;
  projectId: string;
  ingestRate: number;
  playbackId: string;
  sourceBytes: number;
  outgoingRate: number;
  sourceSegments: number;
  recordingStatus: string;
  transcodedBytes: number;
  transcodedSegments: number;
  sourceSegmentsDuration: number;
  transcodedSegmentsDuration: number;
  recordingUrl: string;
  mp4Url: string;
  assetId: string;
  recordingId: string;
}
