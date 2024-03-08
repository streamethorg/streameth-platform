'use client'
import { deleteEventAction } from '@/lib/actions/events'
import { IExtendedEvent } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const DeleteEvent = ({
  organizationId,
  event,
}: {
  organizationId: string
  event: IExtendedEvent
}) => {
  const router = useRouter()
  const handleDeleteEvent = (eventId: string) => {
    if (
      window.confirm('Are you sure you want to delete this event?')
    ) {
      const response = deleteEventAction({
        eventId,
        organizationId: event.organizationId as string,
      })
        .then((response) => {
          if (response) {
            toast.success('Event deleted')
            router.push('/studio/' + organizationId)
          } else {
            toast.error('Error deleting event')
          }
        })
        .catch(() => {
          toast.error('Error deleting event')
        })
    }
  }

  return (
    <Button
      onClick={() => handleDeleteEvent(event._id!)}
      variant={'destructive'}
      type="button">
      Delete event
    </Button>
  )
}

export default DeleteEvent
