'use client'
import { createContext, useEffect, useState } from 'react'
import img from '@/public/logo.png'

export const TopNavbarContext = createContext<{
  logo: string
  setLogo: React.Dispatch<React.SetStateAction<string>>
  components: React.ReactNode[]
  setComponents: React.Dispatch<React.SetStateAction<React.ReactNode[]>>
}>({
  logo: '',
  setLogo: () => {},
  components: [],
  setComponents: () => {},
})

export const TopNavbarContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [logo, setLogo] = useState('')
  const [components, setComponents] = useState<React.ReactNode[]>([])
  
  useEffect(() => {
    console.log('logo', logo)
  }, [logo])


  return <TopNavbarContext.Provider value={{ logo, setLogo, components, setComponents }}>{children}</TopNavbarContext.Provider>
}
