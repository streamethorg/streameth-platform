import 'dm3-billboard-widget/dist/style.css'
import 'dm3-billboard-widget/dist/styles/classic.css'
import './dm3.css'
import { useContext, useMemo, useState } from 'react'
import {
  useAccount,
  useConnect,
  usePublicClient,
  useSignMessage,
} from 'wagmi'

import {
  BillboardWidgetProps,
  ClientProps,
  Dm3Widget,
} from 'dm3-billboard-widget'
import { ethers } from 'ethersv5'
import { SiweMessage } from 'siwe'
import { StageContext } from './StageContext'

export const defaultOptions: BillboardWidgetProps['options'] = {
  avatarSrc: (hash) => {
    return `https://robohash.org/${hash}?size=38x38`
  },
  className: 'dm3-billboard-widget',
}

const defaultClientProps: Omit<
  ClientProps,
  'siweAddress' | 'siweSig' | 'siweMessage'
> = {
  mockedApi: false,
  billboardId: 'billboard1.bb.dm3.eth',
  billboardClientUrl: 'http://104.248.249.53/bb-client',
  deliveryServiceEnsName: 'bb-ds.dm3.eth',
  offchainResolverUrl: 'http://104.248.249.53/resolver-handler',
}

export const Dm3 = () => {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { connect } = useConnect()

  const [siweSig, setSiweSig] = useState<string>()
  const [siweMessage, setSiweMessage] = useState<SiweMessage>()
  const publicClient = usePublicClient()
  const context = useContext(StageContext)
  const stageId = context?.stage.id

  const clientProps: ClientProps = useMemo(
    () => ({
      ...defaultClientProps,
      siweAddress: address?.toString() ?? '',
      siweMessage: JSON.stringify(siweMessage),
      siweSig: siweSig ?? '',
    }),
    [address, siweSig, siweMessage]
  )

  const web3Provider = new ethers.providers.StaticJsonRpcProvider(
    publicClient.chain.rpcUrls.default.http[0],
    {
      chainId: publicClient.chain.id,
      name: 'goerli',
    }
  )
  console.log('stageId', stageId)
  const connectWallet = () => {
    connect()
  }
  const signInWithEthereum = async () => {
    const siwe = new SiweMessage({
      domain: window.location.host,
      address: address,
      statement: 'Sign in with Ethereum to use dm3.',
      uri: window.location.origin,
      version: '1',
      chainId: 1,
      nonce: '0x123456789',
      expirationTime: new Date(100000000000000).toISOString(),
    })
    const sig = await signMessageAsync({
      message: siwe.prepareMessage(),
    })

    setSiweSig(sig)
    setSiweMessage(siwe)
  }

  return (
    <>
      {siweSig && siweMessage ? (
        <Dm3Widget
          clientProps={clientProps}
          options={{
            ...defaultOptions,
            avatarSrc: async (address?: string) => {
              return await new Promise((res) => {
                setTimeout(
                  () => res(`https://robohash.org/${address}`),
                  1000
                )
              })
            },
          }}
          web3Provider={web3Provider}
        />
      ) : (
        <div className={`widget common-styles `}>
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '16px',
                height: '1000px',
              }}>
              {!isConnected ? (
                <div
                  style={{ maxHeight: '40px' }}
                  className="rounded-full bg-gradient-to-b from-[#FF9976] to-[#6426EF] p-[2px]">
                  <button
                    onClick={connectWallet}
                    className="text-accent text-sm font-ubuntu font-bold rounded-full h-full w-full bg-white py-1 px-3">
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div
                  style={{ maxHeight: '40px' }}
                  className="rounded-full bg-gradient-to-b from-[#FF9976] to-[#6426EF] p-[2px]">
                  <button
                    onClick={signInWithEthereum}
                    className="text-accent text-sm font-ubuntu font-bold rounded-full h-full w-full bg-white py-1 px-3">
                    Sign in with Ethereum
                  </button>
                </div>
              )}
            </div>
          </>
        </div>
      )}
    </>
  )
}
