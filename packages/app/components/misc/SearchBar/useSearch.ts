import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/utils/utils';
import { IExtendedSession } from '@/lib/types';
import useDebounce from '@/lib/hooks/useDebounce';

export function useSearch(organizationId?: string, isStudio?: boolean) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IExtendedSession[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (!debouncedSearchQuery) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const baseUrl = `${apiUrl()}/sessions/search?search=${debouncedSearchQuery}&onlyVideos=true`;
        const url = organizationId
          ? `${baseUrl}&organizationId=${organizationId}`
          : baseUrl;

        const res = await fetch(url);
        const data = await res.json();
        const items = organizationId
          ? data.data.slice(0, 10)
          : data.data.map((obj: any) => obj.item).slice(0, 10);

        setSearchResults(items);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery, organizationId, isStudio]);

  return { searchQuery, setSearchQuery, searchResults, isLoading };
}
