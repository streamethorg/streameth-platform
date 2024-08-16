'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import { ISession } from 'streameth-new-server/src/interfaces/session.interface';

const StageImportPreviewDialog = ({
  previewData,
  open,
  onClose,
}: {
  previewData: ISession[];
  open: boolean;
  onClose: (open: boolean) => void;
}) => {
  const [isSavingSessions, setIsSavingSessions] = useState(false);
  // TODO:Coming soon when save endpoint is implemented
  const handleSaveSessions = async () => {};

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="md:min-w-[600px] lg:min-w-[800px]">
          <DialogTitle>Import Preview</DialogTitle>
          <p className="font-bold">Please confirm data before saving.</p>

          {previewData.length > 0 ? (
            <div className="max-h-[400px] overflow-auto">
              {previewData?.map((session) => (
                <div
                  key={session?._id?.toString()}
                  className="bg-gray-100 my-2 p-2 rounded-lg"
                >
                  {session.name}
                </div>
              ))}
            </div>
          ) : (
            <p>no data found</p>
          )}

          <div className="flex justify-between items-center">
            <p className="font-semibold">Total Items: {previewData?.length}</p>

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
          </div>
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
