import { Suspense } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import MultistreamTargetItem from './MultistreamTarget'
import { CreateMultistreamTarget } from './CreateMultistreamTarget'
import {
  getMultistreamTarget,
  getStageStream,
} from '@/lib/actions/stages'

const MultistreamCard = async ({
  streamId,
}: {
  streamId: string
}) => {
  const targets =
    (await getStageStream(streamId))?.multistream?.targets ?? []
  return (
    <Card className="shadow-none border-border h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          Multistream Targets
          <CreateMultistreamTarget streamId={streamId} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 flex-grow overflow-auto">
        <div className="flex flex-row border-b">
          <div className="w-1/2 font-bold">Name</div>
          <div className="w-1/4 font-bold">Profile</div>
          <div className="w-1/4 font-bold"></div>
        </div>
        {targets.map((target) => (
          <Suspense
            key={target.id}
            fallback={
              <div className="w-full bg-gray-600 animate-pulse" />
            }>
            {target.id &&
              getMultistreamTarget({ targetId: target.id }).then(
                (data) => {
                  return (
                    <MultistreamTargetItem
                      key={data?.id}
                      streamId={streamId}
                      target={{
                        id: data?.id,
                        profile: target.profile,
                        spec: {
                          name: data?.name,
                        },
                      }}
                    />
                  )
                }
              )}
          </Suspense>
        ))}
      </CardContent>
    </Card>
  )
}

export default MultistreamCard
