'use client'
import { createContext, useEffect, useState } from 'react'
import img from '@/public/logo.png'

export const TopNavbarContext = createContext<{
  logo: string
  setLogo: React.Dispatch<React.SetStateAction<string>>
  components: React.ReactNode[]
  setComponents: React.Dispatch<React.SetStateAction<React.ReactNode[]>>
  homePath?: string
  setHomePath: React.Dispatch<React.SetStateAction<string>>
}>({
  logo: '',
  setLogo: () => {},
  components: [],
  setComponents: () => {},
  homePath: '',
  setHomePath: () => {},
})

export const TopNavbarContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [logo, setLogo] = useState('')
  const [homePath, setHomePath] = useState('')

  const [components, setComponents] = useState<React.ReactNode[]>([])

  return <TopNavbarContext.Provider value={{ logo, setLogo, components, setComponents, homePath, setHomePath }}>{children}</TopNavbarContext.Provider>
}
