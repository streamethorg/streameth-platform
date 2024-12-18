"use client";
import React, { useEffect, useState, useRef } from "react";
import { Player } from "@remotion/player";
import Editor from "../remotion/Editor"; // Import EditorProps
import { useEditorContext } from "../context/EditorContext";
import { useTimeline } from "../context/TimelineContext"; // Import the timeline context
import { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import { getVideoMetadata } from "@remotion/media-utils";
import PlayerControlBar from "./PlayerControl";
import { transcipt } from "../app/data/transcription";

export const captionedVideoSchema = z.object({
    src: z.string(),
});

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
    z.infer<typeof captionedVideoSchema>
> = async ({ props }) => {
    const fps = 30;
    const metadata = await getVideoMetadata(props.src);

    return {
        fps,
        durationInFrames: Math.floor(metadata.durationInSeconds * fps),
    };
};

const PlayerComponent: React.FC = () => {
    const {
        selectedAspectRatio,
        captionEnabled,
        captionLinesPerPage,
        captionPosition,
        captionFont,
        captionColor,
        setFps,
        videoUrl,
        fps,
        playerRef,
        setCurrentTime,
    } = useEditorContext();

    const { addEvent, currentTime, events } = useTimeline();

    const metadataFetchedRef = useRef(false);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [videoMetadata, setVideoMetadata] = useState({
        fps: 0,
        durationInFrames: 0,
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideoMetadata = async () => {
            if (metadataFetchedRef.current || !videoUrl) return;

            console.log("Fetching video metadata");
            metadataFetchedRef.current = true;

            try {
                const metadata = await calculateCaptionedVideoMetadata({
                    props: { src: videoUrl },
                    defaultProps: { src: videoUrl },
                    abortSignal: AbortSignal.timeout(1_000 * 60 * 5),
                    compositionId: "",
                });

                setVideoMetadata({
                    fps: metadata.fps || 0,
                    durationInFrames: metadata.durationInFrames || 0,
                });
                if (
                    metadata.durationInFrames === 0 ||
                    metadata.fps === 0 ||
                    !metadata.durationInFrames ||
                    !metadata.fps
                ) {
                    throw new Error("Video has no frames");
                }
                setIsLoading(false);
                setError(null);
                setFps(metadata.fps);
                // Add initial video event
                addEvent({
                    id: "main",
                    label: "main",
                    type: "media",
                    start: 0,
                    duration: metadata.durationInFrames / metadata.fps,
                    end: metadata.durationInFrames / metadata.fps, // End time in seconds
                    url: videoUrl,
                    transcript: transcipt,
                });
            } catch (e) {
                console.error("Error fetching metadata:", e);
                setError("Error fetching video metadata");
                setIsLoading(false);
            }
        };

        fetchVideoMetadata();
    }, [videoUrl, setFps, addEvent]);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.seekTo(currentTime * videoMetadata.fps);
        }
    }, [currentTime, videoMetadata.fps]);

    const getVideoDurationInFrames = () => {
        const maxEndTime = Math.max(...events.map((event) => event.end ?? 0));

        return Math.max(1, Math.round(maxEndTime * videoMetadata.fps));
    };

    const getCompositionDimensions = () => {
        switch (selectedAspectRatio) {
            case "16:9":
                return { width: 1920, height: 1080 };
            case "9:16":
                return { width: 1080, height: 1920 };
            case "1:1":
                return { width: 1920, height: 1080 };
            default:
                return { width: 1920, height: 1080 };
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>eror {videoUrl}</div>;
    }

    return (
        <div className="bg-gray-100 flex-col flex items-center w-full h-full justify-center text-white relative overflow-hidden">
            <Player
                ref={playerRef}
                component={Editor}
                inputProps={{
                    frameRate: videoMetadata.fps,
                    events,
                    selectedAspectRatio,
                    captionEnabled,
                    captionPosition,
                    captionLinesPerPage,
                    captionFont,
                    captionColor,
                }}
                className="'w-full object-cover"
                durationInFrames={getVideoDurationInFrames()}
                fps={videoMetadata.fps}
                compositionHeight={getCompositionDimensions().height}
                compositionWidth={getCompositionDimensions().width}
                spaceKeyToPlayOrPause
            />
            <PlayerControlBar playerRef={playerRef} />
        </div>
    );
};

export default PlayerComponent;
