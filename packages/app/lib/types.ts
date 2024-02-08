import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface'
import { IEvent } from 'streameth-new-server/src/interfaces/event.interface'
import { ISession } from 'streameth-new-server/src/interfaces/session.interface'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { ISpeakerModel } from 'streameth-new-server/src/interfaces/speaker.interface'
import { IUser } from 'streameth-new-server/src/interfaces/user.interface'

export interface NavBarProps {
  pages: {
    name: string
    href: string
    bgColor?: string
  }[]
  logo: string
  homePath: string
  showNav: boolean
}

export interface EventPageProps {
  params: {
    event: string
    organization: string
    stage?: string
  }
  searchParams: {
    stage?: string
    date?: string
    page?: number
  }
}
export interface SearchPageProps {
  searchParams: {
    organization?: IOrganization['slug']
    event?: string
    searchQuery?: string
    page?: string
  }
}

export interface WatchPageProps {
  searchParams: {
    event: string
    session: string
    assetId: string
  }
}

export interface IPagination {
  currentPage?: number
  totalPages: number
  totalItems: number
  limit: number
}
export interface studioPageParams {
  params: {
    organization: string
    session: string
  }
  searchParams: {
    eventId: string
    settings: string
    stage: string
  }
}
export interface IExtendedEvent extends IEvent {
  _id: string
}
export interface IExtendedOrganization extends IOrganization {
  _id: string
}
export interface IExtendedSession extends Omit<ISession, '_id'> {
  _id: string
}
export interface IStage extends IStageModel {}
export interface ISpeaker extends ISpeakerModel {}
export interface IExtendedUser extends Omit<IUser, 'organizations'> {
  organizations: IExtendedOrganization[]
}
