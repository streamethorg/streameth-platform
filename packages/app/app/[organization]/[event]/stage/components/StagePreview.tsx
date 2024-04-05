'use client'
import { Card, CardHeader } from '@/components/ui/card'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import useSearchParams from '@/lib/hooks/useSearchParams'

export default function StagePreview({
  stage,
  eventCover,
}: {
  stage: IStageModel
  organization: string
  event: string
  eventCover: string | undefined
}) {
  const { handleTermChange } = useSearchParams()

  if (!stage?.streamSettings?.streamId) return null

  return (
    <Card
      className="w-full max-w-[350px] rounded-xl"
      onClick={() =>
        handleTermChange([
          {
            key: 'livestream',
            value: stage._id,
          },
        ])
      }>
      <Thumbnail imageUrl={eventCover} />
      <CardHeader className="bg-transparent">
        <p className="lowercase text-lg text-white font-normal">
          {stage.name}
        </p>
      </CardHeader>
    </Card>
  )
}
