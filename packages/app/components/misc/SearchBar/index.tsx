'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import useSearchParams from '@/lib/hooks/useSearchParams'
import useDebounce from '@/lib/hooks/useDebounce'
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
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const dropdownRef = useRef<HTMLDivElement>(null) // ref for the dropdown
  const inputRef = useRef<HTMLInputElement>(null) // ref for the input field

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsLoading(true)
      fetch('/api/search?searchQuery=' + debouncedSearchQuery)
        .then((res) => res.json())
        .then((data: string[]) => {
          setSearchResults(data)
          setIsLoading(false)
        })
    }
  }, [debouncedSearchQuery])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpened(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleTermChange = (term: string) => {
    window.location.href = '/archive?searchQuery=' + term
    //  handleTermChangeOverload(term)
  }

  return (
    <div className="flex max-w-[500px] flex-col items-center justify-center relative w-full md:ml-[-230px] ">
      <Input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleTermChange(searchQuery)
            setIsOpened(false)
          }
        }}
        ref={inputRef}
        onFocus={() => setIsOpened(true)}
        className="max-w-[500px] bg-white border-background text-background"
        placeholder="Search"
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value)
        }}
      />
      {isOpened && debouncedSearchQuery && (
        <div
          ref={dropdownRef}
          className="rounded bg-background mt-1 w-full absolute top-[41px] max-w-[500px]">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col p-2">
              {searchResults.length > 0 ? (
                searchResults.map((result: string) => (
                  <div
                    onClick={() => {
                      handleTermChange(result)
                      setIsOpened(false)
                    }}
                    className="p-1 hover:bg-white hover:text-background"
                    key={result}>
                    {result}
                  </div>
                ))
              ) : (
                <div>No results</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
