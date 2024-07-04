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
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'

const DeleteAsset = ({
  session,
  href,
  TriggerComponent,
}: {
  session: IExtendedSession
  href: string | 'refresh'
  TriggerComponent: ReactNode
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await deleteSessionAction({
      organizationId: session.organizationId as string,
      sessionId: session._id,
    })
    setLoading(false)

    if (href === 'refresh') {
      router.refresh()
    }
    router.push(href)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{TriggerComponent}</DialogTrigger>
      <DialogContent className="p-10 sm:max-w-[475px]">
        <DialogHeader className="mx-auto space-y-4">
          <div className="mx-auto rounded-full bg-red-500 p-4">
            <Trash2 className="text-white" />
          </div>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="mx-auto">
          <DialogClose>
            <Button variant={'secondary'}>Cancel</Button>
          </DialogClose>
          <Button
            loading={loading}
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
