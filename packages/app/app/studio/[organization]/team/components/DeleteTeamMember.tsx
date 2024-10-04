'use client';
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteTeamMemberAction } from '@/lib/actions/organizations';

const DeleteTeamMember = ({
  memberWalletAddress,
  organizationId,
}: {
  memberWalletAddress: string;
  organizationId: string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDeleteMember = async () => {
    setIsDeleting(true);
    await deleteTeamMemberAction({
      memberWalletAddress,
      organizationId,
    })
      .then((response) => {
        if (response) {
          toast.success('Member deleted');
          setOpen(false);
        } else {
          toast.error('Error deleting member');
        }
      })
      .catch(() => {
        toast.error('Error deleting member');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center gap-5">
        <div className="rounded-full bg-destructive p-3">
          <Trash2 className="h-5 w-5 text-white" />
        </div>
        <p className="text-xl">Are you sure you want to delete this member?</p>
        <DialogFooter className="flex items-center gap-4">
          <DialogClose>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <Button
            onClick={handleDeleteMember}
            loading={isDeleting}
            variant="destructive"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTeamMember;
