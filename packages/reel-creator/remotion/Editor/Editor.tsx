import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  OffthreadVideo,
} from "remotion";
import Captions from "./Captions";
import { EditorProps, EditorEvent, Transcript } from "@/types/constants";

const MediaEventComponent: React.FC<{
  event: EditorEvent;
  editorProps: EditorProps;
}> = ({ event, editorProps }) => {
  const { fps } = useVideoConfig();
  if (!event.url || event.start === undefined || event.end === undefined || !event.duration) {
    return null;
  }
  const startFrame = Math.round(event.timeLineStart * fps);
  const endFrame = Math.round(event.timeLineEnd * fps);

  const isVertical = editorProps.selectedAspectRatio === "9:16";

  return (
    <Sequence from={startFrame} durationInFrames={endFrame - startFrame}>
      <AbsoluteFill>
        {isVertical ? (
          <OffthreadVideo
            muted
            style={{ height: "100%", width: "100%" }}
            src={event.url}
            className="object-cover z-1 blur-lg"
            startFrom={event.start * fps}
            endAt={event.duration * fps}
          />
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill className="z-10">
        {isVertical ? (
          <OffthreadVideo
            src={event.url}
            className="my-auto z-10"
            startFrom={event.start * fps}
            endAt={event.duration * fps}
          />
        ) : (
          <OffthreadVideo
            src={event.url}
            className="my-auto"
            startFrom={event.start * fps}
            endAt={event.duration * fps}
          />
        )}
      </AbsoluteFill>
      {event.transcript && (
        <AbsoluteFill className="z-20">
          <CaptionsEventComponent
            start={event.start ? event.start : 0}
            end={event.end ? event.end : event.transcript.duration}
            transcript={event.transcript}
            editorProps={editorProps}
          />
        </AbsoluteFill>
      )}
    </Sequence>
  );
};

const CaptionsEventComponent: React.FC<{
  transcript: Transcript;
  start: number;
  end: number;
  editorProps: EditorProps;
}> = ({ transcript, start, end, editorProps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round(end * fps);

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <AbsoluteFill>
      <Captions
        isVertical={editorProps.selectedAspectRatio === "9:16"}
        startAt={start}
        frameRate={fps}
        transcription={transcript}
        captionEnabled={editorProps.captionEnabled}
        captionPosition={editorProps.captionPosition}
        captionFont={editorProps.captionFont}
        captionColor={editorProps.captionColor}
      />
    </AbsoluteFill>
  );
};

const Editor: React.FC<EditorProps> = ({ events, ...props }) => {
  const editorProps = { ...props, events };
  return (
    <AbsoluteFill className="w-full bg-black">
      {events.map((event, index) => {
        switch (event.type) {
          case "media":
            return (
              <MediaEventComponent
                key={index}
                event={event}
                editorProps={editorProps}
              />
            );
          default:
            return null;
        }
      })}
    </AbsoluteFill>
  );
};

export default Editor;
