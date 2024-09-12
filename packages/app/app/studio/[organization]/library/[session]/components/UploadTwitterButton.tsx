'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SiX } from 'react-icons/si';
import { IExtendedOrganization } from '@/lib/types';
import { uploadSessionToSocialsAction } from '@/lib/actions/sessions';
import { toast } from 'sonner';
import { CiCirclePlus } from 'react-icons/ci';

const UploadTwitterButton = ({
  organization,
  sessionId,
  organizationSlug,
}: {
  organization: IExtendedOrganization | null;
  organizationSlug: string;
  sessionId: string;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [socialId, setSocialId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTwitterConnect = () => {
    const state = encodeURIComponent(
      JSON.stringify({
        redirectUrl: `/studio/${organizationSlug}/library/${sessionId}`,
        organizationId: organization?._id,
      })
    );
    // Encode the redirect URL
    const authUrl = `/api/twitter/request?state=${state}`;

    // Open the OAuth URL in a new window
    window.location.href = authUrl;
  };
  const hasSocials = organization?.socials?.length
    ? organization?.socials?.length > 0
    : false;

  const handleTwitterPublish = async () => {
    setIsLoading(true);
    try {
      const response = await uploadSessionToSocialsAction({
        type: 'twitter',
        sessionId,
        organizationId: organization?._id as string,
        socialId,
      });

      if (response.message) {
        toast.error('Error: ' + response.message);
      } else {
        toast.success('Publish request successful');
      }
    } catch (error) {
      toast.error('Error uploading video to Twitter');
    } finally {
      setIsLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger>
        <Button className="min-w-[200px] bg-[#121212]">
          <SiX className="mr-2" /> Publish to X
        </Button>
      </DialogTrigger>
      <DialogContent className="px-8 z-[99999999999999999]">
        <p className="font-medium">Select Twitter Destination</p>

        <div className="flex flex-wrap gap-5 items-center py-5">
          {organization?.socials
            ?.filter((s) => s.type == 'twitter')
            .map(({ name, thumbnail, _id }) => (
              <div
                onClick={() => setSocialId(_id!)}
                key={_id}
                className={`flex cursor-pointer flex-col items-center ${
                  socialId == _id ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className="w-14 h-14 bg-center bg-cover rounded-full cursor-pointer"
                  style={{
                    backgroundImage: `url(${thumbnail})`,
                  }}
                ></div>
                <p className="text-sm line-clamp-1">{name}</p>
              </div>
            ))}
          <div
            onClick={handleTwitterConnect}
            className="flex flex-col items-center cursor-pointer"
          >
            <CiCirclePlus color="#000" size={56} />
            <p className="text-sm">Add New</p>
          </div>
        </div>

        <Button
          loading={isLoading}
          onClick={handleTwitterPublish}
          variant="primary"
          disabled={!hasSocials || !socialId}
        >
          Publish
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadTwitterButton;
