import { deleteEventAction } from '@/lib/actions/events'
import { IExtendedEvent } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const DeleteEvent = ({ event }: { event: IExtendedEvent }) => {
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
      variant={'destructive'}>
      Delete event
    </Button>
  )
}

export default DeleteEvent
