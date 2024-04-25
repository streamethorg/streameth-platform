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
import { mainnet, base, baseSepolia } from 'wagmi/chains'
import { apiUrl } from '../utils/utils'
import { storeSession } from '@/lib/actions/auth'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

let nonce: string
let walletAddress: string
let selectedChainId: number
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
    selectedChainId = chainId
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
    localStorage.setItem('address', walletAddress)
    localStorage.setItem('chainId', selectedChainId.toString())
    // save to user-session cookie
    storeSession({
      token: data.token,
      address: walletAddress,
    })
    return data
  },
  getSession: async () => {
    if (localStorage.getItem('SWIEToken')) {
      const res = await fetch(`${apiUrl()}/auth/verify-token`, {
        method: 'POST',
        body: JSON.stringify({
          token: localStorage.getItem('SWIEToken'),
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const resData = (await res.json()).data
      const address = localStorage.getItem('address')
      const chainId = localStorage.getItem('chainId')
      if (resData && address) {
        return {
          address: address as string,
          chainId: Number(chainId),
        }
      } else return null
    }
    return null
  },

  signOut: async () => {
    // delete user-session cookie
    storeSession({
      token: '',
      address: '',
    })
    // delete token
    localStorage.removeItem('SWIEToken')
    localStorage.removeItem('address')
    return true
  },
} satisfies SIWEConfig

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [baseSepolia, mainnet, base],
    transports: {
      // RPC URL for each chain
      [baseSepolia.id]: http(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || ''
      ),
      [mainnet.id]: http(),
      [base.id]: http(),
    },
    ssr: true,
    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: 'Streameth',

    // Optional App Info
    appDescription: 'Streameth',
    appUrl: 'https://streameth.org', // your app's url
    appIcon: 'https://streameth.org/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
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
