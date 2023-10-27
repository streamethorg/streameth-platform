'use client'
import React, { ReactNode, useEffect } from 'react'
import colors from './constants/colors'

const Initializer = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--colors-accent',
      colors.accent
    )
  }, [])
  return children
}

export default Initializer
