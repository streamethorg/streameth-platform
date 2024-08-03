import { HomePageProps } from '@/lib/types'
import ArchiveVideos from '../[organization]/videos/components/ArchiveVideos'
import { getFeaturedEventsData } from '../../components/misc/FeaturedEventsData'
import FeaturedEvents from './components/FeaturedEvents'
import ExploreTabs from './components/ExploreTabs'
import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import { Suspense } from 'react'

const Home = async ({ searchParams }: HomePageProps) => {
  const { events, organizations } = await getFeaturedEventsData()
  const pages = [
    {
      name: 'Home',
      href: `/`,
      bgColor: 'bg-muted',
    },
  ]
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <HomePageNavbar
        logo=""
        currentOrganization=""
        pages={pages}
        showSearchBar={true}
      />
      <div className="container mx-auto space-y-16 px-4 py-16 md:px-6">
        <section>
          <h2 className="mb-8 text-3xl font-bold text-foreground">
            Featured Events
          </h2>
          <FeaturedEvents
            events={events}
            organizations={organizations}
          />
        </section>
        <section>
          <h2 className="mb-8 text-3xl font-bold text-foreground">
            Past Sessions
          </h2>
          <ExploreTabs />
          <div className="mt-8">
            <Suspense fallback={<div> Loading... </div>}>
              <ArchiveVideos {...searchParams} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
