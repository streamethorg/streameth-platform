'use client'

import { LayoutGrid, Rows3 } from 'lucide-react'
import { eLayout } from '@/lib/types'
import useSearchParams from '@/lib/hooks/useSearchParams'

const LayoutSelection = () => {
  const { searchParams, handleTermChange } = useSearchParams()
  const currentLayout = searchParams.get('layout')

  const layoutOptions = [
    {
      icon: LayoutGrid,
      value: eLayout.grid,
      activeClass: 'text-white bg-[#3D22BA]',
      inactiveClass: 'hover:text-white hover:bg-[#3D22BA]',
    },
    {
      icon: Rows3,
      value: eLayout.list,
      activeClass: 'text-white bg-[#3D22BA]',
      inactiveClass: 'hover:text-white hover:bg-[#3D22BA]',
    },
  ]

  return (
    <div className="flex justify-end space-x-2">
      {layoutOptions.map(
        ({ icon: Icon, value, activeClass, inactiveClass }) => (
          <Icon
            key={value}
            size={30}
            className={`p-1 rounded-md border transition cursor-pointer ${
              currentLayout === value ? activeClass : inactiveClass
            }`}
            onClick={() =>
              handleTermChange([{ key: 'layout', value }])
            }
          />
        )
      )}
    </div>
  )
}

export default LayoutSelection
