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
import { storeSession } from '@/lib/actions/auth'

let nonce: string
let walletAddress: string
let chainId: string

const siweConfig = {
  getNonce: async () => {
    const res = await fetch(`${apiUrl()}/auth/nonce/generate`)
    if (!res.ok) throw new Error('Failed to fetch SIWE nonce')
    const data = (await res.json()).data
    nonce = data
    return data
  },
  createMessage: ({ nonce, address, chainId }) => {
    walletAddress = address
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: '1',
      domain: window.location.host,
      uri: window.location.origin,
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
    if (!res.ok) throw new Error('Failed to Verify')
    const data = (await res.json()).data
    localStorage.setItem('SWIEToken', data.token)
    // save to user-session cookie
    storeSession({
      token: data.token,
    })
    return data
  },
  getSession: async () => {
    if (localStorage.getItem('SWIEToken')) {
      return {
        address: '0xA93950A195877F4eBC8A4aF3F6Ce2a109404b575',
        chainId: 1,
      }
    }
    return null
  },

  signOut: async () => {
    // delete user-session cookie
    storeSession({
      token: '',
    })
    // delete token
    localStorage.removeItem('SWIEToken')
    return true
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
