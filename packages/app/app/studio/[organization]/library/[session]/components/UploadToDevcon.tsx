'use client';
import { Button } from '@/components/ui/button';
import { IExtendedSession } from '@/lib/types';
import { fetchSession } from '@/lib/services/sessionService';
import { updateSessionAction } from '@/lib/actions/sessions';
import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  eVisibilty,
  ISession,
} from 'streameth-new-server/src/interfaces/session.interface';
import { apiUrl } from '@/lib/utils/utils';

// Helper functions
const getDownloadUrl = async (assetId: string): Promise<string> => {
  const response = await fetch(`${apiUrl()}/streams/asset/${assetId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch asset details');
  }

  const data = await response.json();
  return data.data.downloadUrl;
};

const prepareSessionPayload = (session: ISession | IExtendedSession) => ({
  _id: session._id?.toString() ?? '',
  name: session.name,
  description: session.description,
  organizationId: session.organizationId,
  eventId: session.eventId,
  stageId: session.stageId,
  start: session.start ?? Number(new Date()),
  end: session.end ?? Number(new Date()),
  speakers: session.speakers ?? [],
  type: session.type ?? 'video',
  published: 'public' as eVisibilty,
});

const prepareDevconPayload = async (session: ISession | IExtendedSession) => {
  if (!session.playbackId) {
    throw new Error('Session playbackId is required');
  }

  const downloadUrl = await getDownloadUrl(
    session.assetId || session.playbackId
  );

  return {
    title: session.name || 'No title provided',
    description: session.description || 'No description provided',
    devcon_asset_id: session.pretalxSessionCode || 'No session code provided',
    video: downloadUrl || 'No download URL provided',
    duration: session.playback?.duration || 0,
    sources_ipfsHash: '',
    sources_streamethId: session._id || 'No session ID provided',
  };
};

interface UploadToDevconProps {
  sessionId: string;
  organizationSlug: string;
}

const UploadToDevcon = ({
  sessionId,
  organizationSlug,
}: UploadToDevconProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPublishStatus = useCallback(async () => {
    const session = await fetchSession({ session: sessionId });
    if (session?.published === 'public') {
      setIsUploaded(true);
    }
  }, [sessionId]);

  useEffect(() => {
    checkPublishStatus();
  }, [checkPublishStatus]);

  const handleUploadToDevcon = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await fetchSession({ session: sessionId });
      if (!session) {
        throw new Error('Session not found');
      }

      const devconPayload = await prepareDevconPayload(session);

      const response = await fetch('/api/pipedream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devconPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload to Devcon');
      } else {
        await updateSessionAction({
          session: prepareSessionPayload(session),
        });
        toast.success('Successfully uploaded to Devcon!');
        setIsUploaded(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload to Devcon';
      console.error('Upload Error:', error);
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
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
    <>
      {organizationSlug === 'devcon_7_sea' && (
        <>
          <Button
            onClick={async () => await handleUploadToDevcon()}
            disabled={isLoading}
            variant={error ? 'outline' : 'default'}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Uploading...
              </span>
            ) : error ? (
              <span className="flex items-center gap-2">❌ Upload Failed</span>
            ) : (
              'Upload to Devcon'
            )}
          </Button>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md border border-red-200">
              <p className="font-semibold">Upload Error:</p>
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default UploadToDevcon;
