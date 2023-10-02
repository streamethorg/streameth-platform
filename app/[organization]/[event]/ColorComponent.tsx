'use client'
import React, { ReactNode, useEffect } from 'react'

interface Props {
  children: ReactNode
  accentColor: string
}

const ColorComponent = ({ children, accentColor }: Props) => {
  useEffect(() => {
    document.documentElement.style.setProperty('--colors-accent', accentColor)
  }, [accentColor])

  return <div>{children}</div>
}

export default ColorComponent
