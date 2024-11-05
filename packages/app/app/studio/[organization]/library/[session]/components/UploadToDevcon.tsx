'use client';
import { Button } from '@/components/ui/button';
import { IExtendedOrganization, IExtendedSession } from '@/lib/types';
import { fetchSession } from '@/lib/services/sessionService';
import {
  generateThumbnailAction,
  updateAssetAction,
  updateSessionAction,
} from '@/lib/actions/sessions';
import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { ISession } from 'streameth-new-server/src/interfaces/session.interface';
import { apiUrl } from '@/lib/utils/utils';

// Constants
const DEVCON_UPLOAD_ENDPOINT = 'https://eo1kfhrnvr2m9md.m.pipedream.net';

// Helper functions
const getDownloadUrl = async (assetId: string): Promise<string> => {
  const response = await fetch(`${apiUrl()}/streams/asset/${assetId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch asset details');
  }

  const data = await response.json();
  return data.data.downloadUrl;
};

// const validateSession = (session: ISession | IExtendedSession) => {
//   const requiredFields = {
//     name: session.name,
//     description: session.description,
//     playbackId: session.playbackId,
//   };

//   const missingFields = Object.entries(requiredFields)
//     .filter(([_, value]) => !value)
//     .map(([key]) => key);

//   if (missingFields.length > 0) {
//     throw new Error(
//       `Missing required fields: ${missingFields.join(', ')}. Please fill in all required fields.`
//     );
//   }
// };

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
  published: true,
});

const prepareDevconPayload = async (
  session: ISession | IExtendedSession,
  thumbnail: string
) => {
  if (!session.playbackId) {
    throw new Error('Session playbackId is required');
  }

  const downloadUrl = await getDownloadUrl(
    session.assetId || session.playbackId
  );
  console.log('Download URL obtained:', downloadUrl);

  return {
    title: session.name,
    description: session.description,
    devcon_asset_id: 'PPJHYQ', // TODO: Fetch from markers
    thumbnail,
    video: downloadUrl,
    duration: session.playback?.duration || 0,
    sources_ipfsHash: '',
    sources_streamethId: session._id,
  };
};

interface UploadToDevconProps {
  // organization: IExtendedOrganization | null;
  // organizationSlug: string;
  sessionId: string;
}

const UploadToDevcon = ({
  // organization,
  // organizationSlug,
  sessionId,
}: UploadToDevconProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPublishStatus = useCallback(async () => {
    const session = await fetchSession({ session: sessionId });
    if (session?.published) {
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

      const thumbnail =
        session.coverImage || (await generateThumbnailAction(session));
      if (!thumbnail) {
        throw new Error('Failed to generate thumbnail');
      }

      const devconPayload = await prepareDevconPayload(session, thumbnail);

      console.log('Making request with payload:', devconPayload);

      const response = await fetch(DEVCON_UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PIPEDREAM_AUTH_TOKEN}`,
        },
        body: JSON.stringify(devconPayload),
      });

      const responseData = await response.json();

      // Handle Pipedream flow response
      if (responseData.status === 500) {
        console.error('Upload failed:', responseData.body.error);
        throw new Error(responseData.body.error || 'Upload failed');
      }

      if (!response.ok) {
        console.error(
          `Failed to upload to Devcon: ${response.status} ${response.statusText}`
        );
        throw new Error(
          `Failed to upload to Devcon: ${response.status} ${response.statusText}`
        );
      }

      await updateSessionAction({
        session: prepareSessionPayload(session),
      });

      toast.success('Successfully uploaded to Devcon!');
      setIsUploaded(true);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload to Devcon';
      console.error('Error in handleUploadToDevcon:', error);
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
    <div className="space-y-2">
      <Button onClick={handleUploadToDevcon} disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload to Devcon'}
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default UploadToDevcon;
