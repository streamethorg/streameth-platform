'use client'
import React, { ReactNode, useEffect } from 'react'
import colors from './constants/colors'
import { usePathname } from 'next/navigation'

const Initializer = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  const isOrganization =
    pathname === '/' || pathname.match(/^\/[a-zA-Z0-9]+$/)
  useEffect(() => {
    if (isOrganization) {
      document.documentElement.style.setProperty(
        '--colors-accent',
        colors.accent
      )
    }
  }, [])
  return children
}

export default Initializer
