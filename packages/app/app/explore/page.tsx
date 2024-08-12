import { HomePageProps } from '@/lib/types';
import ArchiveVideos from '../[organization]/videos/components/ArchiveVideos';
import { getFeaturedEventsData } from '../../components/misc/FeaturedEventsData';
import FeaturedEvents from './components/FeaturedEvents';
import ExploreTabs from './components/ExploreTabs';
import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import { Suspense } from 'react';

const Home = async ({ searchParams }: HomePageProps) => {
  const featuredEvents = [
    {
      name: 'EthCC [7]',
      url: '/ethcc',
      cover:
        'https://ethcc.io/_next/image?url=%2Farchive%2Fethcc7.jpg&w=640&q=75',
      organization: 'Ethereum France',
    },
    {
      name: 'Zuzalu',
      url: '/zuzalu',
      cover:
        'https://streamethapp.ams3.cdn.digitaloceanspaces.com/sessions/zuzalu_montenegro_2023/zuzalu_thumbnail.jpg',
      organization: 'Zuzau',
    },
    {
      name: 'Protocol Berg',
      url: '/ethberlin',
      cover:
        'https://pbs.twimg.com/media/Fxn7DwyWAAQwXzx?format=jpg&name=large',
      organization: 'Department of Decentralization',
    },
  ];

  const pages = [
    {
      name: 'Create event',
      href: `https://info.streameth.org/`,
      bgColor: 'primary',
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
          <FeaturedEvents events={featuredEvents} />
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
