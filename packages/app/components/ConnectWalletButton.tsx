import { ConnectKitButton } from 'connectkit'

interface ConnectWalletButtonProps {
  btnText?: string
}

export const ConnectWalletButton = ({
  btnText = 'Connect Wallet',
}: ConnectWalletButtonProps) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <div className="rounded-xl bg-gradient-to-b from-[#FF9976] to-[#6426EF] p-[2px]">
            <button
              onClick={show}
              className="text-blue text-sm font-ubuntu font-bold rounded-xl h-full w-full bg-white py-1 px-3">
              {isConnected ? ensName ?? truncatedAddress : btnText}
            </button>
          </div>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
