'use client';

import { track } from '@vercel/analytics';
import { useState, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '@/components/misc/ConnectWalletButton';
import { toast } from 'sonner';
import { IExtendedSession, IExtendedState } from '@/lib/types';
import { apiUrl } from '@/lib/utils/utils';
import { upload } from 'thirdweb/storage';
import { createThirdwebClient } from 'thirdweb';
import { createStateAction } from '@/lib/actions/state';
import { StateType } from 'streameth-new-server/src/interfaces/state.interface';

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
  state: IExtendedState | null;
  variant?: 'primary' | 'outline';
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const publicClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const { switchChain } = useSwitchChain();

  const uploadToZora = useCallback(async () => {
    if (!publicClient || !address || !session.assetId) return;

    track('Upload to Zora', { location: 'Speaker Page' });
    setIsUploading(true);
    try {
      const downloadUrl = await getDownloadUrl(session.assetId);
      const coverImageUri = await uploadToIPFS(session.coverImage || '');
      const tokenMetadata = await makeMediaTokenMetadata({
        name: session.name,
        description: session.description,
        mediaUrl: downloadUrl,
        thumbnailUrl: coverImageUri,
      });

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

      await createStateAction({
        state: {
          sessionId: session._id,
          type: StateType.zoraNft,
          sessionSlug: session.slug,
          organizationId: session.organizationId,
        },
      });
      console.log('Upload successful. Contract address:', contractAddress);
      toast.success('Video successfully uploaded to Zora marketplace on Base');
    } catch (error) {
      console.error('Error uploading to Zora:', error);
      toast.error('Failed to upload video to Zora marketplace');
    } finally {
      setIsUploading(false);
    }
  }, [publicClient, address, session, writeContract, switchChain]);

  if (!isConnected) {
    return <ConnectWalletButton />;
  }

  const isDisabled = isUploading || !state;

  return (
    <Button onClick={uploadToZora} disabled={isDisabled} variant={variant}>
      {isUploading
        ? 'Uploading...'
        : state
          ? 'Upload to Zora'
          : 'Already Uploaded'}
    </Button>
  );
};

export default ZoraUploadButton;
