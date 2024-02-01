import { Card, CardHeader } from '@/components/ui/card'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import Link from 'next/link'
import Image from 'next/image'

export default function StagePreview({
  stage,
  organization,
  event,
  eventCover,
}: {
  stage: IStageModel
  organization: string
  event: string
  eventCover: string
}) {
  if (!stage?.streamSettings?.streamId) return null

  return (
    <Link
      key={stage._id}
      href={`/${organization}/${event}/stage/${stage._id}`}>
      <Card>
        <Image
          className="p-1"
          src={eventCover}
          alt="Event Cover"
          width={1500}
          height={500}
        />
        <CardHeader className="bg-transparent">
          <p className="lowercase text-lg text-white font-normal">
            {stage.name} stage
          </p>
        </CardHeader>
      </Card>
    </Link>
  )
}
