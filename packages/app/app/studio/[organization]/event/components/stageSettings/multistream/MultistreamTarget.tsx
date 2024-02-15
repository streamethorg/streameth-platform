import { useEffect } from 'react'
import { toast } from 'sonner'
import {
  useUpdateStream,
  MultistreamTargetRef,
} from '@livepeer/react'
import { Loader2 } from 'lucide-react'

const MultistreamTargetItem = ({
  streamId,
  target,
  currentTargets,
  refetch,
}: {
  streamId: string
  target: MultistreamTargetRef
  currentTargets: MultistreamTargetRef[]
  refetch: () => void
}) => {
  const {
    mutate: updateStream,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useUpdateStream({
    streamId: streamId,
    multistream: {
      targets: [...currentTargets.filter((t) => t.id !== target.id)],
    },
  })

  useEffect(() => {
    if (isSuccess) {
      toast('Multistream target deleted successfully')
      refetch()
    }
    if (isError) {
      console.error('Failed to delete multistream target:', error)
      toast('Error deleting multistream target')
    }
  }, [isSuccess, isError, error, refetch])

  return (
    <div className="flex flex-row border-b py-2">
      <p className="w-1/2 font-semibold">{target.spec.name}</p>
      <p className="w-1/4">{target.profile}</p>
      <p
        className="w-1/4 text-right text-destructive cursor-pointer"
        onClick={() => {
          updateStream?.()
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
