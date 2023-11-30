'use client'
import {
  ReactNode,
  useEffect,
  useContext,
  ReactComponentElement,
} from 'react'

import { usePathname } from 'next/navigation'
import colors from '@/app/constants/colors'
import {
  Page,
  TopNavbarContext,
} from '@/components/context/TopNavbarContext'
import {
  HomeIcon,
  ViewColumnsIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import FilterBar from '@/app/[organization]/[event]/archive/components/FilterBar'
import { IEvent } from 'streameth-server/model/event'
import { IStage } from 'streameth-server/model/stage'
import { ISpeaker } from 'streameth-server/model/speaker'
import { ISession } from 'streameth-server/model/session'
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
    pathname === '/' || pathname.match(/^\/[a-zA-Z0-9]+$/)

  const pages: Page[] = []

  const sessionWithVideo = sessions.filter(
    (session) => session.videoUrl
  )

  if (sessionWithVideo.length > 0)
    pages.push({
      href: `/${organizationId}/${id}/archive`,
      name: 'Archive',
      icon: <ViewColumnsIcon />,
    })

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
      if (!pathname.includes('/session/')) {
        setComponents([
          <FilterBar
            key="1"
            sessions={sessionWithVideo}
            speakers={speakers}
            stages={stages}
          />,
        ])
      }
    } else {
      setPages([...pages, ...stagePages()])
    }
    return () => {
      setComponents([])
      setPages([])
      setLogo('')
    }
  }, [event, pathname])

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
  }, [accentColor, isNotOrganization, pathname])

  return children
}

export default ColorComponent
