import FilterBar from "./components/FilterBar";
import FilteredItems from "./components/FilteredItems";
import { FilterContextProvider } from "./components/FilterContext";
import SpeakerController from "@/server/controller/speaker";
import SessionController from "@/server/controller/session";
import StageController from "@/server/controller/stage";

interface Params {
  params: {
    event: string;
  };
}

export default async function ArchivePage({ params }: Params) {
  const sessionController = new SessionController();
  const sessions = (
    await sessionController.getAllSessionsForEvent(params.event)
  ).map((session) => {
    return session.toJson();
  });

  const videoSessions = sessions.filter((session) => {
    return session.videoUrl != undefined;
  });

  const speakerController = new SpeakerController();
  const speakers = (
    await speakerController.getAllSpeakersForEvent(params.event)
  ).map((speaker) => {
    return speaker.toJson();
  });

  const stageController = new StageController();
  const stages = (await stageController.getAllStagesForEvent(params.event)).map(
    (stage) => {
      return stage.toJson();
    }
  );

  return (
    <div className="flex flex-col-reverse justify-end lg:flex-row w-full overflow-y-hidden">
      <FilterContextProvider items={videoSessions}>
        <div className="w-full pt-0 p-4 lg:pt-4 overflow-y-scroll">
          <FilteredItems />
        </div>
        <div className="w-full lg:w-1/3 lg:max-w-[25rem] px-4 pt-2 mb-2 md:p-4 md:mb-0 lg:pl-1">
          <FilterBar
            sessions={videoSessions}
            speakers={speakers}
            stages={stages}
          />
        </div>
      </FilterContextProvider>
    </div>
  );
}
