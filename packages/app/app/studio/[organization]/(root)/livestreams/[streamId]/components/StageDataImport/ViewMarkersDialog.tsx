'use client';
import React, { Dispatch, SetStateAction } from 'react';
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
import { formatDate } from '@/lib/utils/time';
import { LuEye } from 'react-icons/lu';

const ViewMarkersDialog = ({
  markers,
  open,
  setOpenPreview,
  isFromImport,
}: {
  open?: boolean;
  setOpenPreview?: Dispatch<SetStateAction<boolean>>;
  markers: IExtendedMarker[];
  isFromImport?: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpenPreview}>
      <DialogTrigger asChild>
        {!isFromImport && (
          <Button variant="outline">
            <LuEye className="mr-2 h-5 w-5" />
            View All Markers
          </Button>
        )}
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
                    {`${formatDate(
                      new Date(marker.start),
                      'MMMM Do YYYY, h:mm a'
                    )}`}
                  </p>
                  {marker.pretalxSessionCode && (
                    <p className="text-xs text-gray-400">
                      Pretalx Code: {marker.pretalxSessionCode}
                    </p>
                  )}
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
