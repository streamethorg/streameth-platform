import { HomePageProps } from '@/lib/types';
import ArchiveVideos from './[organization]/videos/components/ArchiveVideos';
import FeaturedEvents from './explore/components/FeaturedEvents';
import ExploreTabs from './explore/components/ExploreTabs';
import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Play,
  Users,
  Calendar,
  ArrowRight,
  Search,
  Building2,
  Globe,
  MapPin,
  Clock,
  Eye,
  TrendingUp,
  Grid3X3,
  List,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAllSessions } from '@/lib/services/sessionService';

const HomePage = async ({
  searchParams: searchParamsPromise,
}: HomePageProps) => {
  const searchParams = await searchParamsPromise;

  const featuredEvents = [
    {
      name: 'EthCC [7]',
      url: '/ethcc',
      cover:
        'https://ethcc.io/_next/image?url=%2Farchive%2Fethcc7.jpg&w=640&q=75',
      organization: 'Ethereum France',
      location: 'Paris, France',
      date: 'July 2024',
      viewers: '2.5K',
      duration: '3 days',
    },
    {
      name: 'Zuzalu',
      url: '/zuzalu',
      cover:
        'https://streamethapp.ams3.cdn.digitaloceanspaces.com/sessions/zuzalu_montenegro_2023/zuzalu_thumbnail.jpg',
      organization: 'Zuzau',
      location: 'Montenegro',
      date: 'June 2024',
      viewers: '1.8K',
      duration: '2 weeks',
    },
    {
      name: 'Protocol Berg',
      url: '/ethberlin',
      cover:
        'https://pbs.twimg.com/media/Fxn7DwyWAAQwXzx?format=jpg&name=large',
      organization: 'Department of Decentralization',
      location: 'Berlin, Germany',
      date: 'May 2024',
      viewers: '3.2K',
      duration: '4 days',
    },
  ];

  const stats = [
    { label: 'Live Events', value: '500+', icon: Play },
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Organizations', value: '200+', icon: Building2 },
    { label: 'Countries', value: '30+', icon: Globe },
  ];

  // Fetch featured session (most popular)
  const { sessions: allSessions } = await fetchAllSessions({
    onlyVideos: true,
    published: 'public',
    limit: 1,
    page: 1,
  });

  const featuredSession = allSessions[0];

  return (
    <div className="min-h-screen bg-white">
      <HomePageNavbar
        logo=""
        currentOrganization=""
        pages={[
          { name: 'Blog', href: '/blog' },
          { name: 'Explore', href: '/explore' },
        ]}
        showSearchBar={false}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>

        <div className="container relative mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8">
              <TrendingUp className="w-4 h-4" />
              Trusted by 200+ organizations worldwide
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Stream Your Events
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">
                Live & On-Demand
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The premier platform for live streaming events, conferences, and
              community gatherings. Stream live, engage with your audience, and
              build lasting connections.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/studio">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-3" />
                  Start Streaming
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-slate-900 hover:bg-white/10 px-10 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl group-hover:bg-white/20 transition-colors duration-300">
                      <stat.icon className="w-6 h-6 text-slate-300" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-slate-300 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {/* Featured Events Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-3">
                <TrendingUp className="w-4 h-4" />
                Trending Now
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Featured Events
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Discover the latest and most popular events from leading
                organizations
              </p>
            </div>
            <Link href="/explore">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-semibold"
              >
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <FeaturedEventCard key={index} event={event} />
            ))}
          </div>
        </section>

        {/* Past Sessions Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-3">
                <Clock className="w-4 h-4" />
                Content Library
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Past Sessions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Discover insights from industry leaders, thought-provoking
                discussions, and valuable knowledge from our extensive content
                library
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/explore?sort=views">
                <Button variant="outline" size="sm" className="rounded-lg">
                  <Eye className="w-4 h-4 mr-2" />
                  Most Viewed
                </Button>
              </Link>
              <Link href="/explore?sort=recent">
                <Button variant="outline" size="sm" className="rounded-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Recent
                </Button>
              </Link>
            </div>
          </div>

          {/* Featured Session Highlight */}
          {featuredSession && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 mb-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
              <div className="relative">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="relative w-full lg:w-96 h-64 rounded-2xl overflow-hidden bg-slate-700">
                    {featuredSession.coverImage ? (
                      <Image
                        src={featuredSession.coverImage}
                        alt={featuredSession.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                      <TrendingUp className="w-4 h-4" />
                      Most Popular This Week
                    </div>
                    <h3 className="text-3xl font-bold mb-4">
                      {featuredSession.name}
                    </h3>
                    <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                      {featuredSession.description ||
                        featuredSession.aiDescription ||
                        'Join industry experts as they discuss the latest trends, challenges, and opportunities in technology and innovation.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 mb-8 justify-center lg:justify-start">
                      {featuredSession.speakers &&
                        featuredSession.speakers.length > 0 && (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Users className="w-4 h-4" />
                            <span>{featuredSession.speakers.join(', ')}</span>
                          </div>
                        )}
                      {featuredSession.start && featuredSession.end && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4" />
                          <span>
                            {Math.round(
                              (new Date(featuredSession.end).getTime() -
                                new Date(featuredSession.start).getTime()) /
                                60000
                            )}{' '}
                            min
                          </span>
                        </div>
                      )}
                      {featuredSession.createdAt && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(
                              featuredSession.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <Link href={`/watch?session=${featuredSession._id}`}>
                      <Button
                        size="lg"
                        className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 font-semibold rounded-xl"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Watch Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  All Sessions
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Browse our complete content library
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md h-8 px-3 text-xs font-medium"
                  >
                    <Grid3X3 className="w-3 h-3 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md h-8 px-3 text-xs font-medium"
                  >
                    <List className="w-3 h-3 mr-1" />
                    List
                  </Button>
                </div>
                <Link href="/explore?sort=views">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Most Viewed
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4">
              <ExploreTabs />
            </div>

            {/* Content */}
            <div className="p-6">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-xl h-40 mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-5 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="flex gap-2">
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              >
                <ArchiveVideos {...searchParams} gridLength={8} />
              </Suspense>

              <div className="text-center mt-12 pt-8 border-t border-gray-100">
                <Link href="/explore">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl px-8 py-4 font-semibold border-slate-200 hover:bg-slate-50"
                  >
                    Browse All Content
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-12 md:p-16 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.25)_2px,transparent_0)] bg-[length:30px_30px]"></div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Play className="w-4 h-4" />
                Ready to get started?
              </div>

              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Stream Your Event?
              </h3>
              <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of organizers who trust our platform for their
                live streaming needs. Start your journey today and connect with
                audiences worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/studio">
                  <Button
                    size="lg"
                    className="bg-white text-slate-700 hover:bg-slate-50 px-10 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-slate-900 hover:bg-white/10 px-10 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const FeaturedEventCard = ({ event }: { event: any }) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={event.cover}
          alt={event.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Live Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Live
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{event.viewers}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-gray-100">
            <div className="w-full h-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 text-lg">
              {event.name}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {event.organization}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {event.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-3 text-gray-400" />
              <span className="font-medium">{event.location}</span>
            </div>
          )}
          {event.date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-3 text-gray-400" />
              <span className="font-medium">{event.date}</span>
            </div>
          )}
        </div>

        <Link href={event.url}>
          <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl py-3 transition-all duration-300 group-hover:shadow-lg">
            View Event
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default HomePage;
