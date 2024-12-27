'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { saveSessionImportAction } from '@/lib/actions/sessions';
import { IExtendedStage } from '@/lib/types';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { IScheduleImportMetadata } from 'streameth-new-server/src/interfaces/schedule-importer.interface';

const ImportPreviewDialog = ({
  previewData,
  open,
  setOpen,
  hasRooms = false,
  scheduleId,
  organizationId,
  stage,
}: {
  previewData?: IScheduleImportMetadata;
  open: boolean;
  setOpen: (open: boolean) => void;
  hasRooms?: boolean;
  scheduleId: string;
  organizationId: string;
  stage?: IExtendedStage;
}) => {
  const [isSavingSessions, setIsSavingSessions] = useState(false);

  const handleSaveSessions = async () => {
    setIsSavingSessions(true);
    await saveSessionImportAction({
      scheduleId,
      organizationId,
    })
      .then((response) => {
        if (response) {
          toast.success('Session saved successfully');
          setOpen(false);
        } else {
          toast.error('Error Saving data');
        }
      })
      .catch(() => {
        toast.error('Error Saving data');
      })
      .finally(() => {
        setIsSavingSessions(false);
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:min-w-[600px] lg:min-w-[800px] ">
          <DialogTitle>Import Preview</DialogTitle>
          <p className="font-bold">Please confirm data before saving.</p>
          <div className="max-h-[400px] overflow-auto">
            {hasRooms && previewData?.stages && (
              <div>
                <h3 className="font-bold sticky py-2 top-0 mb-2 bg-background">
                  Stages (Rooms)
                  <span className="bg-primary ml-2 px-2 py-1 rounded-2xl text-sm font-normal text-white">
                    {previewData?.stages?.length ?? 0}
                  </span>
                </h3>
                {previewData?.stages?.length > 0 ? (
                  <div className="max-h-[400px] overflow-auto">
                    {previewData?.stages?.map((stage) => (
                      <div
                        key={stage?._id?.toString()}
                        className="bg-gray-100 my-2 p-2 rounded-lg"
                      >
                        {stage.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>no room found</p>
                )}
              </div>
            )}

            {previewData?.sessions && previewData?.sessions?.length > 0 ? (
              <div>
                <h3 className="font-bold sticky top-0 py-2 bg-background pr-2">
                  Sessions
                  <span className="bg-primary ml-2 px-2 py-1 rounded-2xl text-sm font-normal text-white">
                    {previewData?.sessions?.length ?? 0}
                  </span>
                </h3>
                <div className="overflow-auto">
                  {previewData?.sessions?.map((session) => (
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
              <div>
                <p className="text-xl mb-3">No Session found</p>
                <p className="">
                  {hasRooms ? (
                    'Please verify the link and try again'
                  ) : (
                    <p>
                      Please verify the link and ensure that the stage/room name
                      on the schedule matches{' '}
                      <span className="font-bold">{stage?.name}</span>
                    </p>
                  )}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant={'outline'}>
              Cancel
            </Button>
            {previewData?.sessions && previewData?.sessions?.length > 0 && (
              <Button
                onClick={() => {
                  handleSaveSessions();
                }}
                variant={'primary'}
                disabled={!previewData || !scheduleId}
                loading={isSavingSessions}
              >
                Save
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportPreviewDialog;
