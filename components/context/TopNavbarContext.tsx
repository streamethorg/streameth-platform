'use client'
import { createContext, useState } from 'react'

export interface Page {
  name: string
  href: string
  icon: JSX.Element
}

export const TopNavbarContext = createContext<{
  logo: string
  setLogo: React.Dispatch<React.SetStateAction<string>>
  pages: Page[]
  setPages: React.Dispatch<React.SetStateAction<Page[]>>
  homePath?: string
  setHomePath: React.Dispatch<React.SetStateAction<string>>
  stages: Page[] | undefined
  setStages: React.Dispatch<React.SetStateAction<Page[] | undefined>>
}>({
  logo: '',
  setLogo: () => {},
  pages: [],
  setPages: () => {},
  homePath: '',
  setHomePath: () => {},
  stages: [],
  setStages: () => {},
})

export const TopNavbarContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [logo, setLogo] = useState('')
  const [homePath, setHomePath] = useState('')
  const [pages, setPages] = useState<Page[]>([])
  const [stages, setStages] = useState<Page[] | undefined>([])

  return (
    <TopNavbarContext.Provider value={{ logo, setLogo, pages, setPages, homePath, setHomePath, stages, setStages }}>
      {children}
    </TopNavbarContext.Provider>
  )
}
