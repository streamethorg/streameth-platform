'use client'
import { ReactNode, useEffect } from 'react'

import { usePathname } from 'next/navigation'
import colors from '@/lib/constants/colors'

interface Props {
  children: ReactNode
  accentColor?: string
}

const ColorComponent = ({ children, accentColor }: Props) => {
  const pathname = usePathname()
  // const { setLogo, setHomePath, setPages, setComponents } =
  //   useContext(TopNavbarContext)

  // const { accentColor, logo, organizationId, id } = event
  // const isNotOrganization =
  //   pathname === '/' || pathname.match(/^\/[a-zA-Z0-9]+$/)

  // const pages: Page[] = []

  // useEffect(() => {
  //   setLogo('/events/' + logo)
  //   if (event.archiveMode) {
  //     if (!pathname.includes('/session/')) {
  //       setComponents([
  //         <FilterBar
  //           key="1"
  //           sessions={sessionWithVideo}
  //           speakers={speakers}
  //           stages={stages}
  //         />,
  //       ])
  //     }
  //   } else {
  //     setPages([...pages, ...stagePages()])
  //   }
  //   return () => {
  //     setComponents([])
  //     setPages([])
  //     setLogo('')
  //   }
  // }, [event, pathname])

  useEffect(() => {
    if (accentColor) {
      document.documentElement.style.setProperty(
        '--colors-accent',
        accentColor
      )
    } else {
      document.documentElement.style.setProperty(
        '--colors-accent',
        colors.accent
      )
    }
    return () => {
      document.documentElement.style.setProperty(
        '--colors-accent',
        colors.accent
      )
    }
  }, [accentColor, pathname])

  return children
}

export default ColorComponent
