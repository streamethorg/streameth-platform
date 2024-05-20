'use client'

import { PropsWithChildren } from 'react'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet, base, baseSepolia } from 'wagmi/chains'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import ProviderContext from './ProviderContext'

const config = createConfig({
  // Your dApps chains
  chains: [mainnet, base, baseSepolia],
  transports: {
    // RPC URL for each chain
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || ''
    ),
    [mainnet.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
})

const queryClient = new QueryClient()

const SiweContext = (props: PropsWithChildren) => {
  return (
    <ProviderContext>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </ProviderContext>
  )
}

export default SiweContext
