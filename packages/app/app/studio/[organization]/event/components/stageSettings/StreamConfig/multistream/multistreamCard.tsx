import React, { useState, useEffect } from 'react'
import { useStream, MultistreamTargetRef } from '@livepeer/react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import MultistreamTargetItem from './MultistreamTarget'
import { CreateMultistreamTarget } from './CreateMultistreamTarget'

const MultistreamCard = ({ streamId }: { streamId: string }) => {
  const { data, isLoading, refetch } = useStream(streamId)
  const [multistreamTargets, setMultistreamTargets] = useState<
    MultistreamTargetRef[]
  >([])
  useEffect(() => {
    if (data && data.multistream) {
      setMultistreamTargets(data.multistream.targets)
    }
  }, [data])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card className="shadow-none border-border h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          Multistream Targets
          <CreateMultistreamTarget
            streamId={streamId}
            currentTargets={multistreamTargets}
            refetch={refetch}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 flex-grow overflow-scroll">
        <div className="flex flex-row border-b">
          <div className="w-1/2 font-bold">Name</div>
          <div className="w-1/4 font-bold">Profile</div>
          <div className="w-1/4 font-bold"></div>
        </div>
        {multistreamTargets.map((target) => (
          <MultistreamTargetItem
            key={target.id}
            streamId={streamId}
            target={target}
            currentTargets={multistreamTargets}
            refetch={refetch}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export default MultistreamCard
