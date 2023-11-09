import 'dm3-billboard-widget/dist/style.css'
import { useContext, useMemo } from 'react'
import { useAccount, useConnect, usePublicClient } from 'wagmi'
import './dm3.css'

import {
  BillboardWidgetProps,
  ClientProps,
  Dm3Widget,
} from 'dm3-billboard-widget'
import { ethers } from 'ethersv5'
import { StageContext } from '../StageContext'
import { useDm3Siwe } from './useDm3Siwe'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'

export const defaultOptions: BillboardWidgetProps['options'] = {
  avatarSrc: (hash) => {
    return `https://robohash.org/${hash}?size=38x38`
  },
  className: 'dm3-billboard-widget',
  timeout: 10000,
}

const getBillboardId = (eventId: string, stageId: string) => {
  const replacedEventId = eventId.replaceAll('_', '-')
  const replacedStageId = stageId.replaceAll('_', '-')

  return `${replacedEventId}-${replacedStageId}.bb.dm3.eth`
}

export const Dm3 = () => {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const publicClient = usePublicClient()
  const context = useContext(StageContext)
  const { signInWithEthereum, siweMessage, siweSig } = useDm3Siwe(
    address!
  )
  const web3Provider = new ethers.providers.StaticJsonRpcProvider(
    publicClient.chain.rpcUrls.default.http[0],
    {
      chainId: publicClient.chain.id,
      name: 'goerli',
    }
  )

  const clientProps: ClientProps = useMemo(() => {
    return {
      mockedApi: false,
      billboardId: getBillboardId(
        context?.stage.eventId!,
        context?.stage.id!
      ),
      billboardClientUrl: 'http://104.248.249.53/bb-client',
      deliveryServiceEnsName: 'bb-ds.dm3.eth',
      offchainResolverUrl: 'http://104.248.249.53/resolver-handler',
      siweAddress: address?.toString() ?? '',
      siweMessage: JSON.stringify(siweMessage),
      siweSig: siweSig ?? '',
    }
  }, [address, siweSig, siweMessage, context?.stage.id])

  return (
    <>
      {siweSig && siweMessage && siweMessage.address === address ? (
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
                  <ConnectWalletButton />
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
