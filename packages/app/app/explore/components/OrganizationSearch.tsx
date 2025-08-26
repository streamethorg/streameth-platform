'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, List, X, SlidersHorizontal } from 'lucide-react';

interface OrganizationSearchProps {
  totalCount: number;
  filteredCount: number;
}

const OrganizationSearch = ({
  totalCount,
  filteredCount,
}: OrganizationSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    (searchParams.get('view') as 'grid' | 'list') || 'grid'
  );
  const [showFilters, setShowFilters] = useState(false);

  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`/explore?${newSearchParams.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateURL({ search: value });
  };

  const handleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    updateURL({ view: mode });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setShowFilters(false);
    router.push('/explore');
  };

  const hasActiveFilters = searchTerm;

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search events, conferences, or topics..."
              className="pl-14 pr-6 py-4 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base bg-gray-50 hover:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button - for future filters */}
            <Button
              variant="outline"
              size="lg"
              className="md:hidden flex items-center gap-2 px-4 py-3 rounded-xl"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-lg transition-all duration-200 ${
                  viewMode !== 'list'
                    ? 'bg-white shadow-sm text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => handleViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => handleViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Filters Panel - for future filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100 md:hidden">
            <div className="space-y-4">
              <p className="text-sm text-gray-500 font-medium">
                More filters coming soon...
              </p>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Active filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                  Search: &quot;{searchTerm}&quot;
                  <button
                    onClick={() => handleSearch('')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear all
              </Button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-bold text-gray-900">{filteredCount}</span>{' '}
                of <span className="font-bold text-gray-900">{totalCount}</span>{' '}
                events
              </p>
              {hasActiveFilters && (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                  Filtered
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSearch;
