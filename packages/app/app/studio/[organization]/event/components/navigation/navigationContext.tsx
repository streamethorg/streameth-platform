'use client'
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
  setSelectedSetting: (setting: 'stages' | 'event') => void // Specify exact string literals
  selectedStageSetting: 'settings' | 'clip'
  setSelectedStageSetting: (setting: 'settings' | 'clip') => void // Specify exact string literals
}

const initialContext: NavigationContextType = {
  selectedStage: '',
  setSelectedStage: () => {},
  selectedSetting: 'event',
  setSelectedSetting: () => {}, // This will be overridden with a more specific function in the provider
  selectedStageSetting: 'settings',
  setSelectedStageSetting: () => {}, // This will be overridden with a more specific function in the provider
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
  const [selectedSetting, setSelectedSetting] = useState<
    'stages' | 'event'
  >('event')
  const [selectedStageSetting, setSelectedStageSetting] = useState<
    'settings' | 'clip'
  >('settings')

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
