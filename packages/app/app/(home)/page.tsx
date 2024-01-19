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
import { IOrganization } from 'streameth-server/model/organization'
import { apiUrl } from '@/lib/utils/utils'

const Loading = () => {
  return <Skeleton className=" h-96 w-full bg-muted" />
}

export const revalidate = 3600 // 1 day

export default async function Home() {
  const response = await fetch(`${apiUrl()}/organizations`)
  const data = await response.json()
  const organizations: IOrganization[] = data.data ?? []

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
