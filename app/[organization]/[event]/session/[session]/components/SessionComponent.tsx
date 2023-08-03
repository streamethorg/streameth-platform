import Session from "@/server/model/session";
import Player from "@/components/misc/Player";
import SessionInfoBox from "@/components/sessions/SessionInfoBox";
import ComponetCard from "@/components/misc/ComponentCard";
import SpeakerIconList from "@/components/speakers/SpeakerIconList";

const SpeakerComponent = ({ session }: { session: Session }) => {
  return (
    <ComponetCard title="Speakers">
      <SpeakerIconList speakers={session.speakers} />
    </ComponetCard>
  );
};
export default async function SessionComponent({
  session,
}: {
  session: Session;
}) {
  return (
    <div className="flex flex-col w-full max-h-full h-full lg:flex-row relative overflow-y-scroll">
      <div className="flex flex-col w-full lg:min-h-[55vw] lg:flex-grow lg:h-full lg:w-[70%] box-border">
        <div className="lg:h-3/4 w-full lg:p-4 lg:pr-2">
          <Player playbackId={session.playbackId} playerName={session.name} />
        </div>
        <div className="p-4 mg:pt-2 lg:pt-0 lg:pr-2">
          <SessionInfoBox session={session.toJson()} />
        </div>
      </div>
      <div className="flex flex-col w-full lg:sticky lg:top-0 lg:w-[30%] p-4 pt-2 lg:pt-4 lg:p-2 lg:overflow-y-scroll">
        <SpeakerComponent session={session} />
        <div className="rounded border-2 cursor-pointer border-accent font-bold uppercase text-center p-4 mt-4 shadow hover:bg-accent  bg-accent text-white hover:animate-pulse">
          Collect this talk
        </div>
      </div>
    </div>
  );
}
