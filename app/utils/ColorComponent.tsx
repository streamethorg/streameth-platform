'use client'
import { ReactNode, useEffect, useContext } from 'react'
import { IEvent } from '@/server/model/event'
import { IStage } from '@/server/model/stage'
import { ISpeaker } from '@/server/model/speaker'
import { ISession } from '@/server/model/session'
import { usePathname } from 'next/navigation'
import colors from '@/app/constants/colors'
import { TopNavbarContext } from '@/components/context/TopNavbarContext'
import {
  HomeIcon,
  ViewColumnsIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import FilterBar from '@/app/[organization]/[event]/archive/components/FilterBar'
interface Props {
  children: ReactNode
  event: IEvent
  stages: IStage[]
  speakers: ISpeaker[]
  sessions: ISession[]
}

const ColorComponent = ({
  children,
  event,
  stages,
  speakers,
  sessions,
}: Props) => {
  const pathname = usePathname()
  const { setLogo, setHomePath, setPages, setComponents } =
    useContext(TopNavbarContext)
  const { accentColor, logo, organizationId, id } = event
  const isNotOrganization =
    pathname === '/' || pathname.includes('/admin')

  const pages = [
    {
      href: `/${organizationId}/${id}#home`,
      name: 'Home',
      icon: <HomeIcon />,
    },
  ]

  if (sessions.length > 0)
    pages.push({
      href: `/${organizationId}/${id}#schedule`,
      name: 'Schedule',
      icon: <CalendarIcon />,
    })

  if (speakers.length > 0)
    pages.push({
      href: `/${organizationId}/${id}#speakers`,
      name: 'Speakers',
      icon: <UserGroupIcon />,
    })

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
    if (event.archiveMode) {
      setComponents([
        <FilterBar
          key="1"
          sessions={sessions}
          speakers={speakers}
          stages={stages}
        />,
      ])
    } else {
      setPages([...pages, ...stagePages()])
    }
    return () => {
      setComponents([])
      setPages([])
      setLogo('')
    }
  }, [event])

  useEffect(() => {
    if (!isNotOrganization && accentColor) {
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
  }, [accentColor, isNotOrganization])

  return children
}

export default ColorComponent
