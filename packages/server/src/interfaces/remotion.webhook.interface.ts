export interface RemotionPayload {
  type: string;
  renderId: string;
  expectedBucketOwner: string;
  bucketName: string;
  customData?: { compositionId?: string };
  outputUrl?: string;
  lambdaErrors?: Array<string>;
  outputFile?: string;
  timeToFinish?: number;
  costs?: {
    currency: string;
    disclaimer: string;
    estimatedCost: number;
    estimatedDisplayCost: string;
  };
  errors?: Array<{
    message: string;
    name: string;
    stack: string;
  }>;
}

export interface EditorProps {
  frameRate: number;
  events: Array<{
    id: string;
    label: string;
    type: 'media' | 'text' | 'audio';
    url: string;
    animation?: string;
    transcript?: {
      language: string;
      text: string;
      words: Array<{
        word: string;
        start: number;
        end: number;
      }>;
    };
  }>;
  selectedAspectRatio: string;
  captionEnabled: boolean;
  captionPosition: string;
  captionLinesPerPage: string;
  captionFont: string;
  captionColor: string;
}
