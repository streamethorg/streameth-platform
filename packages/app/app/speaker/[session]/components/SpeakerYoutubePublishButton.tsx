'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { apiUrl } from '@/lib/utils/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { track } from '@vercel/analytics';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { SiYoutube } from 'react-icons/si';
import { toast } from 'sonner';

const SpeakerYoutubePublishButton = ({
  sessionId,
  refreshToken,
  openModal,
  thumbnail,
}: {
  sessionId: string;
  refreshToken: string;
  openModal: string;
  thumbnail: string;
}) => {
  const [open, setOpen] = useState(openModal === 'open' ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleTermChange } = useSearchParams();
  const state = encodeURIComponent(
    JSON.stringify({
      redirectUrl: `/speaker/${sessionId}`,
      organizationId: '',
    })
  );

  const handleModalClose = () => {
    setOpen(false);
    handleTermChange([
      {
        key: 'm',
        value: 'close',
      },
    ]);
  };

  const handleYoutubePublish = async () => {
    setIsLoading(true);
    track('Upload to YouTube', { location: 'Speaker Page' });
    try {
      const response = await fetch(`${apiUrl()}/sessions/upload`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'youtube',
          sessionId,
          refreshToken,
        }),
      });

      if (!response.ok) {
        return await response.json();
      }
      const responseData = await response.json();
      toast.success('Uploading video to your youtube account...');
      return responseData.status;
    } catch (error) {
      toast.error('Error uploading video to YouTube');
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button className="bg-[#FF0000]" onClick={() => setOpen(true)}>
          <SiYoutube className="mr-2" /> Publish to Youtube
        </Button>
        <DialogContent>
          <DialogTitle className="font-bold">
            Publish Video to Youtube{' '}
          </DialogTitle>
          {refreshToken ? (
            <div className="flex items-center pr-3">
              <Image
                src={thumbnail}
                className="p-1 mr-2 rounded-full"
                width={50}
                height={50}
                alt=""
              />
              <Link
                className="text-sm underline"
                href={`/api/google/request?state=${state}`}
              >
                Click to Reconnect
              </Link>
            </div>
          ) : (
            <div>
              <p className="mb-2">Connect Youtube Account before continuing </p>
              <div className="flex gap-4 items-center">
                <Button
                  onClick={handleModalClose}
                  className="w-full"
                  variant={'outline'}
                >
                  Cancel
                </Button>
                <Link
                  className="w-full"
                  href={`/api/google/request?state=${state}`}
                >
                  <Button className="w-full" variant={'primary'}>
                    Connect
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {refreshToken && (
            <div className="flex gap-4 items-center w-full">
              <Button
                onClick={handleModalClose}
                className="w-full"
                variant={'outline'}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="overflow-hidden w-full"
                onClick={handleYoutubePublish}
                loading={isLoading}
              >
                Publish
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpeakerYoutubePublishButton;
