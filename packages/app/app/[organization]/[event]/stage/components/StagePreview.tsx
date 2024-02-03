import { Card, CardHeader } from '@/components/ui/card'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import Link from 'next/link'
import Image from 'next/image'
import banner from '@/public/streameth_banner.png'
export default function StagePreview({
  stage,
  organization,
  event,
  eventCover,
}: {
  stage: IStageModel
  organization: string
  event: string
  eventCover: string | undefined
}) {
  if (!stage?.streamSettings?.streamId) return null

  return (
    <Link
      key={stage._id}
      href={`/${organization}/${event}/stage/${stage._id}`}>
      <Card>
        <Image
          className="p-1"
          src={eventCover || banner}
          alt="Event Cover"
          width={1500}
          height={500}
        />
        <CardHeader className="bg-transparent">
          <p className="lowercase text-lg text-white font-normal">
            {stage.name}
          </p>
        </CardHeader>
      </Card>
    </Link>
  )
}
