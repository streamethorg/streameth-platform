'use client'
import { useState, useContext, useEffect } from 'react'
import { FilterContext, FilterOption } from '../../../../../components/context/FilterContext'

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
        setSelectedItems((prevItems) => [...prevItems, option])
      }
    })
  }, [])

  const handleOptionSelect = (option: FilterOption<T>) => {
    setSelectedItems([option])
    setFilterOptions([...currentFilterOptions, option])
    setFilterInput(option.name)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent form submission if your input is within a form
      performFilter()
    }
  }

  const performFilter = () => {
    if (filterInput === '') {
      clearSelectedOption()
      return
    }
  }

  const clearSelectedOption = () => {
    setSelectedItems([])
    setFilterInput('')
    setFilterOptions([])
  }

  return (
    <div className="flex flex-col justify-between font-light w-full h-full">
      <div className="lg:relative">
        <div className="relative">
          <input
            type="text"
            placeholder={`${filterName}`}
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="p-2 italic border w-full rounded bg-primary text-main-text placeholder:text-main-text placeholder:text-sm"
          />
          <div className="h-full justify-center items-center flex absolute right-0 top-0">
            {selectedItems.length > 0 && (
              <div
                className="flex items-center justify-center  cursor-pointer bold text-white bg-accent rounded w-5 h-5 mr-2 my-auto"
                onClick={clearSelectedOption}>
                X
              </div>
            )}
          </div>
        </div>
        {filterInput && selectedItems.length === 0 && (
          <div className="absolute left-0 md:left-[unset] top-fullborder rounded-b-md shadow-md w-full max-w-[600px] p-4 z-50 bg-primary max-h-40  overflow-auto">
            {filteredOptions().length === 0 ? (
              <div className="py-1">{`No ${filterName} found`}</div>
            ) : (
              filteredOptions().map((option, index) => (
                <div
                  key={index}
                  className="cursor-pointer py-1 lg:text-lg w-full hover:bg-accent hover:text-white"
                  onClick={() => handleOptionSelect(option)}>
                  {option.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchFilter
