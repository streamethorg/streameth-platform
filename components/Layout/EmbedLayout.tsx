'use client'
import { useContext, useEffect } from 'react'
import { TopNavbarContext } from '../context/TopNavbarContext'

const EmbedLayout = ({ children }: { children: React.ReactNode }) => {
  const { setShowNav } = useContext(TopNavbarContext)

  useEffect(() => {
    setShowNav(false)
  }, [])

  return children
}

export default EmbedLayout
