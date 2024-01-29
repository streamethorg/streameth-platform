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
  selectedSetting: 'stages' | 'event'
  setSelectedSetting: (setting: string) => void
  selectedStageSetting: 'settings' | 'clip'
  setSelectedStageSetting: (setting: string) => void
}

const initialContext: NavigationContextType = {
  selectedStage: '',
  setSelectedStage: () => {},
  selectedSetting: 'event',
  setSelectedSetting: () => {},
  selectedStageSetting: 'settings',
  setSelectedStageSetting: () => {},
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
    useState<NavigationContextType['selectedSetting']>('event')
  const [selectedStageSetting, setSelectedStageSetting] =
    useState<NavigationContextType['selectedStageSetting']>(
      'settings'
    )
  console.log(selectedSetting)
  return (
    <NavigationContext.Provider
      value={{
        selectedStage,
        setSelectedStage,
        selectedSetting,
        setSelectedSetting,
        selectedStageSetting,
        setSelectedStageSetting,
      }}>
      {children}
    </NavigationContext.Provider>
  )
}
