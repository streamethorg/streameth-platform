'use client'
import React from 'react'
import { PrivyProvider } from '@privy-io/react-auth'

const ProviderContext = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_ID!}
      config={{
        // @ts-expect-error headless is an internal prop
        headless: true,
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://streameth.org/logo.png',
          landingHeader: 'Connect to StreamETH',
        },
        loginMethods: [
          'email',
          'wallet',
          'google',
          'github',
          'farcaster',
        ],
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}>
      {children}
    </PrivyProvider>
  )
}

export default ProviderContext
