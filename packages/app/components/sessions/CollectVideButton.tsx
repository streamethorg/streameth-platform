'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { IExtendedNftCollections, IExtendedSession } from '@/lib/types';
import {
  useAccount,
  useChainId,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
  usePublicClient,
} from 'wagmi';
import { VideoNFTAbi, contractChainID } from '@/lib/contract';
import { toast } from 'sonner';
import { calMintPrice, getVideoIndex } from '@/lib/utils/utils';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { type BaseError } from 'wagmi';
import TransactionHash from '@/app/studio/[organization]/nfts/create/components/TransactionHash';
import { ConnectWalletButton } from '../misc/ConnectWalletButton';
import { createCreatorClient } from '@zoralabs/protocol-sdk';
import { zora } from 'viem/chains';

const CollectVideButton = ({
  video,
  nftCollection,
  variant = 'primary',
  all = false,
  standalone = false,
}: {
  video?: IExtendedSession;
  nftCollection: IExtendedNftCollections | null;
  variant?: 'primary' | 'outline';
  all?: boolean;
  standalone?: boolean;
}) => {
  const account = useAccount();
  const chain = useChainId();
  const publicClient = usePublicClient();
  const [isOpen, setIsOpen] = useState(false);
  const [mintError, setMintError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false);

  const videoNFTContract = {
    address: nftCollection?.contractAddress as `0x${string}`,
    abi: VideoNFTAbi,
    chainId: contractChainID,
  } as const;

  const { switchChainAsync, isPending: IsSwitchingChain } = useSwitchChain();

  const result = useReadContracts({
    contracts: [
      {
        ...videoNFTContract,
        functionName: 'mintFee',
      },
      {
        ...videoNFTContract,
        functionName: 'baseFee',
      },
      {
        ...videoNFTContract,
        functionName: 'sessionMinted',
        args: [
          account?.address as `Ox${string}`,
          getVideoIndex(all, nftCollection!, video),
        ],
      },
    ],
  });

  const hasMintedSession = result.data?.[2].result;

  const {
    data: hash,
    writeContract,
    error,
    isError,
    isPending: isMintingNftPending,
  } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      toast.success('NFT of the video successfully minted to your wallet');
      setShowUploadButton(true);
    }
    if (isError) {
      toast.error('NFT of the video failed to mint. Please try again');
    }
  }, [isSuccess, isError, error]);

  const handleWriteContract = () => {
    setMintError('');
    if (result?.data?.[0].status === 'success' && nftCollection) {
      writeContract({
        abi: VideoNFTAbi,
        address: nftCollection?.contractAddress as `0x${string}`,
        functionName: 'sessionMint',
        args: [getVideoIndex(all, nftCollection, video)],
        value: BigInt(
          calMintPrice(
            result?.data as { result: BigInt }[],
            true,
            nftCollection
          ) as string
        ),
      });
    } else {
      setMintError('An error occurred, try again later please');
    }
  };

  const mintCollection = () => {
    setMintError('');
    setIsOpen(true);
    if (chain !== contractChainID) {
      switchChainAsync(
        { chainId: contractChainID },
        {
          onSuccess: () => {
            handleWriteContract();
          },
          onError: () => {
            setMintError('Error switching chain');
          },
        }
      );
    } else {
      handleWriteContract();
    }
  };

  const uploadToZora = useCallback(async () => {
    if (!publicClient || !account.address) return;

    setIsUploading(true);
    try {
      const creatorClient = createCreatorClient({
        chainId: zora.id,
        publicClient,
      });

      const { parameters, contractAddress } = await creatorClient.create1155({
        contract: {
          name: video?.name || 'Video NFT',
          uri: 'ipfs://DUMMY/contract.json', // Replace with actual contract metadata URI
        },
        token: {
          tokenMetadataURI: 'ipfs://DUMMY/token.json', // Replace with actual token metadata URI
          salesConfig: {
            erc20Name: video?.name || 'Video Token',
            erc20Symbol: 'VNFT',
          },
        },
        account: account.address,
      });

      writeContract(parameters);

      toast.success('Session successfully uploaded to Zora marketplace');
      setShowUploadButton(false);
    } catch (error) {
      console.error('Error uploading to Zora:', error);
      toast.error('Failed to upload session to Zora marketplace');
    } finally {
      setIsUploading(false);
    }
  }, [publicClient, account.address, video, writeContract]);

  useEffect(() => {
    if (account.isConnected && standalone) {
      toast.success('Wallet connected successfully');
      setShowUploadButton(true);
    }
  }, [account.isConnected, standalone]);

  if (standalone) {
    return (
      <div>
        {!account.isConnected ? (
          <ConnectWalletButton />
        ) : showUploadButton ? (
          <Button
            onClick={uploadToZora}
            loading={isUploading}
            variant={variant}
            className="w-full md:w-36"
          >
            Upload to Zora
          </Button>
        ) : (
          <Button disabled variant="outline">
            Uploaded to Zora
          </Button>
        )}
      </div>
    );
  }

  return hasMintedSession ? (
    <Button disabled variant={'outline'}>
      Session Collected
    </Button>
  ) : (
    <div>
      {!account.address ? (
        <ConnectWalletButton />
      ) : showUploadButton ? (
        <Button
          onClick={uploadToZora}
          loading={isUploading}
          variant={variant}
          className="w-full md:w-36"
        >
          Upload to Zora
        </Button>
      ) : (
        <Button
          loading={isMintingNftPending || IsSwitchingChain}
          onClick={mintCollection}
          variant={variant}
          className="w-full md:w-36"
        >
          {all ? 'Collect All Videos' : 'Collect Video'}
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>
            {isError || mintError
              ? 'Error'
              : hash
                ? 'Transaction Approved'
                : 'Approve transaction'}
          </DialogTitle>

          {mintError || error ? (
            <div className="text-center text-destructive">
              {mintError || (error as BaseError).shortMessage || error?.message}
            </div>
          ) : hash ? (
            <TransactionHash hash={hash} />
          ) : (
            <div className="flex items-center gap-2">
              <div className="mr-2 h-fit rounded-full bg-grey p-2">
                {isMintingNftPending || IsSwitchingChain ? (
                  <Loader2 className="h-6 w-6 animate-spin rounded-full text-success" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 fill-success text-white" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  Go to your wallet to approve the transaction
                </p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll be asked to pay gas fees plus mint fee to collect
                  video on the blockchain.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectVideButton;
