export interface EditorEvent {
  id: string;
  label: string;
  type: 'media';
  url: string;
  duration?: number;
  transcript?: Transcript;
  start: number;
  end: number;
}

export interface Transcript {
  language: string;
  duration: number;
  text: string;
  words: {
    word: string;
    start: number;
    end: number;
  }[];
}
