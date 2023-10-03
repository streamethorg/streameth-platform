'use client'
import React, { ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import colors from '@/constants/colors'

interface Props {
  children: ReactNode
  accentColor: string
}

const ColorComponent = ({ children, accentColor }: Props) => {
  const pathname = usePathname()

  const isNotOrganization = pathname === '/' || pathname === '/admin'
  useEffect(() => {
    if (!isNotOrganization) {
      document.documentElement.style.setProperty('--colors-accent', accentColor)
    } else {
      document.documentElement.style.setProperty('--colors-accent', colors.accent)
    }
  }, [accentColor, isNotOrganization])

  return children
}

export default ColorComponent
