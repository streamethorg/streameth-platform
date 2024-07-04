'use client'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { eSort } from '@/lib/types'
import { ChevronsUpDown } from 'lucide-react'

import React from 'react'

const TableSort = ({
  title,
  sortBy,
}: {
  title: string
  sortBy: string
}) => {
  const { searchParams, handleTermChange } = useSearchParams()
  const currentSort = searchParams.get('sort') as eSort

  const handleSortClick = () => {
    let newSort
    if (sortBy === 'date') {
      newSort =
        currentSort === eSort.asc_date
          ? eSort.desc_date
          : eSort.asc_date
    } else if (sortBy === 'name') {
      newSort =
        currentSort === eSort.asc_alpha
          ? eSort.desc_alpha
          : eSort.asc_alpha
    }

    handleTermChange([{ key: 'sort', value: newSort as string }])
  }
  return (
    <div
      className="flex items-center justify-start space-x-2"
      onClick={handleSortClick}>
      <p>{title}</p>
      <ChevronsUpDown
        size={15}
        className="rounded-md hover:bg-gray-200"
      />
    </div>
  )
}

export default TableSort
