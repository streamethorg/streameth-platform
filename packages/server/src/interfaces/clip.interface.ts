export interface IClip {
  playbackId: string;
  sessionId: string;
  recordingId: string;
  start: number;
  end: number;
  organizationId?: string;
  stageId?: string;
  isEditorEnabled?: boolean;
  editorOptions?: {
    frameRate: number;
    events: Array<{
      label: string;
      sessionId: string;
    }>;
    selectedAspectRatio: string;
    captionEnabled: boolean;
    captionPosition: string;
    captionLinesPerPage: number;
    captionFont: string;
    captionColor: string;
  };
}
