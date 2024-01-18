import React, { useState, useEffect } from 'react'
import { useStream, useUpdateStream } from '@livepeer/react'
import { IStage } from 'streameth-server/model/stage'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface MultistreamTarget {
  id: string
  // url: string;
}

const MultistreamCard = ({ streamId }: { streamId: string }) => {
  const { data, isLoading } = useStream(streamId)
  const [newTargetUrl, setNewTargetUrl] = useState<string>('')
  const [multistreamTargets, setMultistreamTargets] = useState<
    MultistreamTarget[]
  >([])
  const { mutate } = useUpdateStream({
    streamId,
  })

  useEffect(() => {
    if (data && data.multistream) {
      setMultistreamTargets(data.multistream.targets)
    }
  }, [data])

  const handleAddTarget = async () => {
    const updatedTargets = [
      ...multistreamTargets,
      { id: Date.now().toString(), url: newTargetUrl },
    ]
    await mutate({
      ...data,
      multistream: { targets: updatedTargets },
    })
    setNewTargetUrl('')
  }

  const handleRemoveTarget = async (targetId: string) => {
    const updatedTargets = multistreamTargets.filter(
      (target) => target.id !== targetId
    )
    await mutate({
      ...data,
      multistream: { targets: updatedTargets },
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multistream Targets</CardTitle>
      </CardHeader>
      <CardContent>
        {multistreamTargets.map((target) => (
          <div key={target.id}>
            {target.id}
            <Button onClick={() => handleRemoveTarget(target.id)}>
              Remove
            </Button>
          </div>
        ))}
        <Input
          value={newTargetUrl}
          onChange={(e) => setNewTargetUrl(e.target.value)}
        />
        <Button onClick={handleAddTarget}>Add Target</Button>
      </CardContent>
    </Card>
  )
}

export default MultistreamCard
