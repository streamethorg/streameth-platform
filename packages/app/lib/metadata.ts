import { Metadata } from 'next'
import { IEvent } from 'streameth-server/model/event'
import { ISession } from 'streameth-server/model/session'
import { getImageUrl } from './utils/utils'

const BASE_IMAGE = 'https://streameth.org/streameth_banner.png'

export const generalMetadata: Metadata = {
  title: 'StreamETH',
  description:
    'The complete solution to host your hybrid or virtual event.',
  metadataBase: new URL('https://streameth.org'),
  openGraph: {
    title: 'StreamETH',
    siteName: 'StreamETH',
    description:
      'The complete solution to host your hybrid or virtual event.',
    images: {
      url: BASE_IMAGE,
      alt: 'StreamETH Logo',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamETH',
    description:
      'The complete solution to host your hybrid or virtual event.',
    images: {
      url: BASE_IMAGE,
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

export const archiveMetadata = ({
  event,
}: {
  event: IEvent
}): Metadata => {
  const imageUrl = event.eventCover
    ? getImageUrl(event.eventCover)
    : BASE_IMAGE

  return {
    title: `${event.name} | StreamETH`,
    description: `${event.description}`,
    metadataBase: new URL('https://streameth.org'),
    openGraph: {
      title: `${event.name} | StreamETH`,
      siteName: 'StreamETH',
      description: `Archive of ${event.description}`,
      images: {
        url: imageUrl,
        alt: 'StreamETH Logo',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event} | StreamETH`,
      description: `${event.description}`,
      images: {
        url: imageUrl,
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
}

export const watchMetadata = ({
  session,
}: {
  session: ISession
}): Metadata => {
  const imageUrl = session.coverImage
    ? getImageUrl(session.coverImage)
    : BASE_IMAGE

  return {
    title: `${session.name} | StreamETH`,
    description: `${session.description}`,
    metadataBase: new URL('https://streameth.org'),
    openGraph: {
      title: `${session.name} | StreamETH`,
      siteName: 'StreamETH',
      description: `${session.description}`,
      images: {
        url: imageUrl,
        alt: 'StreamETH Logo',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${session.name} | StreamETH`,
      description: `${session.description}`,
      images: {
        url: imageUrl,
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
}
