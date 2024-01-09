'use client'
import { ReactNode, useEffect } from 'react'

import { usePathname } from 'next/navigation'
import colors from '@/lib/constants/colors'

interface Props {
  children: ReactNode
  accentColor?: string
}

const ColorComponent = ({ children, accentColor }: Props) => {
  const pathname = usePathname()

  useEffect(() => {
    if (accentColor) {
      document.documentElement.style.setProperty(
        '--background',
        accentColor
      )
    } else {
      document.documentElement.style.setProperty(
        '--colors-accent',
        colors.accent
      )
    }
    return () => {
      document.documentElement.style.setProperty(
        '--colors-accent',
        colors.accent
      )
    }
  }, [accentColor, pathname])

  return children
}

export default ColorComponent
