'use client';
import { ConnectKitButton } from 'connectkit';
import { Button } from '@/components/ui/button';
interface ConnectWalletButtonProps {
  className?: string;
  btnText?: string;
}

export const ConnectWalletButton = ({
  btnText = 'Connect Wallet',
  className,
}: ConnectWalletButtonProps) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <Button variant={'primary'} onClick={show} className={className}>
            <span className="px-2 md:px-0">
              {isConnected ? ensName ?? truncatedAddress : btnText}
            </span>
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
