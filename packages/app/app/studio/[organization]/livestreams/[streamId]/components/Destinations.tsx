import { Card } from '@/components/ui/card'
import Multistream from './Multistream'
import PublishLivestream from './PublishLivestream'
import { IExtendedStage } from '@/lib/types'
import { CreateMultistreamTarget } from './StreamPlatforms/CreateMultistreamTarget'
import NotFound from '@/app/not-found'
import EditLivestream from '../../components/EditLivestream'

const Destinations = ({
  organization,
  stream,
}: {
  organization: string
  stream: IExtendedStage
}) => {
  if (!stream.streamSettings?.streamId) {
    return NotFound()
  }

  return (
    <Card className="flex flex-col flex-grow justify-start p-4 space-y-4 h-full">
      <div className="flex justify-start space-x-2">
        <CreateMultistreamTarget
          btnName="Add Channel"
          organizationId={stream.organizationId as string}
          streamId={stream?.streamSettings?.streamId}
        />
        <EditLivestream
          stage={stream}
          organizationSlug={organization}
          variant="secondary"
          btnText="Edit Livestream"
        />
      </div>
      <Multistream
        stream={stream}
        organizationId={stream.organizationId as string}
      />
      <PublishLivestream stream={stream} />
    </Card>
  )
}

export default Destinations
