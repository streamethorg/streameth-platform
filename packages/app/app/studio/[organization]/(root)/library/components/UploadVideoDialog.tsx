'use client';

import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState, useEffect, useCallback } from 'react';
import { LuArrowLeft, LuFileUp } from 'react-icons/lu';
import Dropzone from './upload/Dropzone';
import UploadVideoForm from './upload/UploadVideoForm';
import * as z from 'zod';
import { sessionSchema } from '@/lib/schema';
import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import FeatureButton from '@/components/ui/feature-button';
import { AlertCircle, FileUp } from 'lucide-react';
import InjectUrlInput from './InjectUrlInput';
import { canUploadMoreVideos } from '@/lib/utils/subscription';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type UploadStatus = {
  progress: number;
  session: z.infer<typeof sessionSchema>;
  duration?: number;
};

export type Uploads = {
  [uploadId: string]: UploadStatus;
};

const UploadVideoDialog = ({
  variant = 'outline',
}: {
  variant?: ButtonProps['variant'];
}) => {
  const { canUseFeatures, organizationId, organization } = useOrganizationContext();

  const [open, setOpen] = useState(false);
  const [onEdit, setOnEdit] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Uploads>({});
  const [selectedOption, setSelectedOption] = useState<'upload' | 'url' | null>(
    null
  );
  const [pendingUpdate, setPendingUpdate] = useState<{
    uploadId: string;
    updatedSession: z.infer<typeof sessionSchema>;
  } | null>(null);
  const router = useRouter();

  // Check if user can upload more videos
  const uploadStatus = canUploadMoreVideos(organization);
  
  // Only lock if on free tier AND they've reached their limit
  const isFreeTierAtLimit = organization?.subscriptionTier === 'free' && (!uploadStatus.canUpload || uploadStatus.remaining <= 0);

  // Add debug info to console
  console.log('Upload button status:', {
    subscriptionTier: organization?.subscriptionTier,
    subscriptionStatus: organization?.subscriptionStatus,
    currentVideoCount: organization?.currentVideoCount,
    uploadStatus,
    isFreeTierAtLimit,
    canUseFeatures
  });

  const handleClick = (e: React.MouseEvent) => {
    if (!canUseFeatures) {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/studio/${organizationId}/payments`);
      return;
    }

    // If they've reached their limit, redirect to payments page instead
    if (!uploadStatus.canUpload) {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/studio/${organizationId}/settings/billing`);
      return;
    }

    setOpen(true);
  };

  const handleSessionUpdate = useCallback(
    (uploadId: string, updatedSession: z.infer<typeof sessionSchema>) => {
      setPendingUpdate({ uploadId, updatedSession });
    },
    []
  );

  useEffect(() => {
    if (pendingUpdate) {
      const { uploadId, updatedSession } = pendingUpdate;
      setUploads((prevUploads) => ({
        ...prevUploads,
        [uploadId]: {
          ...prevUploads[uploadId],
          session: {
            ...prevUploads[uploadId].session,
            ...updatedSession,
          },
        },
      }));

      setOnEdit(null);
      setOpen(false);
      setPendingUpdate(null);
    }
  }, [pendingUpdate]);

  useEffect(() => {
    if (!open) {
      setSelectedOption(null);
    }
  }, [open]);

  const getHeaderContent = () => {
    if (onEdit && uploads[onEdit]) {
      return {
        title: 'Edit Asset',
        description: 'Change details of the asset',
      };
    }

    if (selectedOption === 'upload') {
      return {
        title: 'Upload Video',
        description: 'Upload a video file from your computer',
      };
    }

    if (selectedOption === 'url') {
      return {
        title: 'Import from URL',
        description:
          'Import a video from youtube or X by providing the URL',
      };
    }

    return {
      title: 'Add Asset',
      description: 'Choose how to add a video to your library',
    };
  };

  const dialogContent =
    onEdit && uploads[onEdit] ? (
      <DialogContent className="bg-white sm:max-h-[800px] sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>Change details of the asset</DialogDescription>
        </DialogHeader>
        <Separator />
        <UploadVideoForm
          session={uploads[onEdit].session}
          onSessionUpdate={(updatedSession) =>
            handleSessionUpdate(onEdit, updatedSession)
          }
        />
      </DialogContent>
    ) : (
      <DialogContent className="bg-white sm:max-h-[800px] sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{getHeaderContent().title}</DialogTitle>
          <DialogDescription>
            {getHeaderContent().description}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        {/* Show warning if user is near their upload limit */}
        {uploadStatus.message && uploadStatus.remaining > 0 && selectedOption === null && (
          <Alert variant="destructive" className="mb-4 bg-amber-50 text-amber-700 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            <AlertDescription>
              {uploadStatus.message}
            </AlertDescription>
          </Alert>
        )}
        {/* Show error if user has reached their upload limit */}
        {!uploadStatus.canUpload && selectedOption === null && (
          <div className="mb-4">
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {uploadStatus.message || "You&apos;ve reached your upload limit. Please upgrade your subscription to upload more videos."}
              </AlertDescription>
            </Alert>
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => {
                setOpen(false);
                router.push(`/studio/${organizationId}/settings/billing`);
              }}
            >
              Upgrade Subscription
            </Button>
          </div>
        )}
        {!selectedOption ? (
          <div className="flex flex-col gap-4 p-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => setSelectedOption('upload')}
                    disabled={!uploadStatus.canUpload}
                  >
                    <LuFileUp className="w-6 h-6" />
                    <span>Upload Video File</span>
                  </Button>
                </TooltipTrigger>
                {!uploadStatus.canUpload && (
                  <TooltipContent>
                    <p>You&apos;ve reached your upload limit. Please upgrade your subscription.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => setSelectedOption('url')}
                    disabled={!uploadStatus.canUpload}
                  >
                    <FileUp className="w-6 h-6" />
                    <span>Import from URL</span>
                  </Button>
                </TooltipTrigger>
                {!uploadStatus.canUpload && (
                  <TooltipContent>
                    <p>You&apos;ve reached your upload limit. Please upgrade your subscription.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {selectedOption === 'upload' ? (
              <Dropzone
                setOnEdit={setOnEdit}
                setOpen={setOpen}
                uploads={uploads}
                setUploads={setUploads}
                organizationId={organizationId}
              />
            ) : (
              <InjectUrlInput />
            )}
          </div>
        )}
      </DialogContent>
    );

  if (!canUseFeatures) {
    return (
      <FeatureButton variant="outline" className="flex items-center gap-2">
        <FileUp className="w-5 h-5" />
        Upload Video
      </FeatureButton>
    );
  }

  // If they've reached their limit or are on free tier, show upgrade button
  if (!uploadStatus.canUpload || isFreeTierAtLimit) {
    return (
      <FeatureButton 
        variant={variant} 
        className="flex items-center gap-2 h-10"
        forceLockedState={true}
      >
        <LuFileUp className="w-5 h-5" />
        <span>Upload Video</span>
      </FeatureButton>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className="flex items-center gap-2 h-10"
          onClick={handleClick}
        >
          <LuFileUp className="w-5 h-5" />
          <span>Upload Video</span>
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};

export default UploadVideoDialog;
