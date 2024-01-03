import { IStage } from 'streameth-server/model/stage'
import Link from 'next/link'
import Player from '@/components/misc/Player'
import { IEvent } from 'streameth-server/model/event'
import { getDateInUTC, isCurrentDateInUTC } from '@/utils/time'

const LivestreamsSection = ({
  stages,
  params,
  event,
}: {
  event: IEvent
  stages: IStage[]
  params: {
    event: string
    organization: string
  }
}) => {
  const isEventDay =
    isCurrentDateInUTC() >= getDateInUTC(event?.start)

  return isEventDay && stages[0]?.streamSettings?.streamId ? (
    <div className="bg-base text-white p-4 rounded-xl">
      <span className=" w-full text-xl uppercase md:text-4xl flex">
        Livestreams
      </span>
      <div className="grid py-4 md:grid-cols-2 gap-4">
        {stages
          .filter((stage) => stage?.streamSettings?.streamId)
          .map((stage) => (
            <Link
              className="w-full md:w-full"
              key={stage.id}
              href={`/${params.organization}/${params.event}/stage/${stage.id}`}>
              <div className="bg-black p-2 rounded-xl cursor-pointer space-y-2 w-full">
                <Player
                  streamId={stage.streamSettings.streamId}
                  playerName={stage.id}
                  muted={true}
                />
                <p className="uppercase text-xl">{stage.name}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  ) : null
}

export default LivestreamsSection
