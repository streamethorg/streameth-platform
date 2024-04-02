'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { deleteSessionAction } from '@/lib/actions/sessions'
import { IExtendedSession } from '@/lib/types'
import { TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const DeleteAsset = ({
  session,
  href,
  showIcon = true,
}: {
  session: IExtendedSession
  href: string
  showIcon?: boolean
}) => {
  const router = useRouter()

  const handleDelete = async () => {
    await deleteSessionAction({
      organizationId: session.organizationId as string,
      sessionId: session._id,
    })

    router.push(href)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'destructive'}>
          {showIcon && <TrashIcon />}
          <p>Delete</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={'secondary'}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => handleDelete()}
            variant={'destructive'}>
            Delete asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAsset
