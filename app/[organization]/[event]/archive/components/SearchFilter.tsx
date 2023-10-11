'use client'
import { useState, useContext, useEffect } from 'react'
import { FilterContext, FilterOption } from './FilterContext'

interface FilterProps<T> {
  filterOptions: FilterOption<T>[]
  filterName: string
}

const SearchFilter = <T extends object>({ filterOptions, filterName }: FilterProps<T>) => {
  const { setFilterOptions, filterOptions: currentFilterOptions } = useContext(FilterContext)
  const [selectedItems, setSelectedItems] = useState<FilterOption<T>[]>([])
  const [filterInput, setFilterInput] = useState<string>('')

  const filteredOptions = () => {
    if (filterInput === '') {
      return filterOptions
    }
    return filterOptions.filter((option) => option.name.toLowerCase().includes(filterInput.toLowerCase()))
  }

  useEffect(() => {
    currentFilterOptions.forEach((option) => {
      if (!selectedItems.includes(option) && option.type === filterOptions[0].type) {
        setSelectedItems(prevItems => [...prevItems, option])
      }
    })
  }, [])

  const handleOptionSelect = (option: FilterOption<T>) => {
    setSelectedItems([option])
    setFilterOptions([...currentFilterOptions, option])
    setFilterInput(option.name)
  }

  const clearSelectedOption = () => {
    setSelectedItems([])
    setFilterInput('')
    setFilterOptions([])

  }

  return (
    <div className="flex flex-col justify-between font-light w-full">
      <div className="relative">
        <input
          type="text"
          placeholder={` ${filterName}`}
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          className="p-2 h-12 border w-full rounded bg-primary text-main-text placeholder:text-main-text placeholder:text-sm"
        />
        {filterInput && selectedItems.length === 0 && (
          <div className="absolute top-fullborder rounded-b-md shadow-md left-0 z-10 bg-primary max-h-40 w-full overflow-auto">
            {filteredOptions().length === 0 ? (
              <div className="py-1">{`No ${filterName} found`}</div>
            ) : (
              filteredOptions().map((option, index) => (
                <div key={index} className="cursor-pointer py-1" onClick={() => handleOptionSelect(option)}>
                  {option.name}
                </div>
              ))
            )}
          </div>
        )}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-center absolute right-0 top-0 mt-4 mr-2 cursor-pointer bold text-white bg-accent rounded w-5 h-5" onClick={clearSelectedOption}>
            x
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchFilter
