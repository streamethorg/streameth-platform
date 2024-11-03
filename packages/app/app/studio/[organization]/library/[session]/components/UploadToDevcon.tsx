'use client';
import { Button } from '@/components/ui/button';
import { IExtendedOrganization } from '@/lib/types';
import { fetchSession } from '@/lib/services/sessionService';
import { updateSessionAction } from '@/lib/actions/sessions';
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const handleUploadToDevcon = async (sessionId: string) => {
  try {
    const session = await fetchSession({ session: sessionId });

    if (!session) {
      throw new Error('Session not found');
    }

    const payload = {
      title: session.name,
      description: session.description,
      sources_ipfsHash: session.ipfsURI || '',
      sources_youtubeId: session.videoUrl || '',
      sources_swarmHash: session.videoUrl || '',
      sources_livepeerId: session.playbackId || '',
      duration: session.playback?.duration || 0,
    };

    const response = await fetch('https://eovao4e5e2kvm45.m.pipedream.net', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Devcon');
    }

    await updateSessionAction({
      session: {
        _id: session._id,
        name: session.name,
        description: session.description,
        organizationId: session.organizationId,
        eventId: session.eventId,
        stageId: session.stageId,
        start: session.start ?? Number(new Date()),
        end: session.end ?? Number(new Date()),
        speakers: session.speakers ?? [],
        type: session.type ?? 'video',
        // TODO: Change this once we have a proper field to check if the session has been uploaded to Devcon
        published: true,
      },
    });

    toast.success('Successfully uploaded to Devcon!');
    return true;
  } catch (error) {
    console.error('Error uploading to Devcon:', error);
    toast.error('Failed to upload to Devcon. Please try again.');
    return false;
  }
};

const UploadToDevcon = ({
  organization,
  organizationSlug,
  sessionId,
}: {
  organization: IExtendedOrganization | null;
  organizationSlug: string;
  sessionId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  // Check if session is already published when component mounts
  useEffect(() => {
    const checkPublishStatus = async () => {
      const session = await fetchSession({ session: sessionId });
      if (session?.published) {
        setIsUploaded(true);
      }
    };

    checkPublishStatus();
  }, [sessionId]);

  const onClick = async () => {
    setIsLoading(true);
    try {
      const success = await handleUploadToDevcon(sessionId);
      if (success) {
        setIsUploaded(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isUploaded) {
    return (
      <Button disabled className="space-x-2">
        <Check className="h-4 w-4 text-green-500" />
        <span>Uploaded to Devcon</span>
      </Button>
    );
  }

  return (
    <Button onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Uploading...' : 'Upload to Devcon'}
    </Button>
  );
};

export default UploadToDevcon;
