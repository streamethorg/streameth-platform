'use client'
import { useContext, useEffect, useState } from 'react'
import { IEvent } from '@/server/model/event'
import SearchFilter from '@/app/[organization]/[event]/archive/components/SearchFilter'
import { FilterContext } from '@/components/context/FilterContext'

const FilterBar = ({ events }: { events: IEvent[] }) => {
  const { filteredItems, setFilterOptions } = useContext(FilterContext)
  const [isShowCurrent, setIsShowCurrent] = useState(false)
  const [hasCheckedEmptyUpcoming, setHasCheckedEmptyUpcoming] = useState(false)

  const eventFilter = events.map((event) => {
    return {
      name: event.name,
      value: event.id,
      type: 'event',
      filterFunc: async (item: IEvent) => {
        return item.id === event.id
      },
    }
  })

  const handleTabClick = () => {
    setFilterOptions([
      {
        name: 'date',
        value: 'date',
        type: 'date',
        filterFunc: async (item: IEvent) => {
          const endOfDay = new Date(item.end)
          endOfDay.setHours(23, 59, 59, 999)

          const startOfDay = new Date()
          startOfDay.setHours(0, 0, 0, 0)

          return isShowCurrent ? endOfDay.getTime() <= Date.now() : endOfDay.getTime() > startOfDay.getTime()
        },
      },
    ])
  }

  useEffect(() => {
    handleTabClick()
  }, [isShowCurrent])

  // If 'Upcoming events' is empty is switches to 'Past events'
  if (filteredItems.length === 0 && isShowCurrent === false) {
    setIsShowCurrent(true)
    setHasCheckedEmptyUpcoming(true)
  }

  return (
    <div className="bg-base p-4 sticky top-0 z-40 w-full flex justify-center items-center drop-shadow-md">
      <div className=" w-full flex flex-col sm:flex-row items-center">
        <div className="flex flex-row w-full justify-center md:justify-start">
          {!hasCheckedEmptyUpcoming && (
            <h1
              className={` text-xl md:text-2xl font-bold  ${
                isShowCurrent ? 'text-secondary-text cursor-pointer' : 'text-main-text'
              } border-r-2 border-accent pr-4`}
              onClick={() => setIsShowCurrent(false)}>
              Upcoming events
            </h1>
          )}
          <h1
            className={`text-xl md:text-2xl text-main-text font-bold ${!hasCheckedEmptyUpcoming ? 'ml-4' : ''} ${
              !isShowCurrent ? 'text-secondary-text cursor-pointer' : 'text-main-text'
            }`}
            onClick={() => setIsShowCurrent(true)}>
            Past events
          </h1>
        </div>
        <div className="w-full max-w-[20rem] m-auto lg:ml-auto my-4">
          <SearchFilter filterOptions={eventFilter} filterName="Search for an event..." />
        </div>
      </div>
    </div>
  )
}

export default FilterBar
