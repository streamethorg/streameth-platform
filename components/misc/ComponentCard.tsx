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
        <div className={`flex font-bold flex-row rounded-t  ${!isCollapsed && 'border-b-2 border-accent'} text-main-text p-2 px-4 uppercase `}>
          {title}
          {date && <div className="pt-2 text-sm md:ml-auto md:text-md md:pt-0 text-gray-400">{date.toDateString()}</div>}
          {collapasble && (
            <div className="flex ml-auto md:text-md bold">
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
