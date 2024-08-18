'use client';
import React, { useState, useCallback } from 'react';
import {
  useAccount,
  usePublicClient,
  useWriteContract,
  useSwitchChain,
} from 'wagmi';
import {
  createCreatorClient,
  makeMediaTokenMetadata,
  ContractMetadataJson,
} from '@zoralabs/protocol-sdk';
import { Button } from '../../../../components/ui/button';
import { ConnectWalletButton } from '../../../../components/misc/ConnectWalletButton';
import { toast } from 'sonner';
import { IExtendedSession } from '@/lib/types';
import { apiUrl } from '@/lib/utils/utils';
import { upload } from 'thirdweb/storage';

import { createThirdwebClient } from 'thirdweb';

interface ZoraUploadButtonProps {
  video: IExtendedSession;
  variant?: 'primary' | 'outline';
}

const BASE_CHAIN_ID = 8453; // Base chain ID

async function uploadToIPFS(content: string | object): Promise<string> {
  const client = createThirdwebClient({
    secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY!,
  });

  let file: File;

  if (typeof content === 'string') {
    // If content is a URL, fetch the file first
    const response = await fetch(content);
    const blob = await response.blob();
    file = new File([blob], 'file', { type: blob.type });
  } else {
    // If content is an object, convert it to JSON
    const jsonString = JSON.stringify(content);
    file = new File([jsonString], 'metadata.json', {
      type: 'application/json',
    });
  }

  const uri = await upload({ client, files: [file] });
  return uri;
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

const ZoraUploadButton: React.FC<ZoraUploadButtonProps> = ({
  video,
  variant = 'primary',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const { writeContract } = useWriteContract();
  const { switchChain } = useSwitchChain();

  const uploadToZora = useCallback(async () => {
    if (!publicClient || !address) return;

    setIsUploading(true);
    try {
      // Fetch the download URL
      const downloadUrl = await getDownloadUrl(video.assetId || '');

      // Upload cover image to IPFS
      const coverImageUri = await uploadToIPFS(video.coverImage || '');

      // Create token metadata
      const tokenMetadata = await makeMediaTokenMetadata({
        name: video.name,
        description: video.description,
        mediaUrl: downloadUrl,
        thumbnailUrl: coverImageUri,
      });

      // Upload token metadata to IPFS
      const tokenMetadataUri = await uploadToIPFS(tokenMetadata);

      // Switch to Base chain if not already on it
      if (BASE_CHAIN_ID !== (await publicClient.getChainId())) {
        switchChain({ chainId: BASE_CHAIN_ID });
      }

      const creatorClient = createCreatorClient({
        chainId: BASE_CHAIN_ID,
        publicClient,
      });

      // Create contract metadata
      const contractMetadata: ContractMetadataJson = {
        name: video.name,
        description: video.description,
        image: coverImageUri,
      };

      // Upload contract metadata to IPFS
      const contractMetadataUri = await uploadToIPFS(contractMetadata);

      const { parameters, contractAddress } = await creatorClient.create1155({
        contract: {
          name: video.name,
          uri: contractMetadataUri,
        },
        token: {
          tokenMetadataURI: tokenMetadataUri,
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
  }, [publicClient, address, video, writeContract, switchChain]);

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
