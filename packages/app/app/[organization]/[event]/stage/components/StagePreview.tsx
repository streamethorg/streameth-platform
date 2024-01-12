import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Player from '@/components/ui/Player'
import { IStage } from 'streameth-server/model/stage'
import Link from 'next/link'

export default function StagePreview({
  stage,
  organization,
  event,
}: {
  stage: IStage
  organization: string
  event: string
}) {
  if (!stage?.streamSettings?.streamId) return null

  return (
    <Link
      key={stage.id}
      href={`/${organization}/${event}/stage/${stage.id}`}>
      <Card className="border-none">
        <Player
          streamId={stage.streamSettings.streamId}
          playerName={stage.id}
          muted={true}
        />
        <CardHeader>
          <CardTitle>{stage.name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}
