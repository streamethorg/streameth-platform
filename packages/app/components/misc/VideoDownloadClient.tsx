'use client';

import { Button } from '@/components/ui/button';
import { LuDownload } from 'react-icons/lu';
import { toast } from 'sonner';
import { apiUrl, cn } from '@/lib/utils/utils';
import { useState } from 'react';

const VideoDownloadClient = ({
  videoName,
  assetId,
  variant,
  className,
  collapsable = false,
}: {
  videoName: string;
  assetId?: string;
  variant?:
    | 'primary'
    | 'default'
    | 'destructive'
    | 'destructive-outline'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'green'
    | 'link';
  className?: string;
  collapsable?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  if (!assetId) {
    return null;
  }
  const fetchDownloadUrl = async (assetId: string) => {
    const response = await fetch(`${apiUrl()}/streams/asset/${assetId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch asset details');
    }

    return (await response.json()).data;
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const object = await fetchDownloadUrl(assetId);

      console.log(object.downloadUrl);

      const link = document.createElement('a');
      link.href = object.downloadUrl;
      link.setAttribute('download', videoName);

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      toast.success('Download started');
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error('Failed to download video');
    }
  };

  return (
    <Button
      disabled={loading}
      onClick={handleDownload}
      variant={variant}
      className={className}
    >
      <LuDownload size={24} className="p-1" />
      <p className={cn(collapsable && 'flex')}>
        {loading ? 'Downloading...' : 'Download'}
      </p>
    </Button>
  );
};

export default VideoDownloadClient;
