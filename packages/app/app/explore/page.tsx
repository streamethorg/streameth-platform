import { HomePageProps } from '@/lib/types'
import ArchiveVideos from '../[organization]/videos/components/ArchiveVideos'
import FeaturedEvents from './components/FeaturedEvents'
import ExploreTabs from './components/ExploreTabs'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

const Home = ({ searchParams }: HomePageProps) => {
  return (
    <div className="min-h-dvh flex flex-col">
      <section className="bg-primary py-16 text-primary-foreground md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Explore our Video Library
            </h1>
            <p className="mb-8 text-xl text-primary-foreground/80 md:text-2xl">
              Discover a wide range of engaging videos on various
              topics.
            </p>
            <div className="mx-auto flex max-w-2xl items-center justify-center rounded-lg bg-primary-background/10 p-2">
              <SearchIcon className="mr-3 h-6 w-6 text-primary-foreground/50" />
              <Input
                type="search"
                placeholder="Search videos..."
                className="w-full border-none bg-transparent text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto space-y-16 px-4 py-16 md:px-6">
        <section>
          <h2 className="mb-8 text-3xl font-bold text-foreground">
            Featured Events
          </h2>
          <FeaturedEvents />
        </section>
        <section>
          <h2 className="mb-8 text-3xl font-bold text-foreground">
            Past Sessions
          </h2>
          <ExploreTabs />
          <div className="mt-8">
            <ArchiveVideos {...searchParams} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
