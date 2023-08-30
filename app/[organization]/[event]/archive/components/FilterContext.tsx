'use client'
import React, { useState, createContext, useContext, useEffect } from 'react'
import { LoadingContext } from '@/components/context/LoadingContext'
export interface FilterOption<T> {
  name: string
  value: string
  type: string
  filterFunc: (item: T) => Promise<boolean>
}

const FilterContext = createContext<{
  items: any[]
  filteredItems: any[]
  filterOptions: FilterOption<any>[]
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOption<any>[]>>
}>({
  items: [],
  filteredItems: [],
  filterOptions: [],
  setFilterOptions: () => {},
})
const FilterContextProvider = <T extends object>({ children, items }: { children: React.ReactNode; items: T[] }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOption<T>[]>([])
  const [filteredItems, setFilteredItems] = useState<T[]>(items)
  const { setIsLoading } = useContext(LoadingContext)

  const filterItems = async () => {
    let returnItems: T[] = [...items]
    console.log(filterOptions)
    if (filterOptions.length > 0) {
      for (const filterOption of filterOptions) {
        const filterResults = await Promise.all(returnItems.map(async (item) => await filterOption.filterFunc(item)))
        returnItems = returnItems.filter((_, index) => filterResults[index])
      }
    }
    return returnItems
  }

  useEffect(() => {
    filterItems().then((items) => {
      setFilteredItems(items)
      setIsLoading(false)
    })
  }, [filterOptions])

  return (
    <FilterContext.Provider
      value={{
        items,
        filteredItems,
        filterOptions,
        setFilterOptions,
      }}>
      {children}
    </FilterContext.Provider>
  )
}

export { FilterContext, FilterContextProvider }
