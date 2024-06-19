'use client'

import { PropsWithChildren } from 'react'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet, base, baseSepolia } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import ProviderContext from './ProviderContext'

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet, base, baseSepolia],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(),
      [base.id]: http(),
      [baseSepolia.id]: http(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || ''
      ),
    },
    ssr: true,
    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: 'StreamETH',
    // Optional App Info
    appDescription: 'StreamETH',
    appUrl: 'https://streameth.org/', // your app's url
    appIcon: 'https://streameth.org/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)

const queryClient = new QueryClient()

const SiweContext = (props: PropsWithChildren) => {
  return (
    <ProviderContext>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>{props.children}</ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ProviderContext>
  )
}

export default SiweContext
