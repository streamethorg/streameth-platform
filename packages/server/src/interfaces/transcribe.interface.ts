import { ProcessingStatus, TranscriptionStatus } from './state.interface';

export interface ITranscript {
  status: TranscriptionStatus;
  subtitleUrl: string;
  chunks: {
    start: number;
    end: number;
    word: string;
  }[];
  text: string;
  summary: string;
}

export interface IAiAnalysis {
  status: ProcessingStatus;
  isVectorized: boolean;
}
