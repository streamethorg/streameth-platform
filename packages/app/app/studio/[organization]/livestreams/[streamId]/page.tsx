import React from 'react'

import Multistream from './components/Multistream'
import LivestreamEmbedCode from './components/LivestreamEmbedCode'
import { fetchStage } from '@/lib/services/stageService'
import { LivestreamPageParams } from '@/lib/types'
import PublishLivestream from './components/PublishLivestream'
import StreamConfigWithPlayer from './components/StreamConfigWithPlayer'
import StreamHeader from './components/StreamHeader'
import ShareButton from '@/components/misc/interact/ShareButton'
import { LinkedinIcon, XIcon } from 'react-share'
import CreateNFTModal from '../../nfts/create/components/CreateNFTModal'

const Livestream = async ({ params }: LivestreamPageParams) => {
  if (!params.streamId) return null
  const stream = await fetchStage({ stage: params.streamId })

  if (!stream) {
    return <div> no stream data found</div>
  }

  return (
    <div className=" m-auto w-full h-full overflow-y-scroll">
      <div className="flex flex-col p-8 w-full">
        <StreamHeader
          organization={params.organization}
          stream={stream}
          isLiveStreamPage
        />
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col">
            <StreamConfigWithPlayer
              stream={stream}
              streamId={params.streamId}
              organization={params.organization}
            />
            <div className="flex items-center  w-full py-2 space-x-2">
              <span className="lg:max-w-[550px] line-clamp-2 text-xl font-bold mr-auto">
                {stream.name}
              </span>
              <LivestreamEmbedCode
                streamId={stream?.streamSettings?.streamId}
                playbackId={stream?.streamSettings?.playbackId}
                playerName={stream?.name}
              />
              <ShareButton
                url={`/${params.organization}/livestream?stage=${stream._id}`}
                shareFor="livestream"
              />
            </div>
          </div>

          <div className=" h-auto flex flex-col space-y-4 w-full max-w-[25%] justify-start">
            <div className=" bg-black rounded-xl items-center justify-center w-full text-white flex flex-row h-auto max-h-[88px] text-xl">
              <XIcon />
              Stream to X
            </div>
            <CreateNFTModal organization={params.organization} type='signle' />
            <PublishLivestream stream={stream} />
            <Multistream
              stream={stream}
              organizationId={stream.organizationId as string}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Livestream
