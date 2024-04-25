'use client'
import { Button } from '@/components/ui/button'
import { deleteMultistreamAction } from '@/lib/actions/stages'
import { Loader2, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteMultistream = ({
  streamId,
  organizationId,
  targetId,
}: {
  streamId?: string
  organizationId: string
  targetId?: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  if (!streamId || !targetId) return null
  const handleDelete = async (streamId: string, targetId: string) => {
    setIsLoading(true)
    try {
      await deleteMultistreamAction(
        streamId,
        organizationId,
        targetId
      )
      toast.success('Multistream target deleted')
      setIsLoading(false)
    } catch (error) {
      toast.error("Couldn't delete multistream target")
      setIsLoading(false)
    }
  }
  return (
    <Button
      onClick={() => handleDelete(streamId, targetId)}
      disabled={isLoading}
      className="flex gap-1"
      variant="outline">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <>
          <div>
            <Trash2 className="text-destructive w-4 h-4" />
          </div>
          Delete
        </>
      )}
    </Button>
  )
}

export default DeleteMultistream
