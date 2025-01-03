export interface IClip {
  clipUrl: string;
  sessionId: string;
  start: number;
  end: number;
  organizationId?: string;
  stageId?: string;
  isEditorEnabled?: boolean;
  editorOptions?: {
    frameRate: number;
    events: Array<{
      label: string;
      sessionId?: string;
      videoUrl?: string;
    }>;
    selectedAspectRatio: string;
    captionEnabled: boolean;
    captionPosition: string;
    captionLinesPerPage: number;
    captionFont: string;
    captionColor: string;
  };
  clipSessionId?: string;
  clipEditorId?: string;
}
