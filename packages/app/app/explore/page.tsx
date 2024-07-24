import { HomePageProps } from '@/lib/types'
import ArchiveVideos from '../[organization]/videos/components/ArchiveVideos'
import FeaturedEvents from './components/FeaturedEvents'
import ExploreTabs from './components/ExploreTabs'

const Home = ({ searchParams }: HomePageProps) => {
  return (
    <div className="container mx-auto space-y-12 px-8 py-8 animate-in fade-in duration-500">
      <section>
        <h2 className="mb-6 text-3xl font-bold text-foreground">
          Featured Events
        </h2>
        <FeaturedEvents />
      </section>
      <section>
        <h2 className="mb-6 text-3xl font-bold text-foreground">
          Past Sessions
        </h2>
        <ExploreTabs />
        <div className="mt-8">
          <ArchiveVideos {...searchParams} />
        </div>
      </section>
    </div>
  )
}

export default Home
