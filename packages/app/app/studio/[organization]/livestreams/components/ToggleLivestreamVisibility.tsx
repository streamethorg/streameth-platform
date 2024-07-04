'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateStageAction } from '@/lib/actions/stages'
import { IExtendedStage } from '@/lib/types'
import { ChevronDown, Earth, Loader2, Lock } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const ToggleLivestreamVisibility = ({
  item,
}: {
  item: IExtendedStage
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleToggleVisibility = async () => {
    setIsLoading(true)
    updateStageAction({
      stage: { ...item, published: !item.published },
    })
      .then((response) => {
        if (response) {
          setIsLoading(false)
          toast.success('Stream updated')
        } else {
          toast.error('Error updating stream')
        }
      })
      .catch(() => {
        toast.error('Error updating stream')
        setIsLoading(false)
      })
  }
  return (
    <div className="flex items-center justify-start space-x-2">
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
            className={`cursor-pointer space-x-2 ${
              isLoading ? 'pointer-events-none' : ''
            }`}
            onClick={handleToggleVisibility}>
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

export default ToggleLivestreamVisibility
