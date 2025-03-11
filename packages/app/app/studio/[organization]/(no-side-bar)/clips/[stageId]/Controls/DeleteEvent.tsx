import { useEventContext } from '../Timeline/EventConntext';
import { TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
const DeleteEvent = () => {
  const { removeEvent, selectedEvent } = useEventContext();
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        disabled={!selectedEvent}
        onClick={() => removeEvent(selectedEvent?.id ?? '')}
        size="icon"
      >
        <TrashIcon size={22} className="text-primary" />
      </Button>
    </div>
  );
};

export default DeleteEvent;
