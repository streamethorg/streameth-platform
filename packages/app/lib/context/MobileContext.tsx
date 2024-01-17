'use client'
import {
  useState,
  useLayoutEffect,
  useContext,
  createContext,
} from 'react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { LoadingContext } from './LoadingContext'
const MobileContext = createContext<{
  isMobile: boolean
}>({
  isMobile: true,
})

const MobileContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const desktop = '(min-width: 768px)'
  const [isMobile, setIsMobile] = useState(!useMediaQuery(desktop))

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  )
}

export { MobileContext, MobileContextProvider }
