'use client'
import { useMemo } from 'react'
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react'
import { Analytics } from '@vercel/analytics/react'
import SiweContext from './SiweContext'

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
    <SiweContext>
      <LivepeerConfig client={livepeerClient}>
        <Analytics />
        {children}
      </LivepeerConfig>
    </SiweContext>
  )
}

export default GeneralContext
