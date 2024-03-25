'use client'
import React from 'react'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { AccordionItem } from '@/components/ui/accordion'

const NavigationItem = ({
  title,
  navigationPath,
  icon,
}: {
  title: string
  navigationPath: string
  icon: React.ReactNode
}) => {
  const { searchParams, handleTermChange } = useSearchParams()

  const param = searchParams?.get('settings')
  const active =
    param === navigationPath ||
    (!param && navigationPath === 'events')
  return (
    <AccordionItem
      value={title}
      title={title}
      className={`drop-shadow font-light border-none flex flex-row space-x-4 cursor-pointer p-2 ${
        active &&
        'rounded-lg bg-gradient-to-b from-[#4219FF] to-[#3D22BA]'
      }`}
      onClick={() => {
        handleTermChange([
          {
            key: 'settings',
            value: navigationPath,
          },
        ])
      }}>
      {icon} <p>{title}</p>
    </AccordionItem>
  )
}

export default NavigationItem
