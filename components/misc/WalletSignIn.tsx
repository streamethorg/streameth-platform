import { ConnectButton } from '@rainbow-me/rainbowkit'

const SignIn = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}>
            {(() => {
              if (!connected) {
                return (
                  <button className="w-full" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                )
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                )
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={openChainModal} style={{ display: 'flex', alignItems: 'center' }} type="button">
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}>
                        {chain.iconUrl && <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 12, height: 12 }} />}
                      </div>
                    )}
                    <span className="hidden lg:inline">{chain.name}</span>
                  </button>
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    <span className="hidden lg:inline">{account.displayBalance ? ` (${account.displayBalance})` : ''}</span>
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export const WalletSignIn = () => (
  <div className="ml-2 relative border rounded border-accent bg-white hover:shadow-md shadow-slate-500 px-5 py-2 text-sm font-medium text-accent">
    {/* <span className="absolute  bg-gray-300 hover:bg-white text-sm font-medium text-black h-full w-[90%] -z-20" /> */}
    <SignIn />
  </div>
)

export default WalletSignIn
