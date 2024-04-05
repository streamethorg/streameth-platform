'use client'
import React, { useEffect, useRef, useState } from 'react'
import useSearchParams from '@/lib/hooks/useSearchParams'
import useDebounce from '@/lib/hooks/useDebounce'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useClickOutside from '@/lib/hooks/useClickOutside'
import { SearchInput } from '@/components/ui/SearchInput'
const ChannelSearchBar = () => {
  const router = useRouter()
  const { searchParams } = useSearchParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  )
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<string[]>([])
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const dropdownRef = useRef<HTMLDivElement>(null) // ref for the dropdown

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setIsLoading(false)
      router.push(`/streameth?tab=search&search=${searchQuery}`)
    }
  }
  //   useEffect(() => {
  //     if (debouncedSearchQuery) {
  //       setIsLoading(true)
  //       fetch(
  //         '/api/search?searchQuery=' +
  //           debouncedSearchQuery +
  //           '&organization=' +
  //           'streameth'
  //       )
  //         .then((res) => res.json())
  //         .then((data: { sessions: string[] }) => {
  //           setSearchResults(data.sessions)

  //           setIsLoading(false)
  //         })
  //     }
  //   }, [debouncedSearchQuery])
  //   useClickOutside(dropdownRef, () => setIsOpened(false))

  return (
    <div className="absolute end-0 pr-2 pb-2">
      <SearchInput
        width={200}
        placeholder="search channel"
        value={searchQuery}
        onFocus={() => setIsOpened(true)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value)
        }}
        onKeyDown={handleKeyDown}
      />
      {/* {isOpened && debouncedSearchQuery && (
        <div
          ref={dropdownRef}
          className="absolute text-sm w-[200px] z-50 bg-white">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col bg-white border border-x-black border-b-black rounded-b-xl">
              {searchResults.length > 0 && (
                <div className="mt-2 z-10">
                  {searchResults.map((result: string) => (
                    <Link
                      href={`/streameth?tab=search&search=${result}`}
                      onClick={() => {
                        setIsOpened(false)
                      }}
                      className="p-1 flex flex-col"
                      key={result}>
                      <p className="hover:bg-muted">{result}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )} */}
    </div>
  )
}

export default ChannelSearchBar
