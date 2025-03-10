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
import { HlsVideo } from "./HlsPlayer";
import { ITranscript } from "streameth-new-server/src/interfaces/transcribe.interface";

const MediaEventComponent: React.FC<{
  event: EditorEvent;
  editorProps: EditorProps;
  timeLineStart: number;
  timeLineEnd: number;
}> = ({ event, editorProps, timeLineStart, timeLineEnd }) => {
  const { fps } = useVideoConfig();
  if (
    !event.url ||
    event.start === undefined ||
    event.end === undefined ||
    !event.duration
  ) {
    return null;
  }
  const startFrame = Math.round(timeLineStart * fps);
  const endFrame = Math.round(timeLineEnd * fps);

  const isVertical = editorProps.aspectRatio === "9:16";
  const isSquare = editorProps.aspectRatio === "1:1";
  const isHorizontal = editorProps.aspectRatio === "16:9";
  return (
    <Sequence from={startFrame} durationInFrames={endFrame - startFrame}>
      <AbsoluteFill>
        {isVertical || isSquare ? (
          <>
            <HlsVideo
              muted
              style={{ height: "100%", width: "100%" }}
              src={event.url}
              className="object-cover"
              startFrom={event.start * fps}
              endAt={event.duration * fps}
            />
            {isSquare && (
              <div className="absolute inset-0 bg-black opacity-50" />
            )}
          </>
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill className="z-10">
        {(isHorizontal || isSquare) && (
          <HlsVideo
            src={event.url}
            className="my-auto z-20 blur-lg"
            startFrom={event.start * fps}
            endAt={event.duration * fps}
          />
        )}
      </AbsoluteFill>
      {event.transcript && (
        <AbsoluteFill className="z-20">
          <CaptionsEventComponent
            start={event.start}
            end={event.end}
            transcript={event.transcript}
            editorProps={editorProps}
          />
        </AbsoluteFill>
      )}
    </Sequence>
  );
};

const CaptionsEventComponent: React.FC<{
  transcript: ITranscript;
  start: number;
  end: number;
  editorProps: EditorProps;
}> = ({ transcript, start, end, editorProps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = Math.round(start * fps);
  const endFrame = Math.round(end * fps);

  if (!editorProps.captionOptions.enabled) {
    return null;
  }
  if (frame < startFrame || frame > endFrame) return null;
  console.log(editorProps.captionOptions);
  return (
    <AbsoluteFill>
      <Captions
        isVertical={editorProps.aspectRatio === "9:16"}
        startAt={start}
        frameRate={fps}
        transcription={transcript}
        captionOptions={editorProps.captionOptions}
      />
    </AbsoluteFill>
  );
};

const Editor: React.FC<EditorProps> = ({ events, ...props }) => {
  const editorProps = { ...props, events };

  // Calculate timeline positions dynamically
  let currentTimelinePosition = 0;
  const eventsWithTimeline = events.map((event) => {
    const duration = event.end - event.start;
    const timelineStart = currentTimelinePosition;
    currentTimelinePosition += duration;
    return {
      ...event,
      timeLineStart: timelineStart,
      timeLineEnd: currentTimelinePosition,
    };
  });

  return (
    <AbsoluteFill className="w-full bg-black">
      {eventsWithTimeline.map((event, index) => {
        switch (event.type) {
          case "media":
            return (
              <MediaEventComponent
                key={index}
                event={event}
                editorProps={editorProps}
                timeLineStart={event.timeLineStart}
                timeLineEnd={event.timeLineEnd}
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
