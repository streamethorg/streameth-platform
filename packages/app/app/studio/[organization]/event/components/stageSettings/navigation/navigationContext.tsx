'use client'
// NavigationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react'

interface NavigationContextType {
  selectedStage: string
  setSelectedStage: (stage: string) => void
  selectedSetting: string
  setSelectedSetting: (setting: string) => void
}

const initialContext: NavigationContextType = {
  selectedStage: '',
  setSelectedStage: () => {},
  selectedSetting: '',
  setSelectedSetting: () => {},
}

const NavigationContext =
  createContext<NavigationContextType>(initialContext)

export const useNavigation = () => useContext(NavigationContext)

interface NavigationProviderProps {
  children: ReactNode
}

export const NavigationProvider: React.FC<
  NavigationProviderProps
> = ({ children }) => {
  const [selectedStage, setSelectedStage] = useState<string>('')
  const [selectedSetting, setSelectedSetting] =
    useState<string>('settings')

  return (
    <NavigationContext.Provider
      value={{
        selectedStage,
        setSelectedStage,
        selectedSetting,
        setSelectedSetting,
      }}>
      {children}
    </NavigationContext.Provider>
  )
}
