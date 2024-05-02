'use client'

import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import SiweContext from './SiweContext'
import Support from '@/components/misc/Support'

const GeneralContext = ({ children }: { children: any }) => {
  return (
    <SiweContext>
      <Analytics />
      <SpeedInsights />

      {children}
    </SiweContext>
  )
}

export default GeneralContext
