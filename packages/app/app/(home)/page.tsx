import { Metadata } from 'next'
import UpcomingEvents from './components/UpcomingEvents'
import Videos from '../../components/misc/Videos'
import { Suspense } from 'react'
import { fetchOrganizations } from '@/lib/data'
import OrganizationStrip from './components/OrganizationStrip'
import {
  CardDescription,
  CardTitle,
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card'
import HeroHeader from './components/HeroHeader'
import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return <Skeleton className=" h-96 w-full bg-muted" />
}

export const revalidate = 3600 // 1 day

export default async function Home() {
  const organizations = await fetchOrganizations()

  return (
    <>
      <HeroHeader />
      <Suspense>
        <UpcomingEvents date={new Date()} />
      </Suspense>
      <Card className="bg-white border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-background text-2xl lg:text-4xl">
            Explore organizations that are using StreamETH
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 border-0">
          {organizations.map((organization) => (
            <Suspense key={organization.id} fallback={<Loading />}>
              <OrganizationStrip organization={organization} />
            </Suspense>
          ))}
        </CardContent>
      </Card>
    </>
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
