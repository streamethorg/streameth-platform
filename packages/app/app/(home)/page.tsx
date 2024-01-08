import { Metadata } from 'next'
import UpcomingEvents from './components/UpcomingEvents'
import Videos from '../../components/misc/Videos'
import { Suspense } from 'react'
import { fetchOrganizations } from '@/lib/data'
import OrganizationStrip from './components/OrganiationStrip'
import {
  CardDescription,
  CardTitle,
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-black">
      <h1 className="text-2xl font-bold  text-white">Loading...</h1>
    </div>
  )
}

export default async function Home() {
  const organizations = await fetchOrganizations()

  return (
    <>
      <Suspense>
        <UpcomingEvents date={new Date()} />
      </Suspense>
      <Card className="bg-white border-none">
        <CardHeader>
          <CardTitle className="text-background text-4xl">
            Organizations
          </CardTitle>
          <CardDescription>
            Organizations that are using StreamETH to host their
            events
          </CardDescription>
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
