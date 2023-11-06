'use client'

import { ReactNode, useEffect, useContext } from 'react'
import { IEvent } from '@/server/model/event'
import { IOrganization } from '@/server/model/organization'
import { IStage } from '@/server/model/stage'
import { ISpeaker } from '@/server/model/speaker'
import { ISession } from '@/server/model/session'
import { TopNavbarContext } from '@/components/context/TopNavbarContext'
import FilterBar from '@/app/[organization]/[event]/archive/components/FilterBar'

interface IBaseProps {
  children: ReactNode
}

interface IEventProps extends IBaseProps {
  event: IEvent
  stages: IStage[]
  speakers: ISpeaker[]
  sessions: ISession[]
}

interface IOrganizationProps extends IBaseProps {
  organization: IOrganization
}

type Props = IEventProps | IOrganizationProps

function isEventProps(props: Props): props is IEventProps {
  return (props as IEventProps).event !== undefined
}

const ColorComponent = (props: Props) => {
  const { setLogo, setHomePath, setPages, setComponents } =
    useContext(TopNavbarContext)

  const entity = isEventProps(props)
    ? props.event
    : props.organization
  const { logo, id } = entity

  const basePath = isEventProps(props)
    ? `/${entity.id}/${id}`
    : `/${id}`

  useEffect(() => {
    setHomePath(basePath)
    if (isEventProps(props) && props.event.logo) {
      setLogo(props.event.logo)
    } else if (entity.logo) {
      setLogo(entity.logo)
    }

    if (isEventProps(props) && props.event.archiveMode) {
      setComponents([
        <FilterBar
          key="1"
          sessions={props.sessions}
          speakers={props.speakers}
          stages={props.stages}
        />,
      ])
    }

    return () => {
      setComponents([])
      setPages([])
      setLogo('')
    }
  }, [entity, props, setComponents, setHomePath, setLogo, setPages])

  useEffect(() => {
    const accentColor = isEventProps(props)
      ? props.event.accentColor
      : props.organization.accentColor

    document.documentElement.style.setProperty(
      '--colors-accent',
      accentColor!
    )

    return () => {
      document.documentElement.style.setProperty(
        '--colors-accent',
        accentColor!
      )
    }
  }, [props, basePath])

  return props.children
}

export default ColorComponent
