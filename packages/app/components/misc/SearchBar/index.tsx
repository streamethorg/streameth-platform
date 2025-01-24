'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { archivePath } from '@/lib/utils/utils';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { useRouter } from 'next/navigation';
import { IExtendedSession } from '@/lib/types';
import { useSearch } from './useSearch';
import { SearchResults } from './SearchResults';

interface SearchBarProps {
  organizationId: string;
  organizationSlug: string;
  searchVisible?: boolean;
  isMobile?: boolean;
  isStudio?: boolean;
}

export default function SearchBar({
  organizationId,
  organizationSlug,
  searchVisible = true,
  isMobile = false,
  isStudio = false,
}: SearchBarProps): JSX.Element {
  const { searchParams, handleTermChange: handleStudioTermChange } =
    useSearchParams();
  const [isOpened, setIsOpened] = useState(false);
  const { searchQuery, setSearchQuery, searchResults, isLoading } = useSearch(
    organizationId,
    isStudio
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchVisible && isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchVisible, isMobile]);

  useClickOutside(dropdownRef, () => setIsOpened(false));

  const handleTermChange = (session: IExtendedSession) => {
    const path = isStudio
      ? `/studio/${organizationSlug}/library/${session._id.toString()}`
      : `/${organizationSlug}/watch?session=${session._id.toString()}`;
    router.push(path);
  };

  const handleSearch = () => {
    setIsOpened(false);
    if (isStudio) {
      handleStudioTermChange([
        { key: 'searchQuery', value: searchQuery },
        { key: 'page', value: '1' },
      ]);
    } else {
      router.push(
        archivePath({
          organizationSlug,
          searchQuery,
        })
      );
    }
  };

  return (
    <div className="relative flex w-full max-w-[500px] flex-col items-center justify-center p-2">
      <Input
        ref={inputRef}
        className="max-w-[500px] bg-white border-primary border-2"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsOpened(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />

      {isOpened && searchQuery && (
        <div
          ref={dropdownRef}
          className="absolute top-[55px] w-full max-w-[500px] bg-secondary p-2"
        >
          <SearchResults
            isLoading={isLoading}
            searchResults={searchResults}
            onSelect={(result) => {
              handleTermChange(result);
              setIsOpened(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
