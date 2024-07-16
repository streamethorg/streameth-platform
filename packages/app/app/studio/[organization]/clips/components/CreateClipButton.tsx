'use client';
import React from 'react';
import { createClipAction, createSessionAction } from '@/lib/actions/sessions';
import { Button } from '@/components/ui/button';
import { useClipContext } from './ClipContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ISession,
  SessionType,
} from 'streameth-new-server/src/interfaces/session.interface';
import {
  IExtendedOrganization,
  IExtendedSession,
  IExtendedStage,
} from '@/lib/types';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Combobox from '@/components/ui/combo-box';

const ClipButton = ({
  playbackId,
  selectedRecording,
  stageId,
  organizationId,
  sessions,
  custom,
  setDialogOpen,
}: {
  playbackId: string;
  selectedRecording: string;
  stageId?: string;
  organizationId: string;
  sessions: IExtendedSession[];
  custom?: boolean;
  setDialogOpen: (value: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const { startTime, endTime } = useClipContext();
  const [sessionId, setSessionId] = React.useState('');
  const { handleTermChange } = useSearchParams();
  const handleCreateClip = async () => {
    let customSession: ISession = {
      name,
      description: 'Clip',
      start: new Date().getTime(),
      end: new Date().getTime(),
      stageId,
      organizationId,
      speakers: [],
      type: SessionType['clip'],
    };
    if (custom) {
      customSession = await createSessionAction({
        session: { ...customSession },
      });
    }

    const session = custom
      ? customSession
      : sessions.find((s) => s._id === sessionId);

    if (!endTime || !startTime || startTime < endTime) {
      toast.error('Start time must be earlier than end time.');
      return;
    }

    if (!selectedRecording) {
      toast.error('No recording selected.');
      return;
    }

    if (!session) {
      toast.error('Session information is missing.');
      return;
    }

    setIsLoading(true);
    createClipAction({
      playbackId,
      recordingId: selectedRecording,
      start: startTime.unix,
      end: endTime.unix,
      sessionId: session._id as string,
    })
      .then(() => {
        setIsLoading(false);
        setSessionId('');
        setDialogOpen(false);
        toast.success('Clip created');
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('Error creating clip');
      })
      .finally(() => {
        handleTermChange([
          {
            key: 'previewId',
            value: session._id as string,
          },
        ]);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-grow flex-col space-y-2">
      <div className="my-4 flex flex-grow flex-col space-y-2">
        <Label>{custom ? 'Session name' : 'Select Session'}</Label>
        {custom ? (
          <Input
            id="session-name"
            className="z-[999999] bg-white"
            placeholder="Enter session name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <Combobox
            value={sessions.find((s) => s._id === sessionId)?.name || ''}
            setValue={(value) => setSessionId(value)}
            placeholder="Select a session"
            items={[
              ...sessions.map((session) => ({
                label: session.name,
                value: session._id,
              })),
            ]}
          />
        )}
      </div>
      <Button
        disabled={
          isLoading ||
          !selectedRecording ||
          !startTime ||
          !endTime ||
          (custom ? !name : !sessionId)
        }
        onClick={handleCreateClip}
        variant="outlinePrimary"
        className="mt-auto text-base"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </>
        ) : (
          'Create clip'
        )}
      </Button>
    </div>
  );
};

const CreateClipButton = ({
  currentRecording,
  organization,
  currentStage,
  sessions,
  playbackId,
}: {
  currentRecording: string;
  organization: IExtendedOrganization;
  playbackId: string;
  currentStage: IExtendedStage;
  sessions: {
    sessions: IExtendedSession[];
  };
}) => {
  const { isLoading } = useClipContext();
  const [dialogOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white">
        <div className="flex h-[300px] flex-col bg-white p-4">
          <Tabs defaultValue={'sessions'}>
            <TabsList className="border-grey w-full !justify-start gap-5 border-y">
              {sessions.sessions.length > 0 && (
                <TabsTrigger className="px-0" value="sessions">
                  Clip Session
                </TabsTrigger>
              )}
              <TabsTrigger value="custom">Create Custom Clip</TabsTrigger>
            </TabsList>
            {sessions.sessions.length > 0 && (
              <TabsContent value="sessions">
                <div className="flex w-full flex-row items-center justify-center space-x-2">
                  <ClipButton
                    selectedRecording={currentRecording}
                    playbackId={playbackId}
                    stageId={currentStage?._id}
                    organizationId={organization._id as string}
                    sessions={sessions.sessions}
                    setDialogOpen={setIsOpen}
                  />
                </div>
              </TabsContent>
            )}
            <TabsContent value="custom">
              <div className="flex w-full flex-row items-center justify-center space-x-2">
                <ClipButton
                  selectedRecording={currentRecording}
                  playbackId={playbackId}
                  stageId={currentStage?._id}
                  organizationId={organization._id as string}
                  sessions={sessions.sessions}
                  custom
                  setDialogOpen={setIsOpen}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outlinePrimary"
        className="w-full"
        disabled={isLoading}
      >
        Create Clip
      </Button>
    </Dialog>
  );
};

export default CreateClipButton;
