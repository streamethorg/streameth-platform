import { IExtendedOrganization } from '@/lib/types';
import { fetchOrganizations } from '@/lib/services/organizationService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Globe,
  Play,
  Building2,
  ExternalLink,
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Clock,
  Eye,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import SearchBar from './components/SearchBar';

const OrganizationsPage = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{
    search?: string;
    view?: 'grid' | 'list';
  }>;
}) => {
  const searchParams = await searchParamsPromise;
  const organizations = await fetchOrganizations();

  const filteredOrganizations = organizations.filter((org) => {
    const searchMatch =
      !searchParams.search ||
      org.name.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      org.description
        ?.toLowerCase()
        .includes(searchParams.search.toLowerCase()) ||
      org.bio?.toLowerCase().includes(searchParams.search.toLowerCase());

    return searchMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <HomePageNavbar
        logo=""
        currentOrganization=""
        pages={[]}
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
              Discover Amazing Events
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Explore Events
              <br />
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover and join incredible live events, conferences, and
              community gatherings from leading organizations worldwide
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {/* Events Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-slate-600 font-semibold text-sm mb-3">
                <Building2 className="w-4 h-4" />
                All Events
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {searchParams.search
                  ? `Search Results for "${searchParams.search}"`
                  : 'All Events'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                {searchParams.search
                  ? `Found ${filteredOrganizations.length} events matching your search`
                  : 'Discover amazing events from organizations around the world'}
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
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs"
              >
                <Filter className="w-3 h-3 mr-1" />
                Filter
              </Button>
            </div>
          </div>

          {filteredOrganizations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or browse all available
                events
              </p>
              <Link href="/explore">
                <Button className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl">
                  Browse All Events
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOrganizations.map((organization) => (
                <EventCard key={organization._id} organization={organization} />
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-24">
          <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-12 md:p-16 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.25)_2px,transparent_0)] bg-[length:30px_30px]"></div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Play className="w-4 h-4" />
                Ready to host your event?
              </div>

              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Host Your Own Event
              </h3>
              <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of organizers who trust our platform for their
                live streaming needs. Start your journey today and connect with
                audiences worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-slate-700 hover:bg-slate-50 px-10 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const EventCard = ({
  organization,
}: {
  organization: IExtendedOrganization;
}) => {
  return (
    <Link href={`/${organization.slug || organization._id}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white">
        <div className="relative h-48 overflow-hidden">
          {organization.banner ? (
            <Image
              src={organization.banner}
              alt={organization.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-gray-100">
              {organization.logo ? (
                <Image
                  src={organization.logo}
                  alt={organization.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 text-lg">
                {organization.name}
              </h3>
              <p className="text-sm text-gray-600 font-medium line-clamp-2">
                {organization.description ||
                  organization.bio ||
                  'Amazing events and content'}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {organization.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                <span className="font-medium">{organization.location}</span>
              </div>
            )}

            {organization.url && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-3 text-gray-400" />
                <a
                  href={organization.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors truncate font-medium"
                >
                  {organization.url.replace(/^https?:\/\//, '')}
                  <ExternalLink className="w-3 h-3 ml-1 inline" />
                </a>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-600">
              <Play className="w-4 h-4 mr-3 text-gray-400" />
              <span className="font-medium">
                {organization.currentVideoCount ?? 0} videos
              </span>
            </div>
          </div>

          <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg py-2 px-4 text-sm transition-all duration-300 group-hover:shadow-md">
            View Events
            <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default OrganizationsPage;
