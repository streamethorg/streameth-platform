'use client'
import { useState, useLayoutEffect, createContext } from 'react'

const MobileContext = createContext<{
  isMobile: boolean
  isLoading: boolean
}>({
  isMobile: true,
  isLoading: true,
})

const MobileContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  useLayoutEffect(() => {
    function updateSize() {
      setIsMobile(window.innerWidth <= 768)
      setIsLoading(false)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return <MobileContext.Provider value={{ isMobile, isLoading }}>{children}</MobileContext.Provider>
}

export { MobileContext, MobileContextProvider }
