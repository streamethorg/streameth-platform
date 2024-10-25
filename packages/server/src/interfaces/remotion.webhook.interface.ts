export interface RemotionPayload {
  type: string;
  renderId: string;
  expectedBucketOwner: string;
  bucketName: string;
  customData?: { compositionId?: string };
  outputUrl: string;
  lambdaErrors: Array<string>;
  outputFile: string;
  timeToFinish: number;
  costs: {
    currency: string;
    disclaimer: string;
    estimatedCost: number;
    estimatedDisplayCost: string;
  };
}
