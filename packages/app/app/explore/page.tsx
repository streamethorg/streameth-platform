import { fetchOrganizations } from '@/lib/services/organizationService';
import { IExtendedOrganization } from '@/lib/types';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import HomePageNavbar from '@/components/Layout/HomePageNavbar';

interface OrganizationsPageProps {
  searchParams: {
    search?: string;
    view?: 'grid' | 'list';
  };
}

const OrganizationsPage = async ({ searchParams }: OrganizationsPageProps) => {
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
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Events
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Find and join amazing live events, conferences, and community
              gatherings
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events, conferences, or topics..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={searchParams.search}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {searchParams.search ? 'Search Results' : 'All Events'}
            </h2>
            <p className="text-gray-600">
              {filteredOrganizations.length} events found
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button variant="ghost" size="sm" className="rounded-md">
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-md">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 rounded-lg h-64"></div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-100 rounded"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          {filteredOrganizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizations.map((organization) => (
                <EventCard key={organization._id} organization={organization} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria
              </p>
              <Button onClick={() => (window.location.href = '/explore')}>
                Clear Search
              </Button>
            </div>
          )}
        </Suspense>
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
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative h-48 overflow-hidden">
        {organization.banner ? (
          <Image
            src={organization.banner}
            alt={organization.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-white" />
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {organization.logo ? (
              <Image
                src={organization.logo}
                alt={organization.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
              {organization.name}
            </h3>
            {(organization.description || organization.bio) && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {organization.description || organization.bio}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {organization.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{organization.location}</span>
            </div>
          )}

          {organization.url && (
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="w-4 h-4 mr-2 text-gray-400" />
              <a
                href={organization.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors truncate"
              >
                {organization.url.replace(/^https?:\/\//, '')}
                <ExternalLink className="w-3 h-3 ml-1 inline" />
              </a>
            </div>
          )}

          {organization.currentVideoCount !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <Play className="w-4 h-4 mr-2 text-gray-400" />
              <span>{organization.currentVideoCount} videos</span>
            </div>
          )}
        </div>

        <Link href={`/${organization.slug || organization._id}`}>
          <Button className="w-full">View Event</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default OrganizationsPage;
