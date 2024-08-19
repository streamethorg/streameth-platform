'use client';

import { track } from '@vercel/analytics';
import { useState, useCallback, useEffect } from 'react';
import {
  useAccount,
  usePublicClient,
  useWriteContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import {
  createCreatorClient,
  makeMediaTokenMetadata,
  ContractMetadataJson,
} from '@zoralabs/protocol-sdk';
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '@/components/misc/ConnectWalletButton';
import { toast } from 'sonner';
import { IExtendedSession, IExtendedState } from '@/lib/types';
import { apiUrl } from '@/lib/utils/utils';
import { upload } from 'thirdweb/storage';
import { createThirdwebClient } from 'thirdweb';
import { createStateAction } from '@/lib/actions/state';
import { StateType } from 'streameth-new-server/src/interfaces/state.interface';
import useGenerateThumbnail from '@/lib/hooks/useGenerateThumbnail';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import Link from 'next/link';
import CopyText from '@/components/misc/CopyText';

const BASE_CHAIN_ID = 8453;

async function uploadToIPFS(content: string | object): Promise<string> {
  const client = createThirdwebClient({
    secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY!,
  });

  let file: File;

  if (typeof content === 'string') {
    const response = await fetch(content);
    const blob = await response.blob();
    file = new File([blob], 'file', { type: blob.type });
  } else {
    const jsonString = JSON.stringify(content);
    file = new File([jsonString], 'metadata.json', {
      type: 'application/json',
    });
  }

  return await upload({ client, files: [file] });
}

async function getDownloadUrl(assetId: string): Promise<string> {
  try {
    const response = await fetch(`${apiUrl()}/streams/asset/${assetId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch asset details');
    }
    const data = await response.json();
    return data.data.downloadUrl;
  } catch (error) {
    console.error('Error fetching download URL:', error);
    throw error;
  }
}

const ZoraUploadButton = ({
  session,
  state,
  variant = 'primary',
}: {
  session: IExtendedSession;
  state: IExtendedState[];
  variant?: 'primary' | 'outline';
}) => {
  const thumbnail = useGenerateThumbnail({ session });
  const [isUploading, setIsUploading] = useState(false);
  const publicClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract, isError } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const [isPublishedModal, setIsPublishedModal] = useState(false);
  const [zoraContractAddress, setZoraContractAddress] = useState('');
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const updateState = async () => {
    await createStateAction({
      state: {
        sessionId: session._id,
        type: 'nft' as StateType,
        sessionSlug: session.slug,
        organizationId: session.organizationId,
      },
    });
  };
  useEffect(() => {
    if (isSuccess) {
      updateState();
      setIsPublishedModal(true);
      setIsUploading(false);
      toast.success('Video successfully uploaded to Zora marketplace on Base');
    }

    if (isError) {
      setIsUploading(false);
      toast.error('Creation failed');
    }
  }, [isSuccess, isError]);

  const uploadToZora = useCallback(async () => {
    if (!publicClient || !address || !session.assetId) return;

    setIsUploading(true);
    try {
      const downloadUrl = await getDownloadUrl(session.assetId);
      const coverImageUri = await uploadToIPFS(
        session.coverImage || thumbnail || ''
      );
      const tokenMetadata = await makeMediaTokenMetadata({
        name: session.name,
        description: session.description,
        mediaUrl: downloadUrl,
        thumbnailUrl: coverImageUri,
      });
      console.log('coverImageUri', coverImageUri, 'thumbnailUrl', thumbnail);
      const tokenMetadataUri = await uploadToIPFS(tokenMetadata);

      if (BASE_CHAIN_ID !== (await publicClient.getChainId())) {
        switchChain({ chainId: BASE_CHAIN_ID });
      }

      const creatorClient = createCreatorClient({
        chainId: BASE_CHAIN_ID,
        publicClient,
      });

      const contractMetadata: ContractMetadataJson = {
        name: session.name,
        description: session.description,
        image: coverImageUri,
      };

      const contractMetadataUri = await uploadToIPFS(contractMetadata);
      const { parameters, contractAddress } = await creatorClient.create1155({
        contract: {
          name: session.name,
          uri: contractMetadataUri,
        },
        token: {
          tokenMetadataURI: tokenMetadataUri,
        },
        account: address,
      });

      writeContract(parameters);

      setZoraContractAddress(contractAddress);
      console.log('Upload successful. Contract address:', contractAddress);
    } catch (error) {
      console.error('Error uploading to Zora:', error);
      toast.error('Failed to upload video to Zora marketplace');
    } finally {
    }
  }, [publicClient, address, session, writeContract, switchChain]);

  if (!isConnected) {
    return <ConnectWalletButton />;
  }

  const isDisabled = isUploading || state?.length > 0;

  return (
    <>
      <Button
        onClick={() => {
          track('Upload to Zora', { location: 'Speaker Page' });
          uploadToZora();
        }}
        disabled={isDisabled}
        variant={variant}
      >
        {isUploading
          ? 'Uploading...'
          : !state[0]
            ? 'Upload to Zora'
            : 'Already Uploaded'}
      </Button>
      <Dialog open={isPublishedModal} onOpenChange={setIsPublishedModal}>
        <DialogContent className="lg:min-w-[600px]">
          <DialogTitle className="font-bold">
            Upload to Zora Completed
          </DialogTitle>
          <p>Video successfully published to Zora</p>
          <CopyText
            width="100%"
            label="Contract Address"
            text={zoraContractAddress}
          />

          <Link
            target="blank"
            rel="noopener noreferrer"
            href={`https://zora.co/collect/base:${zoraContractAddress}/1`}
            className="underline"
          >
            View on Zora
          </Link>
          <DialogFooter>
            <Button
              onClick={() => setIsPublishedModal(false)}
              variant={'outline'}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ZoraUploadButton;
