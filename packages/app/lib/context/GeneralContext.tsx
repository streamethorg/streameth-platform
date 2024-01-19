'use client'

import { SpeedInsights } from '@vercel/speed-insights/next'
import { useMemo } from 'react'
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react'
import { Analytics } from '@vercel/analytics/react'
import SiweContext from './SiweContext'

const GeneralContext = ({
  children,
}: {
  children: any
}) => {
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
    <SiweContext>
      <LivepeerConfig client={livepeerClient}>
        <Analytics />
        <SpeedInsights />
        {children}
      </LivepeerConfig>
    </SiweContext>
  )
}

export default GeneralContext
