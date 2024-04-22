'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import useSearchParams from '@/lib/hooks/useSearchParams'
import useDebounce from '@/lib/hooks/useDebounce'
import { archivePath } from '@/lib/utils/utils'
import useClickOutside from '@/lib/hooks/useClickOutside'
import { useRouter } from 'next/navigation'
import { fetchSession } from '@/lib/services/sessionService'
interface IEventSearchResult {
  id: string
  name: string
  slug: string
}

interface ISessionSearchResult {
  id: string
  name: string
}

export default function SearchBar({
  organizationSlug,
}: {
  organizationSlug?: string
}): JSX.Element {
  const { searchParams } = useSearchParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('searchQuery') || ''
  )
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<
    ISessionSearchResult[]
  >([])
  const [eventResults, setEventResults] = useState<
    IEventSearchResult[]
  >([])
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const dropdownRef = useRef<HTMLDivElement>(null) // ref for the dropdown
  const inputRef = useRef<HTMLInputElement>(null) // ref for the input field
  const router = useRouter()
  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsLoading(true)
      fetch(
        `/api/search?organization=${organizationSlug}&searchQuery=${debouncedSearchQuery}`
      )
        .then((res) => res.json())
        .then(
          (data: {
            sessions: ISessionSearchResult[]
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

  const handleTermChange = (session: ISessionSearchResult) => {
    alert(organizationSlug)
    if (organizationSlug) {
      router.push(`/${organizationSlug}/watch?session=${session.id}`)
      return
    }
    router.push(archivePath({ searchQuery: session.name }))
    //  handleTermChangeOverload(term)
  }

  const handleEventChange = (term: string) => {
    window.location.href = archivePath({ event: term })
  }

  return (
    <div className="flex max-w-[500px] flex-col items-center justify-center relative w-full p-2">
      <Input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            router.push(archivePath({ event: searchQuery }))
            setIsOpened(false)
          }
        }}
        ref={inputRef}
        onFocus={() => setIsOpened(true)}
        className="max-w-[500px] bg-white"
        placeholder="Search"
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value)
        }}
      />
      {isOpened && debouncedSearchQuery && (
        <div
          ref={dropdownRef}
          className="w-full absolute top-[55px] p-2 max-w-[500px] bg-secondary">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col bg-white">
              {searchResults.length > 0 && (
                <div className="mt-2">
                  <div className="text font-bold">Videos</div>
                  {searchResults.map(
                    (result: ISessionSearchResult) => (
                      <div
                        onClick={() => {
                          handleTermChange(result)
                          setIsOpened(false)
                        }}
                        className="p-1"
                        key={result.id}>
                        {result.name}
                      </div>
                    )
                  )}
                </div>
              )}
              {eventResults.length > 0 && (
                <div className="mt-2 mx-2 p-2">
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
