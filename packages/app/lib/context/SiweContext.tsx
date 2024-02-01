'use client'
import { SiweMessage } from 'siwe'
import {
  ConnectKitProvider,
  SIWEConfig,
  SIWEProvider,
  getDefaultConfig,
} from 'connectkit'
import { PropsWithChildren } from 'react'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { mainnet } from 'viem/chains'
import { createPublicClient, http } from 'viem'
import { publicProvider } from 'wagmi/providers/public'

import { apiUrl } from '../utils/utils'

let nonce: string
let walletAddress: string
let chainId: string
const siweConfig = {
  createMessage: ({ nonce, address, chainId }) => {
    walletAddress = address
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: '1',
      domain: 'localhost',
      uri: 'http://localhost:3400',
      statement: 'Sign in with Ethereum to the app.',
    }).prepareMessage()
  },
  verifyMessage: async ({ message, signature }) => {
    const res = await fetch(`${apiUrl()}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        signature,
        nonce,
        walletAddress,
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    // if (!res.ok) throw new Error('Failed to Verify')
    const data = (await res.json()).data
    console.log('resssssss', data)
    // localStorage.setItem('token', data.token)
    // store token to cookies

    return data
  },
  getSession: async () => {
    // if (!res.ok) throw new Error('Failed to fetch SIWE session')

    return {
      address: '0x9268d03EfF4A9A595ef619764AFCB9976c0375df',
      chainId: 1,
    }
  },
  getNonce: async () => {
    const res = await fetch(`${apiUrl()}/auth/nonce/generate`)
    if (!res.ok) throw new Error('Failed to fetch SIWE nonce')
    const data = (await res.json()).data
    nonce = data
    console.log('ononce data' + data)
    return data
  },
  signOut: async () => {
    const res = await fetch(`${apiUrl()}/auth/logout`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to sign out')

    return res.ok
  },
} satisfies SIWEConfig

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
)

const config = createConfig(
  getDefaultConfig({
    autoConnect: false,
    appName: 'StreamETH',
    chains: [mainnet],
    publicClient: createPublicClient({
      chain: mainnet,
      transport: http(),
    }),

    // infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

const SiweContext = (props: PropsWithChildren) => {
  return (
    <WagmiConfig config={config}>
      <SIWEProvider {...siweConfig}>
        <ConnectKitProvider>{props.children}</ConnectKitProvider>
      </SIWEProvider>
    </WagmiConfig>
  )
}

export default SiweContext
