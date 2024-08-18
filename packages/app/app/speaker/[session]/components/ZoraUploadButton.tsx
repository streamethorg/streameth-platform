'use client';
import React, { useState, useCallback } from 'react';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
} from 'wagmi';
import { createCreatorClient } from '@zoralabs/protocol-sdk';
import { zora } from 'viem/chains';
import { Button } from '../../../../components/ui/button';
import { ConnectWalletButton } from '../../../../components/misc/ConnectWalletButton';
import { toast } from 'sonner';
import { IExtendedSession } from '@/lib/types';

interface ZoraUploadButtonProps {
  video: IExtendedSession;
  variant?: 'primary' | 'outline';
}

const BASE_CHAIN_ID = 8453; // Base chain ID

const ZoraUploadButton: React.FC<ZoraUploadButtonProps> = ({
  video,
  variant = 'primary',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const { writeContract } = useWriteContract();

  const uploadToZora = useCallback(async () => {
    if (!publicClient || !address) return;

    setIsUploading(true);
    try {
      const creatorClient = createCreatorClient({
        chainId: BASE_CHAIN_ID,
        publicClient,
      });

      const { parameters, contractAddress } = await creatorClient.create1155({
        contract: {
          name: video.name || 'Video NFT',
          uri: 'ipfs://DUMMY/contract.json', // Replace with actual contract metadata URI
        },
        token: {
          tokenMetadataURI: video.coverImage || 'ipfs://DUMMY/token.json', // Use video cover image as token metadata URI
        },
        account: address,
      });

      writeContract(parameters);

      console.log('Upload successful. Contract address:', contractAddress);
      toast.success('Video successfully uploaded to Zora marketplace on Base');
    } catch (error) {
      console.error('Error uploading to Zora:', error);
      toast.error('Failed to upload video to Zora marketplace');
    } finally {
      setIsUploading(false);
    }
  }, [publicClient, address, video, writeContract]);

  if (!isConnected) {
    return <ConnectWalletButton />;
  }

  return (
    <Button onClick={uploadToZora} disabled={isUploading} variant={variant}>
      {isUploading ? 'Uploading...' : 'Upload to Zora on Base'}
    </Button>
  );
};

export default ZoraUploadButton;
