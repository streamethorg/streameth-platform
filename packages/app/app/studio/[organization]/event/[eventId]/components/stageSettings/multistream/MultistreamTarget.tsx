'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { deleteMultistreamTarget } from '@/lib/actions/stages'

const MultistreamTargetItem = ({
  streamId,
  target,
}: {
  streamId: string
  target: {
    id?: string
    spec: {
      name?: string
    }
    profile: string
  }
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleDelete = async (targetId: string) => {
    setIsLoading(true)
    try {
      await deleteMultistreamTarget(streamId, targetId)
      toast.success('Multistream target deleted')
      setIsLoading(false)
    } catch (error) {
      toast.error("Couldn't delete multistream target")
    }
  }

  return (
    <div className="flex flex-row border-b py-2">
      <p className="w-1/2 font-semibold">{target.spec.name}</p>
      <p className="w-1/4">{target.profile}</p>
      <p
        className="w-1/4 text-right text-destructive cursor-pointer"
        onClick={() => {
          handleDelete(target.id ?? '')
        }}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Delete'
        )}
      </p>
    </div>
  )
}

export default MultistreamTargetItem
