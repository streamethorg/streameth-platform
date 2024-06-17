import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LinkedinIcon, XIcon } from 'react-share'
import CreateNFTModal from '../../../nfts/create/components/CreateNFTModal'
import Multistream from './Multistream'
import PublishLivestream from './PublishLivestream'
import { IExtendedStage } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { FilePenLine, Plus } from 'lucide-react'
import { CreateMultistreamTarget } from '../../../event/[eventId]/components/stageSettings/multistream/CreateMultistreamTarget'

const Destinations = ({
  organization,
  stream,
}: {
  organization: string
  stream: IExtendedStage
}) => {
  return (
    <Card className="flex flex-col flex-grow justify-start p-4 space-y-4 h-full">
      <div className="flex justify-start space-x-2">
        <CreateMultistreamTarget
          btnName="Add Channel"
          organizationId={organization}
          streamId={stream?.streamSettings?.streamId}
        />
        <Button className="space-x-2" variant={'secondary'}>
          <FilePenLine size={20} />
          <span>Update livestream</span>
        </Button>
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
