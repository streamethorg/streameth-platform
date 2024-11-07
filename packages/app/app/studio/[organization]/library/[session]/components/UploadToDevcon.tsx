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
  console.log('Download URL obtained:', downloadUrl);

  return {
    title: session.name,
    description: session.description,
    devcon_asset_id: 'PPJHYQ', // TODO: Fetch from markers
    // video: downloadUrl, // TODO: replace hardcoded url
    video:
      'https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/7bee0oy6uo8fdi5a/video/download.mp4',
    duration: session.playback?.duration || 0,
    sources_ipfsHash: '',
    sources_streamethId: session._id,
  };
};

interface UploadToDevconProps {
  sessionId: string;
}

const UploadToDevcon = ({ sessionId }: UploadToDevconProps) => {
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
      console.log('Making request with payload:', devconPayload);

      const response = await fetch(DEVCON_UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PIPEDREAM_AUTH_TOKEN}`,
        },
        body: JSON.stringify(devconPayload),
      });

      const responseText = await response.text();
      console.log('Raw Pipedream Response:', responseText);

      let responseData;
      if (responseText.trim()) {
        try {
          responseData = JSON.parse(responseText);

          // Log each node's response
          if (responseData.steps) {
            console.log('Upload Video Step:', responseData.steps.upload_video);
            console.log(
              'Upload Video Response:',
              responseData.steps.upload_video_response
            );
            console.log(
              'Upload Thumbnail:',
              responseData.steps.upload_thumbnail
            );
            console.log(
              'Upload Thumbnail Response:',
              responseData.steps.upload_thumbnail_response
            );
            console.log('Devcon API Response:', responseData.steps.Devcon_API);
            console.log(
              'Upload to Devcon Response:',
              responseData.steps.upload_to_devcon_response
            );
          }

          // Handle error responses
          if (responseData.status === 500) {
            throw new Error(
              responseData.body?.error || 'Upload failed with server error'
            );
          }
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          throw new Error(`Invalid JSON response: ${responseText}`);
        }
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
