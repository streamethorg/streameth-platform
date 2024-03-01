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
  const active = param === navigationPath
  return (
    <AccordionItem
      value={title}
      title={title}
      className={`p-4 flex flex-row space-x-2 cursor-pointer ${
        active
          ? 'bg-primary-foreground text-primary border-b-0 border-t-0 border-l-4 border-primary'
          : 'border-none '
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
