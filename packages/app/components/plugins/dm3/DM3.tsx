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
import { useDm3Siwe } from './useDm3Siwe'
import { ConnectKitButton } from 'connectkit'
import { InjectedConnector } from 'wagmi/connectors/injected'
export const defaultOptions: BillboardWidgetProps['options'] = {
  avatarSrc: (hash) => {
    return `https://robohash.org/${hash}?size=38x38`
  },
  className: 'dm3-billboard-widget overflow-auto !',
  timeout: 10000,
}

const getBillboardId = (eventId: string, stageId: string) => {
  const replacedEventId = eventId.replaceAll('_', '-')
  const replacedStageId = stageId.replaceAll('_', '-')

  return `${replacedEventId}-${replacedStageId}.bb.devconnect.dm3.eth`
}

export const Dm3 = () => {
  const { address, isConnected } = useAccount()
  const { connect: connectWallet } = useConnect({
    connector: new InjectedConnector(),
  })
  const publicClient = usePublicClient()
  const { connect } = useConnect()
  const { signInWithEthereum, siweMessage, siweSig } = useDm3Siwe(
    address!
  )

  const web3Provider = new ethers.providers.StaticJsonRpcProvider(
    publicClient.chain.rpcUrls.default.http[0],
    {
      chainId: publicClient.chain.id,
      name: 'mainnet',
    }
  )

  const clientProps: ClientProps = useMemo(() => {
    return {
      mockedApi: false,
      billboardId: getBillboardId(
        'context?.stage.eventId!,',
        'context?.stage.id'!
      ),
      billboardClientUrl: ' https://devconnect.dm3.network/bb-client',
      deliveryServiceEnsName: 'bb-ds.devconnect.dm3.eth',
      offchainResolverUrl:
        ' https://devconnect.dm3.network/resolver-handler',
      userCCIPDomain: 'user.devconnect.dm3.eth',
      siweAddress: address?.toString() ?? '',
      siweMessage: JSON.stringify(siweMessage),
      siweSig: siweSig ?? '',
    }
  }, [
    'context?.stage.eventId',
    'context?.stage.id',
    address,
    siweMessage,
    siweSig,
  ])

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
                justifyContent: 'between',
                padding: '16px',
                // height: '1000px',
              }}>
              {!isConnected ? (
                <p className=" cursor-pointer m-auto text-center flex flex-col justify-center items-center">
                  Connect your wallet to chat
                  <ConnectKitButton />
                </p>
              ) : (
                <div
                  style={{ maxHeight: '40px' }}
                  className=" rounded-xl bg-gray-800 p-4 m-auto text-center flex flex-col justify-center items-center">
                  <button onClick={signInWithEthereum}>
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
