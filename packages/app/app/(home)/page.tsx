import { Metadata } from 'next'
import UpcomingEvents from './components/UpcomingEvents'
import { Suspense } from 'react'
export default async function Home() {
  return (
    <Suspense>
      <UpcomingEvents />
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: 'StreamETH',
  description:
    'The complete solution to host your hybrid or virtual event.',
  metadataBase: new URL('https://app.streameth.org'),
  openGraph: {
    title: 'StreamETH',
    siteName: 'StreamETH',
    description:
      'The complete solution to host your hybrid or virtual event.',
    images: {
      url: 'https://app.streameth.org/streameth_banner.png',
      alt: 'StreamETH Logo',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamETH',
    description:
      'The complete solution to host your hybrid or virtual event.',
    images: {
      url: 'https://app.streameth.org/streameth_banner.png',
      alt: 'StreamETH Logo',
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
}
