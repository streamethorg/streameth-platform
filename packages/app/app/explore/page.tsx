import { HomePageProps } from '@/lib/types'
import ArchiveVideos from '../[organization]/videos/components/ArchiveVideos'
import FeaturedEvents from './components/FeaturedEvents'
import ExploreTabs from './components/ExploreTabs'

const Home = ({ searchParams }: HomePageProps) => {
  return (
    <div className="flex flex-col p-6">
      <div>
        <p>Featured events</p>
        <FeaturedEvents />
      </div>
      <div>
        <p>Past sessions</p>
        <ExploreTabs />
        <ArchiveVideos {...searchParams} />
      </div>
    </div>
  )
}

export default Home
