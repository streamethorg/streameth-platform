'use client';
import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IExtendedSession } from '@/lib/types';

const ViewSessionsDialog = ({ sessions }: { sessions: IExtendedSession[] }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View All Sessions</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <h3 className="font-bold bg-background pr-2 flex items-center">
            Sessions
            <span className="bg-primary ml-2 px-2 py-1 rounded-2xl text-sm font-normal text-white">
              {sessions?.length ?? 0}
            </span>
          </h3>
        </DialogTitle>
        {sessions && sessions?.length > 0 ? (
          <div className="max-h-[400px] overflow-auto">
            <div className="overflow-auto">
              {sessions?.map((session) => (
                <div
                  key={session?._id?.toString()}
                  className="bg-gray-100 my-2 p-2 rounded-lg"
                >
                  {session.name}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>no Session found</p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSessionsDialog;
