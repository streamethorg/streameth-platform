'use client'
import { useMemo } from 'react'
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react'
import { Analytics } from '@vercel/analytics/react'

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

  return (
    <LivepeerConfig client={livepeerClient}>
      <Analytics />
      {children}
    </LivepeerConfig>
  )
}

export default GeneralContext
