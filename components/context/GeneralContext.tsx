'use client'
import { useMemo } from 'react'
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react'
// import { Analytics } from '@vercel/analytics/react'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { createConfig, configureChains, mainnet, WagmiConfig } from 'wagmi'
import { publicProvider } from '@wagmi/core/providers/public'

import '@rainbow-me/rainbowkit/styles.css'
import { Analytics } from '@vercel/analytics/react'

const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'StreamETH',
  projectId: '2f85fa1b6b2c0083df930d53eaee306f',
  chains,
})

const config = createConfig({
  publicClient,
  webSocketPublicClient,
  connectors,
})

const GeneralContext = ({ children }: { children: React.ReactNode }) => {
  const livepeerClient = useMemo(
    () =>
      createReactClient({
        provider: studioProvider({
          apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY ?? '',
        }),
      }),
    []
  )

  console.log(process.env.NEXT_PUBLIC_STUDIO_API_KEY)
  return (
    <WagmiConfig config={config}>
      <Analytics />
      <RainbowKitProvider chains={chains}>
        <LivepeerConfig client={livepeerClient}>{children}</LivepeerConfig>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default GeneralContext
