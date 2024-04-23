'use client'

import Combobox from '@/components/ui/combo-box'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { eSort } from '@/lib/types'

import React from 'react'

const sortOptions = [
  { value: 'desc_alpha', label: 'name' },
  { value: 'desc_date', label: 'recent' },
]

const MintNftSort = () => {
  const { searchParams, handleTermChange } = useSearchParams()
  const currentSort = searchParams.get('sort') as eSort
  const selectedSort = sortOptions?.find(
    (s) => s?.value === currentSort
  )?.label
  return (
    <div className="flex gap-2 items-center font-medium">
      <p className="w-full">Sort By</p>

      <Combobox
        items={sortOptions as any[]}
        variant="ghost"
        value={selectedSort || 'default'}
        setValue={(value) => {
          handleTermChange([{ key: 'sort', value: value }])
        }}
      />
    </div>
  )
}

export default MintNftSort
