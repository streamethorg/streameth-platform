'use client'
import { SiweMessage } from 'siwe'
import {
  ConnectKitProvider,
  SIWEConfig,
  getDefaultConfig,
  SIWEProvider,
} from 'connectkit'
import { PropsWithChildren } from 'react'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { optimism, mainnet, base } from 'wagmi/chains'
import { apiUrl } from '../utils/utils'
import { storeSession } from '@/lib/actions/auth'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { createPublicClient } from 'viem'

let nonce: string
let walletAddress: string

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
        address: '0xcf2aE5CE38f2bceFb55601dF50856573CC5b7bc2',
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

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet, base],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(),
      [base.id]: http(),
    },
    ssr: true,
    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: 'Your App Name',

    // Optional App Info
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)

const queryClient = new QueryClient()

const SiweContext = (props: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider>{props.children}</ConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default SiweContext
