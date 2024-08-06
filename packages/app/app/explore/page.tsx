import { HomePageProps } from '@/lib/types';
import ArchiveVideos from '../[organization]/videos/components/ArchiveVideos';
import { getFeaturedEventsData } from '../../components/misc/FeaturedEventsData';
import FeaturedEvents from './components/FeaturedEvents';
import ExploreTabs from './components/ExploreTabs';
import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import { Suspense } from 'react';

const Home = async ({ searchParams }: HomePageProps) => {
  const { events, organizations } = await getFeaturedEventsData();
  const pages = [
    {
      name: 'Home',
      href: `/`,
      bgColor: 'bg-muted',
    },
  ];
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <HomePageNavbar
        logo=""
        currentOrganization=""
        pages={pages}
        showSearchBar={true}
      />
      <div className="relative container mx-auto my-4 space-y-12 ">
        <section className="space-y-8">
          <h2 className="text-xl font-medium text-foreground">
            Featured events
          </h2>
          <FeaturedEvents events={events} organizations={organizations} />
        </section>
        <section className="relative">
          <h2 className="text-xl font-medium text-foreground">Past sessions</h2>
          <ExploreTabs />
          <div className="mt-8">
            <Suspense fallback={<div> Loading... </div>}>
              <ArchiveVideos {...searchParams} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
