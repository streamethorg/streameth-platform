'use client'
import { ReactNode, useEffect, useContext } from 'react'
import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'
import { usePathname } from 'next/navigation'
import colors from '@/constants/colors'
import { TopNavbarContext } from '@/components/context/TopNavbarContext'
import { HomeIcon, ViewColumnsIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'

interface Props {
  children: ReactNode
  event: IEvent
  stages: IStage[]
}

const ColorComponent = ({ children, event, stages }: Props) => {
  const pathname = usePathname()
  const { setLogo, setHomePath, setPages } = useContext(TopNavbarContext)
  const { accentColor, logo, organizationId, id } = event
  const isNotOrganization = pathname === '/' || pathname === '/admin'

  const pages = [
    {
      href: `/${organizationId}/${id}#home`,
      name: 'Home',
      icon: <HomeIcon />,
    },
    {
      href: `/${organizationId}/${id}#schedule`,
      name: 'Schedule',
      icon: <CalendarIcon />,
    },
    {
      href: `/${organizationId}/${id}#speakers`,
      name: 'Speakers',
      icon: <UserGroupIcon />,
    },
  ]

  const stagePages = () => {
    let pages = []
    for (const stage of stages) {
      if (stage.streamSettings.streamId) {
        pages.push({
          href: `/${organizationId}/${id}/stage/${stage.id}`,
          name: stage.name,
          icon: <ViewColumnsIcon />,
        })
      }
    }
    return pages
  }

  useEffect(() => {
    setHomePath(`/${organizationId}/${id}`)
  }, [pathname])

  useEffect(() => {
    setLogo('/events/' + logo)
    setPages([...pages, ...stagePages()])

  }, [event])

  useEffect(() => {
    if (!isNotOrganization && accentColor) {
      document.documentElement.style.setProperty('--colors-accent', accentColor)
    } else {
      document.documentElement.style.setProperty('--colors-accent', colors.accent)
    }
  }, [accentColor, isNotOrganization])

  return children
}

export default ColorComponent
