'use client'
import { ConnectKitButton, useSIWE } from 'connectkit'
import { Button } from '@/components/ui/button'
interface ConnectWalletButtonProps {
  btnText?: string
}

export const ConnectWalletButton = ({
  btnText = 'Connect Wallet',
}: ConnectWalletButtonProps) => {
  const { isSignedIn } = useSIWE()

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <Button onClick={show} className="">
            {isConnected
              ? ensName ?? truncatedAddress
              : 'Connect Wallet'}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
