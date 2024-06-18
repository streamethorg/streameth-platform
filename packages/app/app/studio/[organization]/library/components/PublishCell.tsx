'use client'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IExtendedSession } from '@/lib/types'
import { useState } from 'react'

import {
  getSessionMetrics,
  updateSessionAction,
} from '@/lib/actions/sessions'

import {
  ChevronDown,
  Copy,
  EllipsisVertical,
  Earth,
  Lock,
  Loader2,
} from 'lucide-react'

const PublishCell = ({ item }: { item: IExtendedSession }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handlePublishment = () => {
    setIsLoading(true)
    updateSessionAction({
      session: {
        _id: item._id,
        name: item.name,
        description: item.description,
        organizationId: item.organizationId,
        eventId: item.eventId,
        stageId: item.stageId,
        start: item.start ?? Number(new Date()),
        end: item.end ?? Number(new Date()),
        speakers: item.speakers ?? [],
        type: item.type ?? 'video',
        published: !item.published,
      },
    })
      .then(() => {
        if (item.published === true) {
          toast.success('Succesfully made your asset private')
        } else if (item.published === false) {
          toast.success('Succesfully made your asset public')
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
        toast.error('Something went wrong...')
      })
  }

  return (
    <div className="flex justify-start items-center space-x-2">
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : item.published ? (
        <>
          <Earth size={16} />
          <p>Public</p>
        </>
      ) : (
        <>
          <Lock size={16} />
          <p>Private</p>
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger>
          {isLoading ? null : <ChevronDown size={20} />}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="space-x-2 cursor-pointer"
            onClick={() => handlePublishment()}>
            {!item.published ? (
              <>
                <Earth size={16} />
                <p>Make Public</p>
              </>
            ) : (
              <>
                <Lock size={16} />
                <p>Make Private</p>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
export default PublishCell
