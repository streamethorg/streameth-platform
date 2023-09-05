'use client'
import { useState, useLayoutEffect, useContext, createContext } from 'react'
import { LoadingContext } from './LoadingContext'
const MobileContext = createContext<{
  isMobile: boolean
}>({
  isMobile: true,
})

const MobileContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false)
  const { setIsLoading } = useContext(LoadingContext)
  useLayoutEffect(() => {
    setIsLoading(true)
    function updateSize() {
      setIsMobile(window.innerWidth <= 768)
      setIsLoading(false)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return <MobileContext.Provider value={{ isMobile }}>{children}</MobileContext.Provider>
}

export { MobileContext, MobileContextProvider }
