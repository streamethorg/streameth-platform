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
  showNav?: boolean
  setShowNav?: React.Dispatch<React.SetStateAction<boolean>>
  components: React.ReactNode[]
  setComponents: React.Dispatch<React.SetStateAction<React.ReactNode[]>>
}>({
  logo: '',
  setLogo: () => {},
  pages: [],
  setPages: () => {},
  homePath: '',
  setHomePath: () => {},
  stages: [],
  setStages: () => {},
  showNav: true,
  setShowNav: () => {},
  components: [],
  setComponents: () => {},
})

export const TopNavbarContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [logo, setLogo] = useState('')
  const [homePath, setHomePath] = useState('')
  const [pages, setPages] = useState<Page[]>([])
  const [stages, setStages] = useState<Page[] | undefined>([])
  const [showNav, setShowNav] = useState(true)
  const [components, setComponents] = useState<React.ReactNode[]>([])
  return (
    <TopNavbarContext.Provider
      value={{
        logo,
        setLogo,
        pages,
        setPages,
        homePath,
        setHomePath,
        stages,
        setStages,
        showNav,
        setShowNav,
        components,
        setComponents,
      }}>
      {children}
    </TopNavbarContext.Provider>
  )
}
