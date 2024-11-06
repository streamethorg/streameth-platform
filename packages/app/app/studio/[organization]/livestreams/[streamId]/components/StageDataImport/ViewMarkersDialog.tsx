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
import { IExtendedMarker } from '@/lib/types';
import { formatDate, getDateWithTime } from '@/lib/utils/time';

const ViewMarkersDialog = ({ markers }: { markers: IExtendedMarker[] }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View All Markers</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <h3 className="font-bold bg-background pr-2 flex items-center">
            Stage Markers
            <span className="bg-primary ml-2 px-2 py-1 rounded-2xl text-sm font-normal text-white">
              {markers?.length ?? 0}
            </span>
          </h3>
        </DialogTitle>
        {markers && markers?.length > 0 ? (
          <div className="max-h-[400px] overflow-auto">
            <div className="overflow-auto">
              {markers?.map((marker) => (
                <div
                  key={marker?._id?.toString()}
                  className="bg-gray-100 my-2 p-2 rounded-lg"
                >
                  {marker.name}
                  <p className="text-sm text-gray-400">
                    {`${formatDate(new Date(marker.start), 'MMMM Do YYYY, h:mm a')}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No marker found</p>
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

export default ViewMarkersDialog;
