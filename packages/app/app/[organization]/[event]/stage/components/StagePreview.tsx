import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Player from '@/components/ui/Player'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import Link from 'next/link'

export default function StagePreview({
  stage,
  organization,
  event,
}: {
  stage: IStageModel
  organization: string
  event: string
}) {
  if (!stage?.streamSettings?.streamId) return null

  return (
    <Link
      key={stage.id}
      href={`/${organization}/${event}/stage/${stage._id}`}>
      <Card className="border-none">
        <Player
          streamId={stage.streamSettings.streamId}
          playerName={stage?.slug}
          muted={true}
        />
        <CardHeader>
          <CardTitle>{stage.name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}
