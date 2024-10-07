'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { deleteSessionAction } from '@/lib/actions/sessions';
import { IExtendedSession } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

const DeleteAsset = ({
  session,
  href,
  TriggerComponent,
}: {
  session: IExtendedSession;
  href?: string;
  TriggerComponent: ReactNode;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteSessionAction({
      organizationId: session.organizationId as string,
      sessionId: session._id,
    });
    setLoading(false);
    setOpen(false);
    toast.success('Asset deleted');

    if (href) {
      router.push(href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{TriggerComponent}</DialogTrigger>
      <DialogContent className="p-10">
        <DialogHeader className="mx-auto space-y-4">
          <div className="mx-auto rounded-full bg-red-500 p-4">
            <Trash2 className="text-white" />
          </div>
          <DialogTitle className="text-center">
            Are you sure you want to delete this?
          </DialogTitle>
        </DialogHeader>
        <div>
          <p>
            If the video was created from a livestream, you can simply re-clip
            the video without having to delete anything.
          </p>
        </div>
        <DialogFooter className="mx-auto">
          <DialogClose>
            <Button variant={'secondary'}>Cancel</Button>
          </DialogClose>
          <Button
            loading={loading}
            onClick={() => handleDelete()}
            variant={'destructive'}
          >
            Delete asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAsset;
