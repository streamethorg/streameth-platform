'use client'
import { ConnectKitButton, useSIWE } from 'connectkit'
import { Button } from '@/components/ui/button'
interface ConnectWalletButtonProps {
  className?: string
  btnText?: string
}

export const ConnectWalletButton = ({
  btnText = 'Connect Wallet',
  className,
}: ConnectWalletButtonProps) => {
  const { isSignedIn } = useSIWE()

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <Button onClick={show} className={className}>
            {isConnected && !isSignedIn
              ? 'Sign In'
              : isConnected
                ? ensName ?? truncatedAddress
                : btnText}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
