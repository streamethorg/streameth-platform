'use client'
import React, { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const ComponentCard = ({
  children,
  title,
  date,
  collapasble,
  streatch,
}: {
  title?: string
  date?: Date
  children: React.ReactNode
  collapasble?: boolean
  streatch?: boolean
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`shadow rounded flex flex-col bg-base ${streatch && 'flex-grow'}`}>
      {title && (
        <div className={`flex font-bold flex-col rounded-t  ${!isCollapsed && 'border-b-2 border-accent'} text-main-text p-2 px-4 uppercase `}>
          <div className="flex-grow text-left">Watching: {title}</div>
          {date && <div className="ml-auto pt-2 md:pl-1 text-sm md:text-md text-gray-400">{new Date(date).toDateString()}</div>}
          {collapasble && (
            <div className="flex ml-2">
              <button className="focus:outline-none" onClick={toggleCollapse}>
                <ChevronDownIcon className={`w-6 ${isCollapsed ? 'text-accent transform rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      )}
      {!isCollapsed && <div className="p-4 flex flex-col h-full">{children}</div>}
    </div>
  )
}

export default ComponentCard
