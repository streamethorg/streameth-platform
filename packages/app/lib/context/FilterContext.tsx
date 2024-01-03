'use client'
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react'
import { LoadingContext } from '@/lib/context/LoadingContext'
export interface FilterOption<T> {
  name: string
  value: string | number
  type: string
  filterFunc: (item: T) => Promise<boolean>
}

const FilterContext = createContext<{
  items: any[]
  setItems: React.Dispatch<React.SetStateAction<any[]>>
  filteredItems: any[]
  filterOptions: FilterOption<any>[]
  setFilterOptions: React.Dispatch<
    React.SetStateAction<FilterOption<any>[]>
  >
}>({
  items: [],
  setItems: () => {},
  filteredItems: [],
  filterOptions: [],
  setFilterOptions: () => {},
})
const FilterContextProvider = <T extends object>({
  children,
}: {
  children: React.ReactNode
}) => {
  const [filterOptions, setFilterOptions] = useState<
    FilterOption<T>[]
  >([])
  const [items, setItems] = useState<T[]>([])
  const [filteredItems, setFilteredItems] = useState<T[]>(items)
  const { setIsLoading } = useContext(LoadingContext)

  const filterItems = async () => {
    let returnItems: T[] = [...items]
    if (filterOptions.length > 0) {
      for (const filterOption of filterOptions) {
        const filterResults = await Promise.all(
          returnItems.map(
            async (item) => await filterOption.filterFunc(item)
          )
        )
        returnItems = returnItems.filter(
          (_, index) => filterResults[index]
        )
      }
    }
    return returnItems
  }

  useEffect(() => {
    setIsLoading(true)
    filterItems()
      .then((items) => {
        setFilteredItems(items)
      })
      .finally(() => {
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOptions, items])

  return (
    <FilterContext.Provider
      value={{
        items,
        setItems,
        filteredItems,
        filterOptions,
        setFilterOptions,
      }}>
      {children}
    </FilterContext.Provider>
  )
}

export { FilterContext, FilterContextProvider }
