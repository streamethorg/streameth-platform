import UpcomingEvents from './components/UpcomingEvents'
import { Suspense } from 'react'
import OrganizationStrip from './components/OrganizationStrip'
import {
  CardTitle,
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card'
import HeroHeader from './components/HeroHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchOrganizations } from '@/lib/data'

const Loading = () => {
  return <Skeleton className=" h-96 w-full bg-muted" />
}

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
          <CardTitle className=" text-2xl lg:text-4xl">
            Explore organizations that are using StreamETH
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 border-0">
          {organizations?.map((organization) => (
            <Suspense key={organization._id} fallback={<Loading />}>
              <OrganizationStrip organization={organization} />
            </Suspense>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
