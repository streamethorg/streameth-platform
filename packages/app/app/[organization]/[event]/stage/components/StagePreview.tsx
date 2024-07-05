'use client'
import { Card, CardHeader } from '@/components/ui/card'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { IExtendedStage } from '@/lib/types'

export default function StagePreview({
  stage,
  eventCover,
}: {
  stage: IExtendedStage
  organization: string
  event: string
  eventCover: string | undefined
}) {
  const { handleTermChange } = useSearchParams()

  if (!stage?.streamSettings?.streamId) return null

  return (
    <Card
      className="w-full max-w-[350px] rounded-xl border shadow-none"
      onClick={() =>
        handleTermChange([
          {
            key: 'livestream',
            value: stage._id as string,
          },
        ])
      }>
      <Thumbnail imageUrl={eventCover} />
      <CardHeader className="bg-transparent">
        <p className="text-lg font-normal lowercase">{stage.name}</p>
      </CardHeader>
    </Card>
  )
}
