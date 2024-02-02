import { StageSchema } from '@/lib/schema'
import { toast } from 'sonner'
import { useCreateStream } from '@livepeer/react'
import { useEffect } from 'react'
import { useCreateStage } from '@/lib/hooks/server/stage'
import { Button } from '@/components/ui/button'

const DeleteStage = ({ stage, organization }) => {
  return (
    <div>
      <Button variant={'destructive'} onClick={deleteStage}>
        Delete
      </Button>
    </div>
  )
}
