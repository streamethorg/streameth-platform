import { AbsoluteFill, Composition } from "remotion";
import { COMP_NAME, defaultMyCompProps, EditorProps } from "./constants";
import Editor from "./Editor";
import { getVideoMetadata } from "@remotion/media-utils";
import { CalculateMetadataFunction } from "remotion";

const EditorComposition: React.FC = () => {
  const getVideoDurationInFrames = ({
    events,
    fps,
  }: {
    events: EditorProps["events"];
    fps: EditorProps["frameRate"];
  }) => {
    const totalEventsDurationInSeconds = events.reduce(
      (total, event) => total + ((event.end ?? 0) - (event.start ?? 0)),
      0
    );
    return Math.max(1, Math.round(totalEventsDurationInSeconds * fps));
  };

  const getCompositionDimensions = ({
    selectedAspectRatio,
  }: {
    selectedAspectRatio: EditorProps["selectedAspectRatio"];
  }) => {
    switch (selectedAspectRatio) {
      case "16:9":
        return { width: 1920, height: 1080 };
      case "9:16":
        return { width: 1080, height: 1920 };
      case "1:1":
        return { width: 1920, height: 1080 };
      default:
        return { width: 1080, height: 1920 };
    }
  };

  const organizeTimeline = async (events: EditorProps["events"]) => {
    let modifiedEvents = [...events];

    // Process intro
    const intro = modifiedEvents.find((event) => event.id === "intro");
    if (intro && intro.type === "media") {
      const introMetadata = await getVideoMetadata(intro.url);
      intro.start = 0;
      intro.end = introMetadata.durationInSeconds;
      intro.duration = introMetadata.durationInSeconds;
    }

    // Process main
    const main = modifiedEvents.find((event) => event.id === "main");
    if (main && main.type === "media") {
      const mainMetadata = await getVideoMetadata(main.url);
      main.start = intro ? (intro.end ?? 0) : 0;
      main.end = main.start + mainMetadata.durationInSeconds;
      main.duration = mainMetadata.durationInSeconds;
    }

    // Process outro
    const outro = modifiedEvents.find((event) => event.id === "outro");
    if (outro && outro.type === "media") {
      const outroMetadata = await getVideoMetadata(outro.url);
      outro.start = main?.end ?? 0; // Use optional chaining and nullish coalescing
      outro.end = outro.start + outroMetadata.durationInSeconds;
      outro.duration = outroMetadata.durationInSeconds;
    }

    return modifiedEvents;
  };

  const calculateMetadata: CalculateMetadataFunction<EditorProps> = async ({
    props,
    abortSignal,
  }) => {
    if (abortSignal.aborted) {
      throw new Error("Aborted");
    }

    const events = await organizeTimeline(props.events);
    console.log(events);

    const durationInFrames = getVideoDurationInFrames({
      events: events,
      fps: props.frameRate,
    });

    const { width, height } = getCompositionDimensions({
      selectedAspectRatio: props.selectedAspectRatio,
    });

    return {
      ...props,
      events,
      width,
      height,
      durationInFrames,
      fps: props.frameRate,
    };
  };

  return (
    <>
      <Composition
        id={COMP_NAME}
        component={Editor}
        durationInFrames={100}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultMyCompProps}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};

export default EditorComposition;
