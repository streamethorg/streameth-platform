import { z } from "zod";
export const COMP_NAME = "pebs";
import { transcipt } from "@/app/data/transcription";

export const CompositionProps = z.object({
  videoUrl: z.string(),
  startTime: z.number(),
  endTime: z.number(),
});

export const ValidEditorProps = z.object({
  frameRate: z.number(),
  events: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(["media", "text", "audio"]),
      url: z.string(),
      animation: z.string().optional(),
      transcript: z
        .object({
          language: z.string(),
          duration: z.number(),
          text: z.string(),
          words: z.array(
            z.object({
              word: z.string(),
              start: z.number(),
              end: z.number(),
            })
          ),
        })
        .optional(),
    })
  ),
  selectedAspectRatio: z.string(),
  captionEnabled: z.boolean(),
  captionPosition: z.string(),
  captionLinesPerPage: z.string(),
  captionFont: z.string(),
  captionColor: z.string(),
});

interface Event {
  id: string;
  label: string;
  start?: number;
  end?: number;
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

export interface MediaEvent extends Event {
  type: "media";
  url: string;
  duration?: number;
  transcript?: Transcript;
}

// export interface TextEvent extends Event {
//   type: "text";
//   text: string;
// }

// export interface AudioEvent extends Event {
//   type: "audio";
//   url: string;
// }

export type EditorEvent = MediaEvent;

// This interface should match the Zod schema above
export type EditorProps = {
  frameRate: number;
  events: EditorEvent[];
  selectedAspectRatio: string;
  captionEnabled: boolean;
  captionPosition: string;
  captionLinesPerPage: string;
  captionFont: string;
  captionColor: string;
};

// export const defaultMyCompProps: EditorProps = {
//   frameRate: 30,
//   events: [
//     {
//       id: "main",
//       lable: "main",
//       transcript: transcipt,
//       type: "media",
//       url: "https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/7712t3kcqrigwv6r/video/download.mp4",
//     },
//     {
//       id: "intro",
//       lable: "animation",
//       type: "media",
//       url: "https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/2febrk220b4e9ix0/video/download.mp4",
//     },
//   ],
//   selectedAspectRatio: "9:16",
//   captionEnabled: true,
//   captionPosition: "bottom",
//   captionLinesPerPage: "2",
//   captionFont: "Arial",
//   captionColor: "#000",
// };

export const defaultMyCompProps: EditorProps = {
  frameRate: 30,
  events: [
    {
      id: "outro",
      label: "outro",
      type: "media",
      url: "https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/9d31t459u0u2umc2/video/download.mp4",
    },
    {
      id: "intro",
      label: "intro",
      type: "media",
      url: "https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/8530e8m8oabjlpni/video/download.mp4",
    },
    {
      id: "main",
      label: "main",
      type: "media",
      url: "https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/bde8tfckzyltszb9/1080p0.mp4",
    },
  ],
  selectedAspectRatio: "16:9",
  captionEnabled: true,
  captionPosition: "bottom",
  captionLinesPerPage: "2",
  captionFont: "Arial",
  captionColor: "#000",
};
