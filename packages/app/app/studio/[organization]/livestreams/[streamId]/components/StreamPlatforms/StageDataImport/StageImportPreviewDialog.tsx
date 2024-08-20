'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import { IScheduleImportMetadata } from 'streameth-new-server/src/interfaces/schedule-importer.interface';

const StageImportPreviewDialog = ({
  previewData,
  open,
  onClose,
  hasRooms = false,
}: {
  previewData?: IScheduleImportMetadata;
  open: boolean;
  onClose: (open: boolean) => void;
  hasRooms?: boolean;
}) => {
  const [isSavingSessions, setIsSavingSessions] = useState(false);
  // TODO:Coming soon when save endpoint is implemented
  const handleSaveSessions = async () => {};

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
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
              <p>no Session found</p>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => onClose(false)} variant={'outline'}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSaveSessions();
              }}
              variant={'primary'}
              disabled={!previewData}
              loading={isSavingSessions}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="flex flex-column items-center justify-center">
          <LiaCheckCircleSolid size={40} /> <p>Data Imported successfully.</p>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default StageImportPreviewDialog;
