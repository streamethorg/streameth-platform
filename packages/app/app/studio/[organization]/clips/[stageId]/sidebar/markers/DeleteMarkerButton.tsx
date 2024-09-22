'use client';

import { Button } from '@/components/ui/button';
import { deleteMarkerAction } from '@/lib/actions/marker';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteMarkerButton = ({
  markerId,
  organizationId,
}: {
  markerId: string;
  organizationId: string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteMarker = async () => {
    setIsDeleting(true);
    await deleteMarkerAction({
      markerId,
      organizationId,
    })
      .then((response) => {
        if (response) {
          toast.success('Marker deleted');
        } else {
          toast.error('Error deleting marker');
        }
      })
      .catch(() => {
        toast.error('Error deleting marker');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };
  return (
    <Button
      variant={'outline'}
      loading={isDeleting}
      onClick={handleDeleteMarker}
      size={'sm'}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
};

export default DeleteMarkerButton;
