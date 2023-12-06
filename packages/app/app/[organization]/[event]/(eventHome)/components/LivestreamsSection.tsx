import { IStage } from 'streameth-server/model/stage'
import Link from 'next/link'
import Player from '@/components/misc/Player'

const LivestreamsSection = ({
  stages,
  params,
}: {
  stages: IStage[]
  params: {
    event: string
    organization: string
  }
}) => {
  return (
    <div className="bg-base  text-white p-4 rounded-xl">
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
  )
}

export default LivestreamsSection
