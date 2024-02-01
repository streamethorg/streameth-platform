'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import useSearchParams from '@/lib/hooks/useSearchParams'
import useDebounce from '@/lib/hooks/useDebounce'
import { archivePath } from '@/lib/utils/path'
import useClickOutside from '@/lib/hooks/useClickOutside'

interface IEventSearchResult {
  id: string
  name: string
  slug: string
}
export default function SearchBar(): JSX.Element {
  const { searchParams, handleTermChange: handleTermChangeOverload } =
    useSearchParams({
      key: 'searchQuery',
    })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('searchQuery') || ''
  )
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [eventResults, setEventResults] = useState<
    IEventSearchResult[]
  >([])
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const dropdownRef = useRef<HTMLDivElement>(null) // ref for the dropdown
  const inputRef = useRef<HTMLInputElement>(null) // ref for the input field

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsLoading(true)
      fetch('/api/search?searchQuery=' + debouncedSearchQuery)
        .then((res) => res.json())
        .then(
          (data: {
            sessions: string[]
            events: IEventSearchResult[]
          }) => {
            setSearchResults(data.sessions)
            setEventResults(data.events)
            setIsLoading(false)
          }
        )
    }
  }, [debouncedSearchQuery])

  useClickOutside(dropdownRef, () => setIsOpened(false))

  const handleTermChange = (term: string) => {
    window.location.href = archivePath({ searchQuery: term })
    //  handleTermChangeOverload(term)
  }

  const handleEventChange = (term: string) => {
    window.location.href = archivePath({ event: term })
  }

  return (
    <div className="flex max-w-[500px] flex-col items-center justify-center relative w-full">
      <Input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleTermChange(searchQuery)
            setIsOpened(false)
          }
        }}
        ref={inputRef}
        onFocus={() => setIsOpened(true)}
        className="max-w-[500px]"
        placeholder="Search"
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value)
        }}
      />
      {isOpened && debouncedSearchQuery && (
        <div
          ref={dropdownRef}
          className="rounded  mt-1 w-full absolute top-[41px] max-w-[500px]">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col p-2">
              {searchResults.length > 0 && (
                <div className="mt-2">
                  <div className="text font-bold">Videos</div>
                  {searchResults.map((result: string) => (
                    <div
                      onClick={() => {
                        handleTermChange(result)
                        setIsOpened(false)
                      }}
                      className="p-1"
                      key={result}>
                      {result}
                    </div>
                  ))}
                </div>
              )}
              {eventResults.length > 0 && (
                <div className="mt-2">
                  <div className="text font-bold">Events</div>
                  {eventResults.map((result: IEventSearchResult) => (
                    <div
                      onClick={() => {
                        handleEventChange(result.slug)
                        setIsOpened(false)
                      }}
                      className="p-1 "
                      key={result.name}>
                      {result.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
