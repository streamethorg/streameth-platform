import { HomePageProps } from '@/lib/types'
import ArchiveVideos from '../[organization]/videos/components/ArchiveVideos'
import FeaturedEvents from './components/FeaturedEvents'
import ExploreTabs from './components/ExploreTabs'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import { Suspense } from 'react'

const Home = ({ searchParams }: HomePageProps) => {
  const pages = [
    {
      name: 'Home',
      href: `/`,
      bgColor: 'bg-muted',
    },
  ]
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <HomePageNavbar
        logo=""
        currentOrganization=""
        pages={pages}
        showSearchBar={true}
      />
      {/* <section className="bg-primary py-16 text-primary-foreground md:py-24 lg:py-32"> */}
      {/*   <div className="container px-4 md:px-6"> */}
      {/*     <div className="mx-auto max-w-3xl text-center"> */}
      {/*       <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"> */}
      {/*         Explore our Video Library */}
      {/*       </h1> */}
      {/*       <p className="mb-8 text-xl text-primary-foreground/80 md:text-2xl"> */}
      {/*         Discover a wide range of engaging videos on various */}
      {/*         topics. */}
      {/*       </p> */}
      {/*       <div className="mx-auto max-w-2xl"> */}
      {/*         <div className="relative"> */}
      {/*           <SearchIcon className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" /> */}
      {/*           <Input */}
      {/*             type="search" */}
      {/*             placeholder="Search videos..." */}
      {/*             className="w-full rounded-xl border-2 border-primary-foreground/20 bg-white py-3 pl-12 pr-4 text-lg text-gray-800 placeholder-gray-500 shadow-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent" */}
      {/*           /> */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </section> */}
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
