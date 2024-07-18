import { Metadata } from 'next'
import {
  IExtendedEvent,
  IExtendedOrganization,
  IExtendedSession,
  IExtendedStage,
} from '../types'

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

export const organizationMetadata = ({
  organization,
}: {
  organization: IExtendedOrganization
}): Metadata => {
  const imageUrl = organization.banner
    ? organization.banner
    : BASE_IMAGE

  return {
    title: `${organization.name} | StreamETH`,
    description: `${organization.description}`,
    metadataBase: new URL('https://streameth.org'),
    openGraph: {
      title: `${organization.name} | StreamETH`,
      siteName: 'StreamETH',
      description: `Archive of ${organization.description}`,
      images: {
        url: imageUrl,
        alt: 'StreamETH Logo',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${organization.name} | StreamETH`,
      description: `${organization.description}`,
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

export const archiveMetadata = ({
  event,
}: {
  event: IExtendedEvent
}): Metadata => {
  const imageUrl = event.eventCover ? event.eventCover : BASE_IMAGE

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
      title: `${event.name} | StreamETH`,
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
  organization,
  session,
  thumbnail,
}: {
  organization?: IExtendedOrganization
  session: IExtendedSession
  thumbnail: string
}): Metadata => {
  return {
    title: `${session.name} | ${organization?.name}`,
    description: `${session.description}`,
    metadataBase: new URL('https://streameth.org'),
    openGraph: {
      title: `${session.name}`,
      siteName: `${organization?.name}`,
      description: `${session.description}`,
      images: {
        url: thumbnail ?? BASE_IMAGE,
        alt: thumbnail ? session.name : 'StreamETH Logo',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${session.name}`,
      description: `${session.description}`,
      images: {
        url: thumbnail ?? BASE_IMAGE,
        alt: thumbnail ? session.name : 'StreamETH Logo',
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

export const stageMetadata = ({
  event,
  stage,
}: {
  event: IExtendedEvent
  stage: IExtendedStage
}): Metadata => {
  const imageUrl = event.eventCover ? event.eventCover : BASE_IMAGE

  return {
    title: `${stage.name} | StreamETH`,
    description: `${event.description}`,
    metadataBase: new URL('https://streameth.org'),
    openGraph: {
      title: `${stage.name} | StreamETH`,
      siteName: 'StreamETH',
      description: `${event.description}`,
      images: {
        url: imageUrl,
        alt: 'StreamETH Logo',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${stage.name} | StreamETH`,
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

export const eventMetadata = ({
  event,
}: {
  event: IExtendedEvent
}): Metadata => {
  const imageUrl = event.eventCover ? event.eventCover : BASE_IMAGE

  return {
    title: `${event.name} | StreamETH`,
    description: `${event.description}`,
    metadataBase: new URL('https://streameth.org'),
    openGraph: {
      title: `${event.name} | StreamETH`,
      siteName: 'StreamETH',
      description: `${event.description}`,
      images: {
        url: imageUrl,
        alt: 'StreamETH Logo',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.name} | StreamETH`,
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

export const livestreamMetadata = ({
  livestream,
  organization,
}: {
  livestream: IExtendedStage
  organization: IExtendedOrganization
}): Metadata => {
  const imageUrl = livestream.thumbnail
    ? livestream.thumbnail
    : BASE_IMAGE

  return {
    title: `${livestream.name} | ${organization.name}`,
    description: `${livestream.description}`,
    metadataBase: new URL('https://streameth.org'),
    openGraph: {
      title: `${livestream.name} | ${organization.name}`,
      siteName: `${organization.name}`,
      description: `${livestream.description}`,
      images: {
        url: imageUrl,
        alt: 'StreamETH Logo',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${livestream.name} | ${organization.name}`,
      description: `${livestream.description}`,
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
