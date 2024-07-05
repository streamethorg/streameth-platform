'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import useSearchParams from '@/lib/hooks/useSearchParams'
import useDebounce from '@/lib/hooks/useDebounce'
import { apiUrl, archivePath } from '@/lib/utils/utils'
import useClickOutside from '@/lib/hooks/useClickOutside'
import { useRouter } from 'next/navigation'
import { IExtendedSession } from '@/lib/types'
import { LoaderCircle } from 'lucide-react'

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
  searchVisible = true,
  isMobile = false,
}: {
  organizationSlug: string
  searchVisible?: boolean
  isMobile?: boolean
}): JSX.Element {
  const { searchParams } = useSearchParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('searchQuery') || ''
  )
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<
    IExtendedSession[]
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
        `${apiUrl()}/sessions/${organizationSlug}/search?search=${debouncedSearchQuery}`
      )
        .then((res) => res.json())
        .then((data) => {
          const items = data.data
            .map((obj: any) => obj.item)
            .slice(0, 10)

          setSearchResults(items)
          setIsLoading(false)
        })
    }
  }, [debouncedSearchQuery])

  useEffect(() => {
    if (searchVisible && isMobile && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchVisible])

  useClickOutside(dropdownRef, () => setIsOpened(false))

  const handleTermChange = (session: IExtendedSession) => {
    router.push(
      `/${organizationSlug}/watch?session=${session._id.toString()}`
    )
    return
  }

  const handleEventChange = (term: string) => {
    window.location.href = archivePath({
      organizationSlug: organizationSlug,
      event: term,
    })
  }

  return (
    <div className="relative flex w-full max-w-[500px] flex-col items-center justify-center p-2">
      <Input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setIsOpened(false)
            router.push(
              archivePath({
                organizationSlug: organizationSlug,
                searchQuery: searchQuery,
              })
            )
          }
        }}
        ref={inputRef}
        onFocus={() => setIsOpened(true)}
        className="max-w-[500px] bg-white"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value)
        }}
      />
      {isOpened && debouncedSearchQuery && (
        <div
          ref={dropdownRef}
          className="absolute top-[55px] w-full max-w-[500px] bg-secondary p-2">
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <div className="flex flex-col bg-white">
              {searchResults.length > 0 && (
                <div className="mt-2">
                  <div className="text p-1 font-bold">Videos</div>
                  {searchResults.map((result) => (
                    <div
                      onClick={() => {
                        handleTermChange(result)
                        setIsOpened(false)
                      }}
                      className="cursor-pointer p-1 hover:bg-gray-100"
                      key={result._id.toString()}>
                      {result.name}
                    </div>
                  ))}
                </div>
              )}
              {/*{eventResults.length > 0 && (
                <div className="p-2 mx-2 mt-2">
                  <div className="font-bold text">Events</div>
                  {eventResults.map((result: IEventSearchResult) => (
                    <div
                      onClick={() => {
                        handleEventChange(result.slug)
                        setIsOpened(false)
                      }}
                      className="p-1"
                      key={result.name}>
                      {result.name}
                    </div>
                  ))}
                </div>
              )}*/}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
