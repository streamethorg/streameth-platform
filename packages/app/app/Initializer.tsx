'use client'
import React, { ReactNode, useEffect } from 'react'
import colors from '../lib/constants/colors'
import { usePathname } from 'next/navigation'

const Initializer = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  const isOrganization =
    pathname === '/' ||
    pathname.match(/^\/[a-zA-Z0-9]+$/) ||
    pathname.includes('admin')

  useEffect(() => {
    // if (isOrganization) {
    document.documentElement.style.setProperty(
      '--colors-accent',
      colors.accent
    )
    //}
  }, [isOrganization])
  return children
}

export default Initializer
